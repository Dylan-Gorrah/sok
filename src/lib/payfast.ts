import crypto from "crypto";

export const PAYFAST_HOST =
  process.env.PAYFAST_ENV === "live"
    ? "https://www.payfast.co.za"
    : "https://sandbox.payfast.co.za";

// Build MD5 signature — filters empty fields, spaces → +
export function buildSignature(
  fields: Record<string, string>,
  passphrase?: string
): string {
  const str =
    Object.entries(fields)
      .filter(([, v]) => v !== "" && v != null)
      .map(([k, v]) => `${k}=${encodeURIComponent(v.trim()).replace(/%20/g, "+")}`)
      .join("&") +
    (passphrase
      ? `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`
      : "");

  console.log("[PayFast] signature string:", str);
  return crypto.createHash("md5").update(str).digest("hex");
}

export interface PayFastParams {
  orderId: string;
  mPaymentId: string;
  amountRand: string;
  itemName: string;
  nameFirst: string;
  nameLast: string;
  email: string;
}

export function buildPayFastFields(params: PayFastParams): Record<string, string> {
  const base = process.env.PUBLIC_BASE_URL!;

  // Build fields — strip empty values so they're never sent to PayFast
  const raw: Record<string, string> = {
    merchant_id:   process.env.PAYFAST_MERCHANT_ID!,
    merchant_key:  process.env.PAYFAST_MERCHANT_KEY!,
    return_url:    `${base}/checkout/success?order=${params.orderId}`,
    cancel_url:    `${base}/checkout/cancel`,
    notify_url:    `${base}/api/payfast/itn`,
    name_first:    params.nameFirst,
    name_last:     params.nameLast,
    email_address: params.email,
    m_payment_id:  params.mPaymentId,
    amount:        params.amountRand,
    item_name:     params.itemName,
  };

  // Only keep non-empty fields — prevents mismatch when optional fields absent
  const fields: Record<string, string> = Object.fromEntries(
    Object.entries(raw).filter(([, v]) => v !== "" && v != null)
  );

  const passphrase = process.env.PAYFAST_PASSPHRASE || undefined;
  fields.signature = buildSignature(fields, passphrase);

  return fields;
}

export async function verifyITN(
  rawBody: string,
  receivedSignature: string,
  expectedAmountRand: string
): Promise<{ valid: boolean; reason?: string }> {

  const params = new URLSearchParams(rawBody);
  const fields: Record<string, string> = {};
  params.forEach((v, k) => {
    if (k !== "signature") fields[k] = v;
  });

  const passphrase = process.env.PAYFAST_PASSPHRASE || undefined;
  const computed = buildSignature(fields, passphrase);
  if (computed !== receivedSignature) {
    return { valid: false, reason: "signature_mismatch" };
  }

  const gross = parseFloat(params.get("amount_gross") ?? "0");
  const expected = parseFloat(expectedAmountRand);
  if (Math.abs(gross - expected) > 0.01) {
    return { valid: false, reason: "amount_mismatch" };
  }

  const validateUrl = `${PAYFAST_HOST}/eng/query/validate`;
  const res = await fetch(validateUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: rawBody,
  });
  const text = await res.text();
  if (text.trim() !== "VALID") {
    return { valid: false, reason: "payfast_invalid" };
  }

  return { valid: true };
}
