import { Award, BookOpen, CalendarDays, Ear, Flame, Heart, Mic2, PenLine, Sparkles, Target } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button, Card, ProgressBar, StatPill } from "@/components/ui";
import { calculateSkillBalance, getCourseMapForUser, getCurrentLearner } from "@/lib/learner";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const learner = await getCurrentLearner();
  const [courseMap, progress, earnedBadges] = await Promise.all([
    getCourseMapForUser(learner.id),
    prisma.progress.findMany({
      where: { userId: learner.id },
      select: { percent: true, correct: true, attempts: true, completedAt: true }
    }),
    prisma.userBadge.findMany({
      where: { userId: learner.id },
      include: { badge: true }
    })
  ]);

  const activeUnit = courseMap.find((unit) => unit.progress < 100) ?? courseMap[0];
  const nextLessons = courseMap.flatMap((unit) =>
    unit.lessons
      .filter((lesson) => !lesson.locked && lesson.progress < 100)
      .slice(0, 2)
      .map((lesson) => ({ ...lesson, unitTitle: unit.subtitle }))
  ).slice(0, 3);
  const completedToday = progress.filter(
    (item) => item.completedAt && item.completedAt.toDateString() === new Date().toDateString()
  ).length;
  const dailyProgress = Math.min(100, Math.round((learner.xp / Math.max(learner.dailyGoal, 1)) * 100));
  const skillIcons = [BookOpen, Ear, Mic2, PenLine];
  const skillBalance = calculateSkillBalance(progress);

  return (
    <AppShell title="Dashboard" learner={learner}>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <Card className="pattern bg-leaf text-cream">
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cream/70">Today&apos;s path</p>
            <h2 className="mt-3 font-display text-5xl font-bold">
              {learner.xp === 0 ? "Start your first Amharic lesson." : "Keep building your Amharic."}
            </h2>
            <p className="mt-4 max-w-2xl text-cream/78">
              Begin with fidel sounds, simple greetings, and English explanations made for first-time Amharic learners.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <StatPill icon={Flame} label="Streak" value={`${learner.streak} days`} tone="ember" />
              <StatPill icon={Sparkles} label="Total XP" value={learner.xp} tone="gold" />
              <StatPill icon={Heart} label="Hearts" value={learner.hearts} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-charcoal/62 dark:text-cream/62">Daily goal</p>
              <h3 className="font-display text-4xl font-bold">{learner.dailyGoal} XP</h3>
            </div>
            <Target className="text-saffron" size={34} />
          </div>
          <ProgressBar value={dailyProgress} className="mt-5" />
          <p className="mt-3 text-sm text-charcoal/64 dark:text-cream/64">
            {learner.xp === 0 ? "Earn your first XP by finishing Lesson 1." : `${completedToday} lesson${completedToday === 1 ? "" : "s"} completed today.`}
          </p>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-4xl font-bold">Continue learning</h2>
            <CalendarDays className="text-leaf dark:text-saffron" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {nextLessons.map((lesson) => (
              <div key={lesson.id} className="rounded-2xl bg-cream p-4 dark:bg-ink/64">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf dark:text-saffron">
                  {lesson.progress === 0 ? "New chapter" : "In progress"}
                </p>
                <h3 className="mt-3 font-display text-3xl font-bold">{lesson.title}</h3>
                <p className="mt-2 text-sm text-charcoal/64 dark:text-cream/64">{lesson.unitTitle}</p>
                <p className="mt-4 text-sm font-bold">{lesson.xpReward} XP | {lesson.durationMin} min</p>
                <Button href={`/lesson?lesson=${lesson.slug}`} className="mt-4 w-full" variant="secondary">
                  {lesson.progress === 0 ? "Start" : "Continue"}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-4xl font-bold">Skill balance</h2>
          <div className="mt-5 space-y-4">
            {skillBalance.map((skill, index) => {
              const Icon = skillIcons[index];
              return (
                <div key={skill.label}>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold">
                    <span className="flex items-center gap-2">
                      <Icon size={17} className="text-leaf dark:text-saffron" />
                      {skill.label}
                    </span>
                    <span>{skill.value}%</span>
                  </div>
                  <ProgressBar value={skill.value} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h2 className="font-display text-4xl font-bold">Active unit</h2>
          <div className="mt-5 space-y-4">
            {(activeUnit ? [activeUnit, ...courseMap.filter((unit) => unit.id !== activeUnit.id).slice(0, 2)] : []).map((unit) => (
              <div key={unit.id} className="rounded-2xl bg-cream p-4 dark:bg-ink/64">
                <div className="mb-2 flex justify-between text-sm font-bold">
                  <span>{unit.subtitle}</span>
                  <span>{unit.progress}%</span>
                </div>
                <ProgressBar value={unit.progress} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-5 flex items-center gap-3">
            <Award className="text-saffron" />
            <h2 className="font-display text-4xl font-bold">Badges</h2>
          </div>
          {earnedBadges.length === 0 ? (
            <p className="rounded-2xl bg-cream p-4 text-sm font-bold text-charcoal/62 dark:bg-ink/64 dark:text-cream/62">
              No badges yet. Finish your first lesson to begin the collection.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {earnedBadges.map(({ badge }) => (
                <div key={badge.id} className="rounded-2xl bg-cream p-4 text-center dark:bg-ink/64">
                  <Award className="mx-auto text-saffron" />
                  <p className="mt-2 text-sm font-bold">{badge.name}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
