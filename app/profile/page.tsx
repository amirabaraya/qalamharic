import { Award, CalendarCheck, Flame, Heart, Sparkles, UserRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, ProgressBar, StatPill } from "@/components/ui";
import { getCurrentLearner } from "@/lib/learner";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const learner = await getCurrentLearner();
  const [progress, badges] = await Promise.all([
    prisma.progress.findMany({ where: { userId: learner.id }, select: { percent: true, correct: true, attempts: true } }),
    prisma.userBadge.findMany({ where: { userId: learner.id }, include: { badge: true } })
  ]);
  const attempts = progress.reduce((total, item) => total + item.attempts, 0);
  const correct = progress.reduce((total, item) => total + item.correct, 0);
  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;
  const reviewStrength = progress.length
    ? Math.round(progress.reduce((total, item) => total + item.percent, 0) / progress.length)
    : 0;

  return (
    <AppShell title="Profile" learner={learner}>
      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <Card className="text-center">
          <div className="mx-auto grid size-28 place-items-center rounded-3xl bg-leaf text-cream">
            <UserRound size={54} />
          </div>
          <h2 className="mt-5 font-display text-5xl font-bold">{learner.name}</h2>
          <p className="font-bold text-leaf dark:text-saffron">{learner.email}</p>
          <p className="mt-2 text-sm text-charcoal/64 dark:text-cream/64">
            {learner.xp === 0 ? "New FidelAmharic learner" : "Active FidelAmharic learner"}
          </p>
          <div className="mt-6 grid gap-3">
            <StatPill icon={Flame} label="Streak" value={`${learner.streak} days`} tone="ember" />
            <StatPill icon={Sparkles} label="Total XP" value={learner.xp} tone="gold" />
            <StatPill icon={Heart} label="Hearts" value={learner.hearts} />
          </div>
        </Card>
        <div className="space-y-5">
          <Card>
            <div className="flex items-center gap-3">
              <CalendarCheck className="text-leaf dark:text-saffron" />
              <h2 className="font-display text-4xl font-bold">Learning health</h2>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                ["Accuracy", accuracy],
                ["Daily goal", learner.xp === 0 ? 0 : Math.min(100, Math.round((learner.xp / learner.dailyGoal) * 100))],
                ["Review strength", reviewStrength]
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-cream p-4 dark:bg-ink/64">
                  <div className="mb-2 flex justify-between text-sm font-bold">
                    <span>{label}</span>
                    <span>{value}%</span>
                  </div>
                  <ProgressBar value={Number(value)} />
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div className="mb-5 flex items-center gap-3">
              <Award className="text-saffron" />
              <h2 className="font-display text-4xl font-bold">Collection</h2>
            </div>
            {badges.length === 0 ? (
              <p className="rounded-2xl bg-cream p-4 text-sm font-bold text-charcoal/62 dark:bg-ink/64 dark:text-cream/62">
                Your badge collection starts empty. Complete lessons to unlock awards.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {badges.map(({ badge }) => (
                  <div key={badge.id} className="rounded-2xl bg-cream p-4 text-center dark:bg-ink/64">
                    <Award className="mx-auto text-saffron" />
                    <p className="mt-2 text-sm font-bold">{badge.name}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
