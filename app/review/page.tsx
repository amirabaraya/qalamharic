import { Brain, RotateCcw, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button, Card, ProgressBar } from "@/components/ui";
import { getCurrentLearner } from "@/lib/learner";
import { prisma } from "@/lib/prisma";

export default async function ReviewPage() {
  const learner = await getCurrentLearner();
  const cards = await prisma.reviewCard.findMany({
    where: { userId: learner.id, dueAt: { lte: new Date() } },
    orderBy: { dueAt: "asc" },
    take: 12
  });

  return (
    <AppShell title="Review" learner={learner}>
      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <Card className="bg-charcoal text-cream dark:bg-black">
          <Brain className="text-saffron" size={36} />
          <h2 className="mt-4 font-display text-5xl font-bold">{cards.length} cards due</h2>
          <p className="mt-3 text-cream/70">
            Review cards appear after you begin lessons. New learners start with an empty queue.
          </p>
          <Button href="/course" variant="secondary" className="mt-6">
            Start a chapter <Sparkles size={18} />
          </Button>
        </Card>
        {cards.length === 0 ? (
          <Card>
            <h3 className="font-display text-4xl font-bold">No review due yet</h3>
            <p className="mt-3 text-sm leading-6 text-charcoal/64 dark:text-cream/64">
              Finish your first lesson and FidelAmharic will begin building a spaced repetition queue from your vocabulary.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {cards.map((card) => (
              <Card key={card.id}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-charcoal/58 dark:text-cream/58">{card.front}</p>
                  <RotateCcw size={18} className="text-leaf dark:text-saffron" />
                </div>
                <p className="mt-4 font-display text-5xl font-bold">{card.back}</p>
                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-[0.16em] text-charcoal/56 dark:text-cream/56">
                    <span>Memory strength</span>
                    <span>{card.strength}%</span>
                  </div>
                  <ProgressBar value={card.strength} />
                </div>
                <p className="mt-3 text-sm text-charcoal/64 dark:text-cream/64">Interval: {card.intervalDays} days</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
