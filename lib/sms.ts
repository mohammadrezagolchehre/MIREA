type KavenegarResponse = {
  return?: { status?: number; message?: string };
};

export function developmentOtpCode() {
  if (process.env.NODE_ENV === "production") return null;
  const code = process.env.OTP_TEST_CODE?.trim();
  return /^\d{5}$/.test(code ?? "") ? code! : null;
}

export async function sendOtpSms(phone: string, code: string) {
  const provider = process.env.SMS_PROVIDER?.toLowerCase();

  if (provider === "kavenegar") {
    const apiKey = process.env.KAVENEGAR_API_KEY;
    const template = process.env.KAVENEGAR_TEMPLATE;

    if (!apiKey || !template) {
      throw new Error("Kavenegar is not configured");
    }

    const url = new URL(
      `https://api.kavenegar.com/v1/${encodeURIComponent(apiKey)}/verify/lookup.json`
    );
    url.searchParams.set("receptor", phone);
    url.searchParams.set("token", code);
    url.searchParams.set("template", template);

    const response = await fetch(url, { method: "POST", cache: "no-store" });
    const data = (await response.json().catch(() => null)) as
      | KavenegarResponse
      | null;

    if (!response.ok || data?.return?.status !== 200) {
      throw new Error("Kavenegar rejected the OTP request");
    }

    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("SMS_PROVIDER is not configured");
  }

  if (process.env.OTP_DEBUG === "true") {
    console.info(`[MIRA DEV OTP] ${phone}: ${code}`);
  }
}
