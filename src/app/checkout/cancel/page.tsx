import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-5">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center">

        <XCircle
          size={56}
          strokeWidth={1.25}
          style={{ color: "var(--clay)" }}
        />

        <div className="flex flex-col gap-2">
          <h1
            className="text-3xl text-espresso"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Payment cancelled
          </h1>
          <p className="text-sm leading-6" style={{ color: "var(--mocha)" }}>
            No charge was made. Your cart is still saved — pick up where you left off whenever you're ready.
          </p>
        </div>

        <div
          className="w-full h-px"
          style={{ backgroundColor: "var(--sand)" }}
        />

        <Link href="/cart">
          <button
            className="px-6 py-3 rounded-[2px] text-sm font-medium transition-all hover:-translate-y-px"
            style={{ backgroundColor: "var(--coffee)", color: "var(--porcelain)" }}
          >
            Back to cart
          </button>
        </Link>

      </div>
    </div>
  );
}
