import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type LearnerStats = {
  id: string;
  name: string;
  email: string;
  xp: number;
  streak: number;
  hearts: number;
  dailyGoal: number;
};

export async function getCurrentLearner() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const learner = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      xp: true,
      streak: true,
      hearts: true,
      dailyGoal: true
    }
  });

  if (!learner?.email) {
    redirect("/login");
  }

  return {
    id: learner.id,
    name: learner.name ?? "New learner",
    email: learner.email,
    xp: learner.xp,
    streak: learner.streak,
    hearts: learner.hearts,
    dailyGoal: learner.dailyGoal
  };
}

export async function getCourseMapForUser(userId: string) {
  const units = await prisma.courseUnit.findMany({
    orderBy: { order: "asc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: {
          progress: {
            where: { userId },
            select: { percent: true, completedAt: true }
          },
          exercises: {
            orderBy: { order: "asc" },
            select: { id: true }
          }
        }
      }
    }
  });

  return units.map((unit) => {
    const progressValues = unit.lessons.map((lesson) => lesson.progress[0]?.percent ?? 0);
    const progress =
      progressValues.length === 0
        ? 0
        : Math.round(progressValues.reduce((total, value) => total + value, 0) / progressValues.length);

    return {
      id: unit.id,
      slug: unit.slug,
      title: `Unit ${unit.order}`,
      subtitle: unit.title,
      description: unit.description,
      level: unit.level.replace("_", " "),
      order: unit.order,
      progress,
      lessons: unit.lessons.map((lesson) => ({
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.description,
        xpReward: lesson.xpReward,
        durationMin: lesson.durationMin,
        progress: lesson.progress[0]?.percent ?? 0,
        exerciseCount: lesson.exercises.length
      }))
    };
  });
}

export function calculateSkillBalance(progress: Array<{ percent: number }>) {
  const completedPercent = progress.length
    ? Math.round(progress.reduce((total, item) => total + item.percent, 0) / progress.length)
    : 0;

  return [
    { label: "Reading", value: completedPercent },
    { label: "Listening", value: Math.max(0, completedPercent - 5) },
    { label: "Speaking", value: Math.max(0, completedPercent - 10) },
    { label: "Writing", value: Math.max(0, completedPercent - 8) }
  ];
}
