"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import Button from "@/components/Button";

export default function CartView() {
  const { items, remove, setQty, totalCents, clear } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState("");

  const handleCheckout = async () => {
    if (!session) {
      router.push("/login?next=/cart");
      return;
    }
    setChecking(true);
    setCheckError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCheckError(data.error ?? "Something went wrong.");
        if (data.redirect) router.push(data.redirect);
        return;
      }
      // Build a hidden form and submit to PayFast
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.url;
      Object.entries(data.fields as Record<string, string>).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = v;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      clear();
      form.submit();
    } catch {
      setCheckError("Network error. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  if (items.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-5 py-20 rounded-[4px]"
        style={{ border: "1px solid var(--sand)" }}
      >
        <ShoppingBag size={36} strokeWidth={1} style={{ color: "var(--sand)" }} />
        <p className="text-sm" style={{ color: "var(--mocha)" }}>
          Your cart is empty
        </p>
        <Link href="/">
          <Button variant="secondary">Back to shop</Button>
        </Link>
      </div>
    );
  }

  const total = totalCents();
  const totalRand = (total / 100).toFixed(2);

  return (
    <div className="flex flex-col gap-6">
      {/* Line items */}
      <div className="flex flex-col divide-y" style={{ borderColor: "var(--sand)" }}>
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 py-5">
            {/* Thumb */}
            <div
              className="relative w-16 h-16 rounded-[4px] overflow-hidden shrink-0 bg-latte"
              style={{ border: "1px solid var(--sand)" }}
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Name + price */}
            <div className="flex-1 min-w-0">
              <p
                className="text-base font-medium text-espresso truncate"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.name}
              </p>
              <p className="text-sm mt-0.5" style={{ color: "var(--mocha)" }}>
                R {(item.priceCents / 100).toFixed(2)}
              </p>
            </div>

            {/* Qty stepper */}
            <div
              className="flex items-center rounded-[2px] overflow-hidden shrink-0"
              style={{ border: "1px solid var(--sand)" }}
            >
              <button
                onClick={() =>
                  item.quantity <= 1 ? remove(item.productId) : setQty(item.productId, item.quantity - 1)
                }
                className="w-8 h-8 flex items-center justify-center hover:bg-latte transition-colors"
                aria-label="Decrease"
              >
                <Minus size={12} strokeWidth={1.5} style={{ color: "var(--espresso)" }} />
              </button>
              <span
                className="w-8 h-8 flex items-center justify-center text-sm select-none"
                style={{ color: "var(--espresso)" }}
              >
                {item.quantity}
              </span>
              <button
                onClick={() => setQty(item.productId, Math.min(10, item.quantity + 1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-latte transition-colors"
                aria-label="Increase"
              >
                <Plus size={12} strokeWidth={1.5} style={{ color: "var(--espresso)" }} />
              </button>
            </div>

            {/* Remove */}
            <button
              onClick={() => remove(item.productId)}
              className="shrink-0 hover:opacity-60 transition-opacity"
              aria-label="Remove item"
            >
              <Trash2 size={16} strokeWidth={1.5} style={{ color: "var(--mocha)" }} />
            </button>
          </div>
        ))}
      </div>

      {/* Subtotal + checkout */}
      <div
        className="flex flex-col gap-4 pt-4"
        style={{ borderTop: "1px solid var(--sand)" }}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: "var(--mocha)" }}>Subtotal</span>
          <span
            className="text-xl"
            style={{ color: "var(--espresso)", fontFamily: "var(--font-display)" }}
          >
            R {totalRand}
          </span>
        </div>

        {checkError && (
          <p className="text-xs" style={{ color: "var(--clay)" }}>{checkError}</p>
        )}
        <Button
          onClick={handleCheckout}
          disabled={checking}
          className="w-full py-4 text-base"
        >
          {checking ? "Preparing order..." : "Checkout"}
        </Button>

        <Link
          href="/"
          className="text-center text-sm transition-colors"
          style={{ color: "var(--mocha)" }}
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
