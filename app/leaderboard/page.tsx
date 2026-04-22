import { Crown, Flame, Medal, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";
import { leaderboard } from "@/lib/learning-data";

export default function LeaderboardPage() {
  return (
    <AppShell title="Leaderboard">
      <Card className="mb-5 pattern bg-saffron text-ink">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-ink/62">Gold Saffron League</p>
            <h2 className="mt-2 font-display text-5xl font-bold">Compete with grace.</h2>
            <p className="mt-3 max-w-2xl text-ink/72">
              Weekly XP rewards consistent practice while streak protection keeps the tone humane.
            </p>
          </div>
          <Crown size={58} />
        </div>
      </Card>
      <div className="grid gap-4">
        {leaderboard.map((person) => (
          <Card key={person.rank} className={person.name === "Maya" ? "border-saffron bg-saffron/14" : ""}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="grid size-12 place-items-center rounded-2xl bg-leaf font-black text-cream">
                  {person.rank <= 3 ? <Medal /> : person.rank}
                </div>
                <div>
                  <h3 className="font-display text-3xl font-bold">{person.name}</h3>
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
