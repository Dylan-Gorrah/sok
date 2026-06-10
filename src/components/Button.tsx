"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-[2px] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

  const styles = {
    primary:
      "text-porcelain hover:-translate-y-px active:translate-y-0",
    secondary:
      "bg-transparent text-espresso border hover:-translate-y-px active:translate-y-0",
  };

  return (
    <button
      className={`${base} ${styles[variant]} ${className}`}
      style={
        variant === "primary"
          ? { backgroundColor: "var(--coffee)", borderColor: "transparent" }
          : { borderColor: "var(--sand)" }
      }
      {...props}
    >
      {children}
    </button>
  );
}
