import Image from "next/image";
import CartView from "@/components/CartView";

export default function CartPage() {
  return (
    <div className="relative min-h-[calc(100vh-64px)]">

      {/* Background lifestyle image — fades left to right */}
      <div
        className="fixed inset-y-0 right-0 w-full md:w-2/3 lg:w-1/2 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src="/img/lifestyle.png"
          alt=""
          fill
          className="object-cover object-center"
          style={{
            opacity: 1,
            filter: "sepia(40%) saturate(80%) brightness(0.95)",
            maskImage: "linear-gradient(to right, transparent 0%, black 55%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 55%)",
          }}
          priority
        />
      </div>

      {/* Cart content */}
      <div className="relative z-10 max-w-[700px] mx-auto px-5 md:px-8 py-10 md:py-16">
        <h1
          className="text-3xl md:text-4xl text-espresso mb-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your cart
        </h1>
        <CartView />
      </div>
    </div>
  );
}
