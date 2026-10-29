export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const key = Boolean((process.env.RESEND_API_KEY ?? "").trim());
  const to = Boolean((process.env.LEAD_NOTIFY_EMAIL ?? "").trim());
  const from = (process.env.LEAD_FROM_EMAIL ?? "").trim() ? "set" : "default";
  console.info(`[inquiry] config RESEND_API_KEY ${key ? "present" : "missing"}; LEAD_NOTIFY_EMAIL ${to ? "present" : "missing"}; LEAD_FROM_EMAIL ${from}`);
}
