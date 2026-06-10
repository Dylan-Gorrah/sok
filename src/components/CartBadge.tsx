"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function CartBadge() {
  const totalItems = useCart((s) => s.totalItems());
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Link href="/cart" className="relative text-mocha hover:text-espresso transition-colors">
      <ShoppingBag size={22} strokeWidth={1.5} />
      {mounted && totalItems > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-medium flex items-center justify-center text-porcelain"
          style={{ backgroundColor: "var(--coffee)" }}
        >
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Link>
  );
}
