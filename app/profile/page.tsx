import { Award, CalendarCheck, Flame, Heart, Sparkles, UserRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, ProgressBar, StatPill } from "@/components/ui";
import { badges, user } from "@/lib/learning-data";

export default function ProfilePage() {
  return (
    <AppShell title="Profile">
      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <Card className="text-center">
          <div className="mx-auto grid size-28 place-items-center rounded-3xl bg-leaf text-cream">
            <UserRound size={54} />
          </div>
          <h2 className="mt-5 font-display text-5xl font-bold">{user.name}</h2>
          <p className="font-bold text-leaf dark:text-saffron">{user.handle}</p>
          <p className="mt-2 text-sm text-charcoal/64 dark:text-cream/64">{user.level} • {user.league}</p>
          <div className="mt-6 grid gap-3">
            <StatPill icon={Flame} label="Streak" value={`${user.streak} days`} tone="ember" />
            <StatPill icon={Sparkles} label="Total XP" value={user.xp} tone="gold" />
            <StatPill icon={Heart} label="Hearts" value={user.hearts} />
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
                ["Accuracy", user.accuracy],
                ["Daily goal", 80],
                ["Review strength", 72]
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
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {badges.map((badge) => (
                <div key={badge.label} className="rounded-2xl bg-cream p-4 text-center dark:bg-ink/64">
                  <badge.icon className={badge.earned ? "mx-auto text-saffron" : "mx-auto text-charcoal/30 dark:text-cream/30"} />
                  <p className="mt-2 text-sm font-bold">{badge.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
