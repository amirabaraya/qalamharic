import { Crown, Flame, Medal, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";
import { getCurrentLearner } from "@/lib/learner";
import { prisma } from "@/lib/prisma";

export default async function LeaderboardPage() {
  const learner = await getCurrentLearner();
  const leaders = await prisma.user.findMany({
    where: { xp: { gt: 0 } },
    orderBy: [{ xp: "desc" }, { streak: "desc" }],
    take: 20,
    select: { id: true, name: true, email: true, xp: true, streak: true }
  });
  const rows = leaders.some((person) => person.id === learner.id)
    ? leaders
    : [...leaders, { id: learner.id, name: learner.name, email: learner.email, xp: learner.xp, streak: learner.streak }];

  return (
    <AppShell title="Leaderboard" learner={learner}>
      <Card className="mb-5 pattern bg-saffron text-ink">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-ink/62">Gold Saffron League</p>
            <h2 className="mt-2 font-display text-5xl font-bold">Start at zero, climb with practice.</h2>
            <p className="mt-3 max-w-2xl text-ink/72">
              Leaderboard XP comes from real completed lessons, so new accounts begin fresh.
            </p>
          </div>
          <Crown size={58} />
        </div>
      </Card>
      <div className="grid gap-4">
        {rows.map((person, index) => (
          <Card key={person.id} className={person.id === learner.id ? "border-saffron bg-saffron/14" : ""}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="grid size-12 place-items-center rounded-2xl bg-leaf font-black text-cream">
                  {index < 3 ? <Medal /> : index + 1}
                </div>
                <div>
                  <h3 className="font-display text-3xl font-bold">{person.name ?? "Learner"}</h3>
                  <p className="flex items-center gap-2 text-sm text-charcoal/62 dark:text-cream/62">
                    <Flame size={15} className="text-ember" /> {person.streak} day streak
                  </p>
                </div>
              </div>
              <p className="flex items-center gap-2 text-lg font-black">
                <Trophy className="text-saffron" /> {person.xp} XP
              </p>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
