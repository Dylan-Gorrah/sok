import Link from "next/link";
import Image from "next/image";
import CartBadge from "@/components/CartBadge";
import UserNav from "@/components/UserNav";

export default function Header() {
  return (
    <header
      style={{ borderBottom: "1px solid var(--sand)" }}
      className="bg-porcelain"
    >
      <div className="max-w-[1100px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/img/logo.jpg"
            alt="Sok"
            height={44}
            width={44}
            className="object-contain"
            style={{ mixBlendMode: "multiply" }}
            priority
          />
          <span
            className="text-xl text-espresso leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Sok
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <UserNav />
          <CartBadge />
        </nav>
      </div>
    </header>
  );
}
