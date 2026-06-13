"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import Button from "@/components/Button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(next);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium" style={{ color: "var(--mocha)" }}>
          Email address
        </label>
        <div className="relative">
          <Mail size={15} strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--mocha)" }}
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full h-10 pl-9 pr-3 rounded-[2px] text-sm outline-none transition-colors"
            style={{ backgroundColor: "var(--cream)", border: "1px solid var(--sand)", color: "var(--espresso)" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--coffee)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--sand)")}
          />
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium" style={{ color: "var(--mocha)" }}>
          Password
        </label>
        <div className="relative">
          <Lock size={15} strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--mocha)" }}
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full h-10 pl-9 pr-3 rounded-[2px] text-sm outline-none transition-colors"
            style={{ backgroundColor: "var(--cream)", border: "1px solid var(--sand)", color: "var(--espresso)" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--coffee)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--sand)")}
          />
        </div>
      </div>

      {error && (
        <p className="text-xs" style={{ color: "var(--clay)" }}>{error}</p>
      )}

      <Button type="submit" disabled={loading} className="w-full py-3">
        {loading ? "Signing in..." : "Sign in"}
      </Button>

    </form>
  );
}
