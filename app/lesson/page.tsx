import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { LessonPlayer } from "@/components/lesson-player";
import { getCurrentLearner } from "@/lib/learner";
import { prisma } from "@/lib/prisma";

export default async function LessonPage({
  searchParams
}: {
  searchParams: Promise<{ lesson?: string }>;
}) {
  const learner = await getCurrentLearner();
  const params = await searchParams;
  const slug = params.lesson;

  const lesson = await prisma.lesson.findFirst({
    where: slug ? { slug, published: true } : { published: true },
    orderBy: [{ unit: { order: "asc" } }, { order: "asc" }],
    include: {
      unit: { select: { title: true } },
      exercises: { orderBy: { order: "asc" } },
      progress: {
        where: { userId: learner.id },
        select: { percent: true }
      }
    }
  });

  if (!lesson) notFound();

  return (
    <AppShell title="Lesson" learner={learner}>
      <LessonPlayer learner={learner} lesson={lesson} />
    </AppShell>
  );
}
