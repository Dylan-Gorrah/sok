import {
  pgTable,
  pgEnum,
  text,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Auth.js tables (owned by @auth/drizzle-adapter) ────────────────────────

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("passwordHash"),
});

export const accounts = pgTable("accounts", {
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => [uniqueIndex("verification_token_idx").on(t.identifier, t.token)]
);

// ─── App tables ──────────────────────────────────────────────────────────────

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  firstName: text("firstName"),
  lastName: text("lastName"),
  phone: text("phone"),
  addressLine1: text("addressLine1"),
  city: text("city"),
  province: text("province"),
  postalCode: text("postalCode"),
});

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  priceCents: integer("priceCents").notNull(),
  imageUrl: text("imageUrl"),
  active: boolean("active").notNull().default(true),
});

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "failed",
  "shipped",
  "delivered",
]);

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => users.id),
  status: orderStatusEnum("status").notNull().default("pending"),
  totalCents: integer("totalCents").notNull(),
  mPaymentId: text("mPaymentId").notNull().unique(),
  pfPaymentId: text("pfPaymentId"),
  addressLine1: text("addressLine1"),
  city: text("city"),
  province: text("province"),
  postalCode: text("postalCode"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  paidAt: timestamp("paidAt", { mode: "date" }),
});

export const orderItems = pgTable("orderItems", {
  id: text("id").primaryKey(),
  orderId: text("orderId").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: text("productId").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPriceCents: integer("unitPriceCents").notNull(),
});
