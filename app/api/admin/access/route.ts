import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiFullAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const accessSchema = z.object({
  userId: z.string().min(1),
  plan: z.enum(["FREE", "BASIC", "PLUS", "FAMILY", "EMPLOYEE"]),
  status: z.enum(["active", "trialing", "inactive"]).default("active"),
  days: z.number().int().min(0).max(366).default(30)
});

export async function PATCH(request: Request) {
  const admin = await getApiFullAdmin();
  if (!admin) return NextResponse.json({ error: "Full admin access required." }, { status: 403 });

  const parsed = accessSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid access details." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: parsed.data.userId }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

  const currentPeriodEnd =
    parsed.data.status === "inactive" || parsed.data.days === 0
      ? null
      : new Date(Date.now() + parsed.data.days * 24 * 60 * 60 * 1000);

  const subscription = await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {
      plan: parsed.data.plan,
      status: parsed.data.status,
      currentPeriodEnd
    },
    create: {
      userId: user.id,
      plan: parsed.data.plan,
      status: parsed.data.status,
      currentPeriodEnd
    }
  });

  return NextResponse.json({ subscription });
}
