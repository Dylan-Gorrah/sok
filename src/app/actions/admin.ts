"use server";

import { db } from "@/db";
import { orders, users, orderItems, products } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";

export type AdminOrder = {
  id: string;
  status: string;
  totalCents: number;
  mPaymentId: string;
  createdAt: Date;
  paidAt: Date | null;
  addressLine1: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  customerName: string | null;
  customerEmail: string | null;
  items: { name: string; quantity: number; unitPriceCents: number }[];
};

export async function getOrders(): Promise<AdminOrder[]> {
  const rows = await db
    .select({
      order: orders,
      userName: users.name,
      userEmail: users.email,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  if (!rows.length) return [];

  const orderIds = rows.map((r) => r.order.id);

  const items = await db
    .select({
      orderId: orderItems.orderId,
      quantity: orderItems.quantity,
      unitPriceCents: orderItems.unitPriceCents,
      productName: products.name,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(inArray(orderItems.orderId, orderIds));

  const itemsByOrder: Record<string, AdminOrder["items"]> = {};
  for (const item of items) {
    if (!itemsByOrder[item.orderId]) itemsByOrder[item.orderId] = [];
    itemsByOrder[item.orderId].push({
      name: item.productName ?? "Product",
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
    });
  }

  return rows.map(({ order, userName, userEmail }) => ({
    id: order.id,
    status: order.status,
    totalCents: order.totalCents,
    mPaymentId: order.mPaymentId,
    createdAt: order.createdAt,
    paidAt: order.paidAt,
    addressLine1: order.addressLine1,
    city: order.city,
    province: order.province,
    postalCode: order.postalCode,
    customerName: userName,
    customerEmail: userEmail,
    items: itemsByOrder[order.id] ?? [],
  }));
}

export async function updateOrderStatus(
  orderId: string,
  status: "shipped" | "delivered"
) {
  await db
    .update(orders)
    .set({ status })
    .where(eq(orders.id, orderId));
}
