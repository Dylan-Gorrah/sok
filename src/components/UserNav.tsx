"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "lucide-react";

export default function UserNav() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Link href="/login" className="text-sm transition-colors" style={{ color: "var(--mocha)" }}>
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/account"
        className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-70"
        style={{ color: "var(--mocha)" }}
      >
        <User size={16} strokeWidth={1.5} />
        <span className="hidden sm:block">{session.user?.name ?? "Account"}</span>
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-xs transition-colors hover:opacity-70"
        style={{ color: "var(--mocha)" }}
      >
        Sign out
      </button>
    </div>
  );
}
