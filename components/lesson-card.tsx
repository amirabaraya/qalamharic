import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { Button, Card, ProgressBar } from "@/components/ui";
import { cn } from "@/lib/utils";

export function UnitCard({
  unit,
  index
}: {
  unit: {
    title: string;
    subtitle: string;
    level: string;
    progress: number;
    lessons: string[];
    color: string;
  };
  index: number;
}) {
  const isLocked = unit.progress === 0;
  const isComplete = unit.progress === 100;

  return (
    <Card className="pattern relative overflow-hidden">
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf dark:text-saffron">
            {unit.level}
          </p>
          <h3 className="mt-2 font-display text-3xl font-bold">{unit.title}</h3>
          <p className="text-sm font-semibold text-charcoal/68 dark:text-cream/68">{unit.subtitle}</p>
        </div>
        <div
          className={cn(
            "grid size-14 place-items-center rounded-2xl text-cream",
            isComplete ? "bg-leaf" : isLocked ? "bg-charcoal/30" : "bg-saffron text-ink"
          )}
        >
          {isComplete ? <CheckCircle2 /> : isLocked ? <Lock /> : <PlayCircle />}
        </div>
      </div>
      <div className="relative z-10 mt-6 space-y-3">
        {unit.lessons.map((lesson, lessonIndex) => (
          <div key={lesson} className="flex items-center gap-3 text-sm font-semibold">
            <span className="grid size-7 place-items-center rounded-full bg-charcoal/8 text-xs dark:bg-cream/10">
              {index + lessonIndex + 1}
            </span>
            {lesson}
          </div>
        ))}
      </div>
      <div className="relative z-10 mt-6">
        <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-[0.16em] text-charcoal/56 dark:text-cream/56">
          <span>Progress</span>
          <span>{unit.progress}%</span>
        </div>
        <ProgressBar value={unit.progress} />
      </div>
      <Button href="/lesson" className="relative z-10 mt-6 w-full" variant={isLocked ? "secondary" : "primary"}>
        {isLocked ? "Preview unit" : "Continue"}
      </Button>
    </Card>
  );
}
