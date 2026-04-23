import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const reorderSchema = z.object({
  type: z.enum(["unit", "lesson"]),
  id: z.string().min(1),
  direction: z.enum(["up", "down"])
});

export async function PATCH(request: Request) {
  const admin = await getApiAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const parsed = reorderSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid reorder details." }, { status: 400 });

  if (parsed.data.type === "unit") {
    const current = await prisma.courseUnit.findUnique({ where: { id: parsed.data.id } });
    if (!current) return NextResponse.json({ error: "Unit not found." }, { status: 404 });
    const neighbor = await prisma.courseUnit.findFirst({
      where: parsed.data.direction === "up" ? { order: { lt: current.order } } : { order: { gt: current.order } },
      orderBy: { order: parsed.data.direction === "up" ? "desc" : "asc" }
    });
    if (!neighbor) return NextResponse.json({ ok: true });
    await prisma.$transaction([
      prisma.courseUnit.update({ where: { id: current.id }, data: { order: neighbor.order } }),
      prisma.courseUnit.update({ where: { id: neighbor.id }, data: { order: current.order } })
    ]);
    return NextResponse.json({ ok: true });
  }

  const current = await prisma.lesson.findUnique({ where: { id: parsed.data.id } });
  if (!current) return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  const neighbor = await prisma.lesson.findFirst({
    where: {
      unitId: current.unitId,
      ...(parsed.data.direction === "up" ? { order: { lt: current.order } } : { order: { gt: current.order } })
    },
    orderBy: { order: parsed.data.direction === "up" ? "desc" : "asc" }
  });
  if (!neighbor) return NextResponse.json({ ok: true });
  await prisma.$transaction([
    prisma.lesson.update({ where: { id: current.id }, data: { order: neighbor.order } }),
    prisma.lesson.update({ where: { id: neighbor.id }, data: { order: current.order } })
  ]);
  return NextResponse.json({ ok: true });
}
