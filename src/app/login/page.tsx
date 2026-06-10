import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-5">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">

        {/* Logo */}
        <Image
          src="/img/logo.jpg"
          alt="Sok"
          width={100}
          height={40}
          className="object-contain"
          priority
        />

        {/* Card */}
        <div
          className="w-full rounded-[4px] p-8 flex flex-col gap-6"
          style={{
            backgroundColor: "var(--porcelain)",
            border: "1px solid var(--sand)",
            boxShadow: "0 1px 2px rgba(43,33,27,.06)",
          }}
        >
          <div className="flex flex-col gap-1">
            <h1
              className="text-2xl text-espresso"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: "var(--mocha)" }}>
              Sign in to your account.
            </p>
          </div>

          <LoginForm />
        </div>

      </div>
    </div>
  );
}
