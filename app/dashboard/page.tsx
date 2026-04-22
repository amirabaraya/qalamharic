import { Award, CalendarDays, Flame, Heart, Sparkles, Target } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, ProgressBar, StatPill } from "@/components/ui";
import { badges, lessons, skills, units, user } from "@/lib/learning-data";

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard">
      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <Card className="pattern bg-leaf text-cream">
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cream/70">Today&apos;s path</p>
            <h2 className="mt-3 font-display text-5xl font-bold">A little Amharic, every day.</h2>
            <p className="mt-4 max-w-2xl text-cream/78">
              Continue Unit 2 with market phrases, then clear your spaced repetition queue while the words are fresh.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <StatPill icon={Flame} label="Streak" value={`${user.streak} days`} tone="ember" />
              <StatPill icon={Sparkles} label="Weekly XP" value={user.weeklyXp} tone="gold" />
              <StatPill icon={Heart} label="Hearts" value={user.hearts} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-charcoal/62 dark:text-cream/62">Daily goal</p>
              <h3 className="font-display text-4xl font-bold">{user.dailyGoalTarget} XP</h3>
            </div>
            <Target className="text-saffron" size={34} />
          </div>
          <ProgressBar value={(user.dailyGoal / user.dailyGoalTarget) * 100} className="mt-5" />
          <p className="mt-3 text-sm text-charcoal/64 dark:text-cream/64">
            {user.dailyGoalTarget - user.dailyGoal} XP left to keep the rhythm.
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
            {lessons.map((lesson) => (
              <div key={lesson.id} className="rounded-2xl bg-cream p-4 dark:bg-ink/64">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf dark:text-saffron">
                  {lesson.type}
                </p>
                <h3 className="mt-3 font-display text-3xl font-bold">{lesson.title}</h3>
                <p className="mt-2 text-sm text-charcoal/64 dark:text-cream/64">{lesson.unit}</p>
                <p className="mt-4 text-sm font-bold">{lesson.xp} XP • {lesson.minutes} min</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-4xl font-bold">Skill balance</h2>
          <div className="mt-5 space-y-4">
            {skills.map((skill) => (
              <div key={skill.label}>
                <div className="mb-2 flex items-center justify-between text-sm font-bold">
                  <span className="flex items-center gap-2">
                    <skill.icon size={17} className="text-leaf dark:text-saffron" />
                    {skill.label}
                  </span>
                  <span>{skill.value}%</span>
                </div>
                <ProgressBar value={skill.value} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h2 className="font-display text-4xl font-bold">Active unit</h2>
          <div className="mt-5 space-y-4">
            {units.slice(0, 3).map((unit) => (
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {badges.map((badge) => (
              <div
                key={badge.label}
                className="rounded-2xl bg-cream p-4 text-center dark:bg-ink/64"
                aria-label={`${badge.label} ${badge.earned ? "earned" : "locked"}`}
              >
                <badge.icon className={badge.earned ? "mx-auto text-saffron" : "mx-auto text-charcoal/28 dark:text-cream/28"} />
                <p className="mt-2 text-sm font-bold">{badge.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
