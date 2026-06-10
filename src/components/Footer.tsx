export default function Footer() {
  return (
    <footer
      className="mt-auto py-5 px-5 md:px-8"
      style={{ borderTop: "1px solid var(--sand)" }}
    >
      <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <span
          className="text-xs"
          style={{ fontFamily: "var(--font-display)", color: "var(--mocha)" }}
        >
          Sok
        </span>
        <span className="text-xs" style={{ color: "var(--mocha)" }}>
          Developed by Dylan Gorrah
        </span>
      </div>
    </footer>
  );
}
