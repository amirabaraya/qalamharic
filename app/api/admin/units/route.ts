import { NextResponse } from "next/server";
import { Level } from "@prisma/client";
import { z } from "zod";
import { getApiAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const unitSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().min(10).max(600),
  level: z.nativeEnum(Level).default(Level.BEGINNER)
});

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function POST(request: Request) {
  const admin = await getApiAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const parsed = unitSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid unit details." }, { status: 400 });

  const last = await prisma.courseUnit.findFirst({ orderBy: { order: "desc" }, select: { order: true } });
  const baseSlug = slugify(parsed.data.title) || "unit";
  const slug = `${baseSlug}-${Date.now().toString(36)}`;
  const unit = await prisma.courseUnit.create({
    data: {
      slug,
      title: parsed.data.title,
      description: parsed.data.description,
      level: parsed.data.level,
      order: (last?.order ?? 0) + 1
    }
  });

  return NextResponse.json({ unit }, { status: 201 });
}
