import { AppShell } from "@/components/app-shell";
import { UnitCard } from "@/components/lesson-card";
import { Card } from "@/components/ui";
import { units } from "@/lib/learning-data";

export default function CoursePage() {
  return (
    <AppShell title="Course Map">
      <Card className="mb-6 bg-charcoal text-cream dark:bg-black">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">Beginner to advanced</p>
        <h2 className="mt-3 font-display text-5xl font-bold">Follow the thread from fidel to fluent nuance.</h2>
        <p className="mt-4 max-w-3xl text-cream/72">
          Units open in gentle arcs: script, phrase, sound, structure, conversation, and review. Each stop blends
          vocabulary drills, listening, speaking, writing, and mixed translation.
        </p>
      </Card>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {units.map((unit, index) => (
          <UnitCard key={unit.id} unit={unit} index={index} />
        ))}
      </div>
    </AppShell>
  );
}
