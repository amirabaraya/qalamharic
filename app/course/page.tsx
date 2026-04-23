import Link from "next/link";
import { Lock } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { UnitCard } from "@/components/lesson-card";
import { Card } from "@/components/ui";
import { sourceMaterials } from "@/lib/course-catalog";
import { getCourseMapForUser, getCurrentLearner } from "@/lib/learner";

export default async function CoursePage() {
  const learner = await getCurrentLearner();
  const units = await getCourseMapForUser(learner.id, { unlockAll: learner.role === "ADMIN" });

  return (
    <AppShell title="Course Map" learner={learner}>
      <Card className="mb-6 bg-charcoal text-cream dark:bg-black">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">Beginner to advanced</p>
        <h2 className="mt-3 font-display text-5xl font-bold">Start at Unit 1 and grow chapter by chapter.</h2>
        <p className="mt-4 max-w-3xl text-cream/72">
          Each chapter has listening, speaking, reading, writing, vocabulary, and translation practice designed for native
          English speakers learning Amharic for the first time.
        </p>
      </Card>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {units.map((unit) => (
          <UnitCard key={unit.id} unit={{ ...unit, lessons: unit.lessons.slice(0, 4) }} />
        ))}
      </div>

      <Card className="mt-6">
        <h2 className="font-display text-4xl font-bold">All chapters</h2>
        <div className="mt-5 grid gap-4">
          {units.map((unit) => (
            <div key={unit.id} className="rounded-2xl bg-cream p-4 dark:bg-ink/64">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf dark:text-saffron">
                    {unit.level}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-bold">{unit.subtitle}</h3>
                  <p className="mt-2 text-sm leading-6 text-charcoal/64 dark:text-cream/64">{unit.description}</p>
                </div>
                <p className="rounded-full bg-leaf px-4 py-2 text-sm font-black text-cream">{unit.lessons.length} chapters</p>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {unit.lessons.map((lesson, index) => {
                  const content = (
                    <>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-leaf dark:text-saffron">
                      Chapter {index + 1} | {lesson.locked ? "locked" : `${lesson.progress}% complete`}
                    </p>
                    <h4 className="mt-1 flex items-center gap-2 font-display text-2xl font-bold">
                      {lesson.locked ? <Lock size={18} className="text-charcoal/40 dark:text-cream/40" /> : null}
                      {lesson.title}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-charcoal/64 dark:text-cream/64">{lesson.description}</p>
                    <p className="mt-3 text-xs font-bold text-charcoal/52 dark:text-cream/52">
                      {lesson.exerciseCount} exercises | {lesson.xpReward} XP | {lesson.durationMin} min
                    </p>
                    </>
                  );

                  return lesson.locked ? (
                    <div key={lesson.id} className="rounded-2xl bg-parchment/60 p-4 opacity-70 dark:bg-charcoal/50">
                      {content}
                    </div>
                  ) : (
                    <Link
                      key={lesson.id}
                      href={`/lesson?lesson=${lesson.slug}`}
                      className="focus-ring rounded-2xl bg-parchment p-4 transition hover:-translate-y-0.5 hover:bg-saffron/20 dark:bg-charcoal/72"
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="font-display text-4xl font-bold">Source library</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-charcoal/64 dark:text-cream/64">
          Your worksheets, textbook, model exams, literature PDFs, poetry, and audio are organized into teaching tracks.
          Longer books are used for summaries, vocabulary, themes, questions, and short excerpt practice.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sourceMaterials.map((source) => (
            <div key={source.group} className="rounded-2xl bg-cream p-4 dark:bg-ink/64">
              <h3 className="font-display text-3xl font-bold">{source.group}</h3>
              <p className="mt-2 text-sm leading-6 text-charcoal/64 dark:text-cream/64">{source.use}</p>
              <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-leaf dark:text-saffron">
                {source.files.length} source files
              </p>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
