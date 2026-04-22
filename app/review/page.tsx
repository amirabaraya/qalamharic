import { Brain, RotateCcw, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button, Card, ProgressBar } from "@/components/ui";
import { reviewCards } from "@/lib/learning-data";

export default function ReviewPage() {
  return (
    <AppShell title="Review">
      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <Card className="bg-charcoal text-cream dark:bg-black">
          <Brain className="text-saffron" size={36} />
          <h2 className="mt-4 font-display text-5xl font-bold">18 cards due</h2>
          <p className="mt-3 text-cream/70">
            The spaced repetition queue prioritizes words nearing the edge of recall.
          </p>
          <Button href="/lesson" variant="secondary" className="mt-6">
            Start review <Sparkles size={18} />
          </Button>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          {reviewCards.map((card) => (
            <Card key={card.back}>
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
              <p className="mt-3 text-sm text-charcoal/64 dark:text-cream/64">Next review: {card.next}</p>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
