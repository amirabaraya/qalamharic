import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { LessonPlayer } from "@/components/lesson-player";
import { firstAvailableLesson, getCourseMapForUser, getCurrentLearner } from "@/lib/learner";
import { prisma } from "@/lib/prisma";

export default async function LessonPage({
  searchParams
}: {
  searchParams: Promise<{ lesson?: string }>;
}) {
  const learner = await getCurrentLearner();
  const params = await searchParams;
  const units = await getCourseMapForUser(learner.id, { unlockAll: learner.role === "ADMIN" });
  const flatLessons = units.flatMap((unit) => unit.lessons);
  const requested = params.lesson
    ? flatLessons.find((item) => item.slug === params.lesson)
    : firstAvailableLesson(units);

  if (!requested) notFound();
  if (requested.locked) {
    const available = firstAvailableLesson(units);
    redirect(available ? `/lesson?lesson=${available.slug}` : "/course");
  }

  const currentIndex = flatLessons.findIndex((item) => item.slug === requested.slug);
  const nextLesson = flatLessons.slice(currentIndex + 1).find((item) => !item.locked);

  const lesson = await prisma.lesson.findFirst({
    where: { slug: requested.slug, published: true },
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
      <LessonPlayer learner={learner} lesson={lesson} nextLessonSlug={nextLesson?.slug} />
    </AppShell>
  );
}
