"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import Button from "@/components/Button";
import { useCart } from "@/lib/cart";

interface ProductActionsProps {
  productId: string;
  priceCents: number;
  productName: string;
  imageUrl: string;
}

export default function ProductActions({ productId, priceCents, productName, imageUrl }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);

  const dec = () => setQuantity((q) => Math.max(1, q - 1));
  const inc = () => setQuantity((q) => Math.min(10, q + 1));

  const handleAdd = () => {
    add(
      {
        productId,
        name: productName,
        priceCents,
        imageUrl,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Quantity stepper */}
      <div className="flex items-center gap-4">
        <span className="text-sm" style={{ color: "var(--mocha)" }}>
          Quantity
        </span>
        <div
          className="flex items-center rounded-[2px] overflow-hidden"
          style={{ border: "1px solid var(--sand)" }}
        >
          <button
            onClick={dec}
            disabled={quantity <= 1}
            className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-latte disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            <Minus size={14} strokeWidth={1.5} style={{ color: "var(--espresso)" }} />
          </button>
          <span
            className="w-10 h-10 flex items-center justify-center text-sm select-none"
            style={{ color: "var(--espresso)" }}
          >
            {quantity}
          </span>
          <button
            onClick={inc}
            disabled={quantity >= 10}
            className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-latte disabled:opacity-30"
            aria-label="Increase quantity"
          >
            <Plus size={14} strokeWidth={1.5} style={{ color: "var(--espresso)" }} />
          </button>
        </div>
      </div>

      {/* Add to cart */}
      <Button onClick={handleAdd} className="w-full py-4 text-base gap-2">
        <ShoppingBag size={18} strokeWidth={1.5} />
        {added ? "Added!" : "Add to cart"}
      </Button>
    </div>
  );
}
