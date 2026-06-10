"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function saveProfile(formData: {
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  city: string;
  province: string;
  postalCode: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const userId = session.user.id;

  await db
    .insert(profiles)
    .values({ id: randomUUID(), userId, ...formData })
    .onConflictDoUpdate({
      target: profiles.userId,
      set: formData,
    });
}
