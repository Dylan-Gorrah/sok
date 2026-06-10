import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;

  let paid = false;
  if (orderId) {
    const [order] = await db
      .select({ status: orders.status })
      .from(orders)
      .where(eq(orders.id, orderId));
    paid = order?.status === "paid";
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-5">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center">

        {paid ? (
          <CheckCircle2 size={56} strokeWidth={1.25} style={{ color: "var(--sage)" }} />
        ) : (
          <Clock size={56} strokeWidth={1.25} style={{ color: "var(--caramel)" }} />
        )}

        <div className="flex flex-col gap-2">
          <h1
            className="text-3xl text-espresso"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {paid ? "Order confirmed" : "Order received"}
          </h1>
          <p className="text-sm leading-6" style={{ color: "var(--mocha)" }}>
            {paid
              ? "Payment confirmed — your Soks are on their way. You'll get a confirmation email shortly."
              : "We received your order and are confirming payment with PayFast. This usually takes a few seconds."}
          </p>
        </div>

        <div className="w-full h-px" style={{ backgroundColor: "var(--sand)" }} />

        {!paid && (
          <p className="text-xs" style={{ color: "var(--mocha)" }}>
            Page will update once payment is verified.
          </p>
        )}

        <Link href="/" className="text-sm transition-colors" style={{ color: "var(--coffee)" }}>
          Back to shop
        </Link>

      </div>
    </div>
  );
}
