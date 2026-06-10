import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyITN } from "@/lib/payfast";

// PayFast sandbox and live IP ranges
const PAYFAST_HOSTS = [
  "sandbox.payfast.co.za",
  "www.payfast.co.za",
  "payfast.co.za",
  "197.97.145.144", "197.97.145.145", "197.97.145.146", "197.97.145.147",
  "197.97.145.148", "197.97.145.149", "197.97.145.150", "197.97.145.151",
  "197.97.145.152", "197.97.145.153", "197.97.145.154", "197.97.145.155",
  "197.97.145.156", "197.97.145.157", "197.97.145.158", "197.97.145.159",
  "41.74.179.192",  "41.74.179.193",  "41.74.179.194",  "41.74.179.195",
];

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const params = new URLSearchParams(rawBody);

  // 2. Valid source check
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ?? "";
  const isValidSource = PAYFAST_HOSTS.some((h) => ip.startsWith(h) || ip === h);
  if (!isValidSource && process.env.PAYFAST_ENV !== "sandbox") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const mPaymentId = params.get("m_payment_id");
  const paymentStatus = params.get("payment_status");
  const receivedSig = params.get("signature") ?? "";

  if (!mPaymentId) return new NextResponse("Missing m_payment_id", { status: 400 });

  // Load order
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.mPaymentId, mPaymentId));

  if (!order) return new NextResponse("Order not found", { status: 404 });

  // Idempotency — don't re-process an already paid order
  if (order.status === "paid") return new NextResponse("OK", { status: 200 });

  const expectedAmountRand = (order.totalCents / 100).toFixed(2);

  // Checks 1, 3, 4
  const { valid, reason } = await verifyITN(rawBody, receivedSig, expectedAmountRand);
  if (!valid) {
    console.error(`ITN verification failed: ${reason}`);
    return new NextResponse("Invalid ITN", { status: 400 });
  }

  // Mark paid
  if (paymentStatus === "COMPLETE") {
    await db
      .update(orders)
      .set({
        status: "paid",
        pfPaymentId: params.get("pf_payment_id") ?? null,
        paidAt: new Date(),
      })
      .where(eq(orders.mPaymentId, mPaymentId));
  }

  return new NextResponse("OK", { status: 200 });
}
