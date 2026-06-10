import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { products, profiles, orders, orderItems } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";
import { buildPayFastFields, PAYFAST_HOST } from "@/lib/payfast";

interface CartItem {
  productId: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  const { items }: { items: CartItem[] } = await req.json();

  if (!items?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Recompute total from DB prices — never trust client
  const productIds = items.map((i) => i.productId);
  const dbProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));

  if (!dbProducts.length) {
    return NextResponse.json({ error: "Products not found" }, { status: 400 });
  }

  const priceMap = Object.fromEntries(dbProducts.map((p) => [p.id, p.priceCents]));
  const totalCents = items.reduce((sum, item) => {
    const price = priceMap[item.productId];
    if (!price) return sum;
    return sum + price * item.quantity;
  }, 0);

  // Load delivery address
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId));

  if (!profile?.addressLine1) {
    return NextResponse.json(
      { error: "Please save your delivery address before checkout.", redirect: "/account" },
      { status: 400 }
    );
  }

  // Create order
  const orderId = randomUUID();
  const mPaymentId = `SOK-${orderId.slice(0, 8).toUpperCase()}-${Date.now()}`;
  const amountRand = (totalCents / 100).toFixed(2);

  await db.insert(orders).values({
    id: orderId,
    userId,
    status: "pending",
    totalCents,
    mPaymentId,
    addressLine1: profile.addressLine1,
    city: profile.city,
    province: profile.province,
    postalCode: profile.postalCode,
  });

  await db.insert(orderItems).values(
    items.map((item) => ({
      id: randomUUID(),
      orderId,
      productId: item.productId,
      quantity: item.quantity,
      unitPriceCents: priceMap[item.productId],
    }))
  );

  // Build PayFast redirect
  const nameParts = (session.user.name ?? "Customer").split(" ");
  const fields = buildPayFastFields({
    orderId,
    mPaymentId,
    amountRand,
    itemName: "Sok",
    nameFirst: nameParts[0] ?? "Customer",
    nameLast: nameParts[1] ?? "",
    email: session.user.email ?? "",
  });

  return NextResponse.json({
    url: `${PAYFAST_HOST}/eng/process`,
    fields,
  });
}
