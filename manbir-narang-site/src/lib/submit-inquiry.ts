"use server";

import { Resend } from "resend";
import { getSupabase } from "@/lib/supabase";

type InquiryResult = { ok: true } | { ok: false; error: "offline" | "invalid" | "save" };

type Kind = "contact" | "valuation";
const INTERESTS = ["Buying", "Selling", "Something else"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_FROM = "onboarding@resend.dev";

function text(value: FormDataEntryValue | null): string {
  return String(value ?? "").replace(/\r\n/g, "\n").trim();
}

function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
}

function optional(value: string): string | null {
  return value ? value : null;
}

function formType(kind: Kind, listing: string): string {
  if (kind === "valuation") return "Home valuation";
  if (listing) return "Listing inquiry";
  return "Contact";
}

function pageLabel(source: string): string {
  const path = oneLine(source).slice(0, 300);
  if (!path) return "(not provided)";
  const base = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? "";
  if (path.startsWith("/") && base) return `${base}${path}`;
  return path;
}

function vancouverStamp(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Vancouver",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

function notifyRecipients(): string[] {
  return (process.env.LEAD_NOTIFY_EMAIL ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter((part) => EMAIL_RE.test(part));
}

function emailBody(input: {
  formType: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  interest: string | null;
  message: string | null;
  listing: string;
  page: string;
  submitted: string;
}): string {
  const line = (label: string, value: string | null) => `${label}: ${value?.trim() ? value.trim() : "(none)"}`;
  return [
    "New website inquiry",
    "",
    line("Form", input.formType),
    line("Page", input.page),
    line("Listing", input.listing || null),
    line("Submitted", input.submitted),
    "",
    line("Name", input.name),
    line("Email", input.email),
    line("Phone", input.phone),
    line("Address", input.address),
    line("Interest", input.interest),
    line("Message", input.message),
  ].join("\n");
}

/** Best-effort. A missing key or a send failure must not undo a saved enquiry. */
async function notify(input: Parameters<typeof emailBody>[0] & { replyTo: string }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = notifyRecipients();
  if (!apiKey) {
    console.error("[inquiry] RESEND_API_KEY is not set; enquiry was saved and no email was sent");
    return;
  }
  if ((process.env.LEAD_NOTIFY_EMAIL ?? "").trim() && to.length === 0) {
    console.error("[inquiry] LEAD_NOTIFY_EMAIL has no valid address; enquiry was saved and no email was sent");
    return;
  }
  if (to.length === 0) {
    console.error("[inquiry] LEAD_NOTIFY_EMAIL is not set; enquiry was saved and no email was sent");
    return;
  }
  const from = process.env.LEAD_FROM_EMAIL?.trim() || DEFAULT_FROM;
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: input.replyTo,
      subject: oneLine(`New website inquiry: ${input.formType} from ${input.name}`).slice(0, 200),
      text: emailBody(input),
    });
    if (error) console.error("[inquiry] Resend rejected the notification", error);
  } catch (err) {
    console.error("[inquiry] Resend notification failed", err);
  }
}

export async function submitInquiry(
  formData: FormData,
  meta: { kind: string; source: string; listing?: string },
): Promise<InquiryResult> {
  if (text(formData.get("website"))) {
    console.info("[inquiry] honeypot filled; ignored");
    return { ok: true };
  }

  const kind = meta.kind;
  if (kind !== "contact" && kind !== "valuation") return { ok: false, error: "invalid" };

  const name = text(formData.get("name"));
  const email = oneLine(text(formData.get("email")));
  const phoneRaw = text(formData.get("phone"));
  const addressRaw = text(formData.get("address"));
  const interestRaw = text(formData.get("interest"));
  const messageRaw = text(formData.get("message"));
  const listing = oneLine(meta.listing ?? "").slice(0, 300);

  if (name.length < 1 || name.length > 200) return { ok: false, error: "invalid" };
  if (email.length < 3 || email.length > 320 || !EMAIL_RE.test(email)) return { ok: false, error: "invalid" };
  if (phoneRaw.length > 40 || addressRaw.length > 500 || messageRaw.length > 5000) return { ok: false, error: "invalid" };
  if (interestRaw && !INTERESTS.includes(interestRaw)) return { ok: false, error: "invalid" };
  const phone = optional(phoneRaw);
  const address = optional(addressRaw);
  const message = optional(messageRaw);
  const interest = interestRaw || null;

  const sb = getSupabase();
  if (!sb) return { ok: false, error: "offline" };

  const { error } = await sb.from("inquiries").insert({
    kind,
    name,
    email,
    phone,
    address,
    interest,
    message,
  });
  if (error) {
    console.error("[inquiry] Supabase insert failed", error);
    return { ok: false, error: "save" };
  }

  const label = formType(kind, listing);
  await notify({
    formType: label,
    name,
    email,
    phone,
    address,
    interest,
    message,
    listing,
    page: pageLabel(meta.source),
    submitted: vancouverStamp(),
    replyTo: email,
  });
  return { ok: true };
}
