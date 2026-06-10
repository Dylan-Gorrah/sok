"use client";

import { useState } from "react";
import Button from "@/components/Button";

const PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape",
];

function Field({
  label, name, value, onChange, placeholder, type = "text",
}: {
  label: string; name: string; value: string;
  onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: "var(--mocha)" }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-[2px] text-sm outline-none transition-colors"
        style={{ backgroundColor: "var(--cream)", border: "1px solid var(--sand)", color: "var(--espresso)" }}
        onFocus={(e) => (e.target.style.borderColor = "var(--coffee)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--sand)")}
      />
    </div>
  );
}

export default function AccountForm() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "",
    addressLine1: "", city: "", province: "", postalCode: "",
  });
  const [saved, setSaved] = useState(false);

  const set = (key: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { saveProfile } = await import("@/app/actions/profile");
      await saveProfile(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("Failed to save. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Name */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--caramel)" }}>
          Personal
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First name" name="firstName" value={form.firstName} onChange={set("firstName")} placeholder="Dylan" />
          <Field label="Last name" name="lastName" value={form.lastName} onChange={set("lastName")} placeholder="Smith" />
        </div>
        <Field label="Phone" name="phone" value={form.phone} onChange={set("phone")} placeholder="+27 82 000 0000" type="tel" />
      </div>

      <div className="h-px" style={{ backgroundColor: "var(--sand)" }} />

      {/* Address */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--caramel)" }}>
          Delivery address
        </p>
        <Field label="Street address" name="addressLine1" value={form.addressLine1} onChange={set("addressLine1")} placeholder="12 Long Street" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="City" name="city" value={form.city} onChange={set("city")} placeholder="Cape Town" />
          <Field label="Postal code" name="postalCode" value={form.postalCode} onChange={set("postalCode")} placeholder="8001" />
        </div>

        {/* Province select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--mocha)" }}>Province</label>
          <select
            value={form.province}
            onChange={(e) => set("province")(e.target.value)}
            className="w-full h-10 px-3 rounded-[2px] text-sm outline-none"
            style={{ backgroundColor: "var(--cream)", border: "1px solid var(--sand)", color: form.province ? "var(--espresso)" : "var(--mocha)" }}
          >
            <option value="">Select province</option>
            {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <Button type="submit" className="w-full py-3">
        {saved ? "Saved!" : "Save details"}
      </Button>
    </form>
  );
}
