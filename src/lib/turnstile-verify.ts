/** Server-side Turnstile verification (Vercel API route + Vite dev middleware). */
export async function verifyTurnstileToken(
  token: string,
  secret: string
): Promise<{ success: boolean; errorCodes?: string[] }> {
  if (!token || !secret) {
    return { success: false, errorCodes: ["missing-input"] };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    return {
      success: data.success === true,
      errorCodes: data["error-codes"],
    };
  } catch {
    // Network/DNS/adblock failures should not explode into a 500.
    return { success: false, errorCodes: ["network-error"] };
  }
}
