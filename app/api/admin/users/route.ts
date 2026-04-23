import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiFullAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const roleSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "EDITOR", "LEARNER"])
});

const createUserSchema = roleSchema.extend({
  name: z.string().min(2).max(80),
  password: z.string().min(8).max(100)
});

export async function POST(request: Request) {
  const admin = await getApiFullAdmin();
  if (!admin) return NextResponse.json({ error: "Full admin access required." }, { status: 403 });

  const parsed = createUserSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid user details." }, { status: 400 });

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.upsert({
    where: { email: parsed.data.email.toLowerCase() },
    update: { name: parsed.data.name, role: parsed.data.role, passwordHash },
    create: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      role: parsed.data.role,
      passwordHash
    },
    select: { id: true, name: true, email: true, role: true }
  });

  return NextResponse.json({ user }, { status: 201 });
}

export async function PATCH(request: Request) {
  const admin = await getApiFullAdmin();
  if (!admin) return NextResponse.json({ error: "Full admin access required." }, { status: 403 });

  const parsed = roleSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid role details." }, { status: 400 });

  const user = await prisma.user.update({
    where: { email: parsed.data.email.toLowerCase() },
    data: { role: parsed.data.role },
    select: { id: true, name: true, email: true, role: true }
  });

  return NextResponse.json({ user });
}
