import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const progressSchema = z.object({
  lessonId: z.string().min(1),
  correct: z.boolean().default(true)
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const parsed = progressSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid progress payload." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: parsed.data.lessonId },
    select: { id: true, xpReward: true }
  });
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  const existing = await prisma.progress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } }
  });
  const alreadyCompleted = existing?.percent === 100;

  const [progress, updatedUser] = await prisma.$transaction([
    prisma.progress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
      update: {
        percent: 100,
        correct: { increment: parsed.data.correct ? 1 : 0 },
        attempts: { increment: 1 },
        completedAt: new Date()
      },
      create: {
        userId: user.id,
        lessonId: lesson.id,
        percent: 100,
        correct: parsed.data.correct ? 1 : 0,
        attempts: 1,
        completedAt: new Date()
      }
    }),
    prisma.user.update({
      where: { id: user.id },
      data: {
        xp: { increment: alreadyCompleted ? 0 : lesson.xpReward },
        streak: user.streak === 0 ? 1 : user.streak
      },
      select: { xp: true, streak: true, hearts: true }
    })
  ]);

  return NextResponse.json({ progress, user: updatedUser });
}
