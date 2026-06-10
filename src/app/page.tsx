import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProductActions from "@/components/ProductActions";
import ImageCarousel from "@/components/ImageCarousel";

export default async function Home() {
  const product = await db
    .select()
    .from(products)
    .where(eq(products.slug, "sok"))
    .then((rows) => rows[0]);

  if (!product) {
    return (
      <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-16">
        <p style={{ color: "var(--mocha)" }}>Product not found.</p>
      </div>
    );
  }

  const priceRand = (product.priceCents / 100).toFixed(2);

  return (
    <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-8 md:py-16">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-20 items-start">

        {/* Carousel */}
        <div className="w-full md:w-1/2">
          <ImageCarousel />
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2 flex flex-col gap-5 md:pt-4">
          <div className="flex flex-col gap-1">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl text-espresso leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {product.name}
            </h1>
            <p
              className="text-xl md:text-2xl"
              style={{ color: "var(--coffee)", fontFamily: "var(--font-display)" }}
            >
              R {priceRand}
            </p>
          </div>

          <p className="text-sm md:text-base leading-7 hidden sm:block" style={{ color: "var(--mocha)" }}>
            {product.description}
          </p>

          <div className="h-px w-full" style={{ backgroundColor: "var(--sand)" }} />

          <ProductActions
            productId={product.id}
            priceCents={product.priceCents}
            productName={product.name}
            imageUrl={product.imageUrl ?? "/img/sock-basic.png"}
          />
        </div>
      </div>
    </div>
  );
}
