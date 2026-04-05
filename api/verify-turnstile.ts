import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyTurnstileToken } from "../src/lib/turnstile-verify";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  const token =
    typeof req.body?.token === "string"
      ? req.body.token
      : typeof (req.body as { response?: string })?.response === "string"
        ? (req.body as { response: string }).response
        : null;

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    res.status(500).json({ ok: false, error: "server_misconfigured" });
    return;
  }

  const { success, errorCodes } = await verifyTurnstileToken(token ?? "", secret);

  if (!success) {
    res.status(400).json({ ok: false, error: "verification_failed", errorCodes });
    return;
  }

  res.status(200).json({ ok: true });
}
