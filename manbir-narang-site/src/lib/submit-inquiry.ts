"use server";

import http from "node:http";
import https from "node:https";
import { connection } from "next/server";
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

function pageLabel(source: unknown): string {
  const path = oneLine(typeof source === "string" ? source : "").slice(0, 300);
  if (!path) return "(not provided)";
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim().replace(/\/$/, "");
  // Home sends source="/", which must stay distinct from a missing page.
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

function resendMessage(raw: string): string {
  try {
    const parsed = JSON.parse(raw) as { message?: string; name?: string };
    return (parsed.message || parsed.name || raw).slice(0, 500);
  } catch {
    return raw.slice(0, 500);
  }
}

/** POST to Resend with Node's HTTP client so the home page's ISR fetch patch cannot skip the call. */
function postResend(apiKey: string, payload: string): Promise<{ status: number; body: string }> {
  const base = (process.env.RESEND_BASE_URL || "https://api.resend.com").trim().replace(/\/$/, "");
  const url = new URL(`${base}/emails`);
  const transport = url.protocol === "http:" ? http : https;
  return new Promise((resolve, reject) => {
    const req = transport.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || undefined,
        path: `${url.pathname}${url.search}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
          "User-Agent": "manbir-narang-site",
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve({ status: res.statusCode ?? 0, body: Buffer.concat(chunks).toString("utf8") }));
      },
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

/** Best-effort. A missing key or a send failure must not undo a saved enquiry. */
async function notify(input: Parameters<typeof emailBody>[0] & { replyTo: string }): Promise<void> {
  const where = `page=${input.page} form=${input.formType}`;
  const apiKey = (process.env.RESEND_API_KEY ?? "").trim();
  const to = notifyRecipients();
  if (!apiKey) {
    console.error(`[inquiry] email skipped ${where} reason=RESEND_API_KEY missing`);
    return;
  }
  if (to.length === 0) {
    console.error(`[inquiry] email skipped ${where} reason=LEAD_NOTIFY_EMAIL missing or invalid`);
    return;
  }
  const from = (process.env.LEAD_FROM_EMAIL ?? "").trim() || DEFAULT_FROM;
  const payload = JSON.stringify({
    from,
    to,
    reply_to: input.replyTo,
    subject: oneLine(`New website inquiry: ${input.formType} from ${input.name}`).slice(0, 200),
    text: emailBody(input),
  });
  try {
    console.info(`[inquiry] email sending ${where}`);
    const result = await postResend(apiKey, payload);
    if (result.status >= 200 && result.status < 300) {
      let id = "";
      try { id = String((JSON.parse(result.body) as { id?: string }).id ?? ""); } catch { /* ignore */ }
      console.info(`[inquiry] email sent ${where} id=${id || "unknown"}`);
      return;
    }
    console.error(`[inquiry] email failed ${where} status=${result.status} message=${resendMessage(result.body)}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[inquiry] email failed ${where} status=0 message=${message}`);
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
  // Home is the only form on an ISR route (revalidate = 60) and posts this
  // action to "/". connection() pins the send to the real request.
  try {
    await connection();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[inquiry] connection() failed page=${String(meta.source)} message=${message}`);
  }
  try {
    await notify({
      formType: label,
      name,
      email,
      phone,
      address,
      interest,
      message,
      listing,
      page: pageLabel(meta?.source),
      submitted: vancouverStamp(),
      replyTo: email,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[inquiry] email failed page=${String(meta?.source)} form=${label} status=0 message=${message}`);
  }
  return { ok: true };
}
