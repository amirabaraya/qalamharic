import { NextResponse } from "next/server";
import { ExerciseType } from "@prisma/client";
import { z } from "zod";
import { getApiAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const lessonSchema = z.object({
  unitId: z.string().min(1),
  title: z.string().min(2).max(140),
  description: z.string().min(10).max(700),
  amharicText: z.string().min(1).max(120),
  transliteration: z.string().min(1).max(160),
  englishText: z.string().min(1).max(180),
  xpReward: z.number().int().min(5).max(200).default(25)
});

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function POST(request: Request) {
  const admin = await getApiAdmin();
  if (!admin) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const parsed = lessonSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid lesson details." }, { status: 400 });

  const unit = await prisma.courseUnit.findUnique({ where: { id: parsed.data.unitId } });
  if (!unit) return NextResponse.json({ error: "Unit not found." }, { status: 404 });

  const last = await prisma.lesson.findFirst({
    where: { unitId: unit.id },
    orderBy: { order: "desc" },
    select: { order: true }
  });
  const slug = `${slugify(parsed.data.title) || "lesson"}-${Date.now().toString(36)}`;

  const lesson = await prisma.lesson.create({
    data: {
      unitId: unit.id,
      slug,
      title: parsed.data.title,
      description: parsed.data.description,
      xpReward: parsed.data.xpReward,
      durationMin: 8,
      order: (last?.order ?? 0) + 1,
      published: true,
      exercises: {
        create: [
          {
            type: ExerciseType.TRANSLATION,
            prompt: `Choose the Amharic for: ${parsed.data.englishText}`,
            amharicText: parsed.data.amharicText,
            transliteration: parsed.data.transliteration,
            englishText: parsed.data.englishText,
            options: [parsed.data.amharicText, "ውሃ", "ቤት", "እንጀራ"],
            answer: [parsed.data.amharicText],
            explanation: "Listen first, match the meaning, then notice the fidel spelling.",
            order: 1
          },
          {
            type: ExerciseType.PRONUNCIATION,
            prompt: `Say: ${parsed.data.transliteration}`,
            amharicText: parsed.data.amharicText,
            transliteration: parsed.data.transliteration,
            englishText: parsed.data.englishText,
            answer: [parsed.data.transliteration],
            order: 2
          }
        ]
      }
    }
  });

  return NextResponse.json({ lesson }, { status: 201 });
}
