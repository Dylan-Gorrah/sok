import AccountForm from "@/components/AccountForm";

export default function AccountPage() {
  return (
    <div className="max-w-[600px] mx-auto px-5 md:px-8 py-10 md:py-16">
      <div className="flex flex-col gap-8">

        <div className="flex flex-col gap-1">
          <h1
            className="text-3xl md:text-4xl text-espresso"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your account
          </h1>
          <p className="text-sm" style={{ color: "var(--mocha)" }}>
            We'll use your delivery details at checkout.
          </p>
        </div>

        <div
          className="rounded-[4px] p-6 md:p-8"
          style={{
            backgroundColor: "var(--porcelain)",
            border: "1px solid var(--sand)",
            boxShadow: "0 1px 2px rgba(43,33,27,.06)",
          }}
        >
          <AccountForm />
        </div>

      </div>
    </div>
  );
}
