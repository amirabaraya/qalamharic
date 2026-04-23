import { BookOpen, FileText, Layers3 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui";
import { fullCourseCatalog, sourceMaterials } from "@/lib/course-catalog";
import { getCurrentLearner } from "@/lib/learner";

export default async function AdminCoursesPage() {
  const learner = await getCurrentLearner();
  const lessonCount = fullCourseCatalog.reduce((total, unit) => total + unit.lessons.length, 0);

  return (
    <AppShell title="Admin Courses" learner={learner}>
      <div className="grid gap-5 md:grid-cols-3">
        <Card>
          <Layers3 className="text-leaf dark:text-saffron" />
          <p className="mt-4 text-sm font-bold text-charcoal/60 dark:text-cream/60">Course units</p>
          <h2 className="font-display text-5xl font-bold">{fullCourseCatalog.length}</h2>
        </Card>
        <Card>
          <BookOpen className="text-leaf dark:text-saffron" />
          <p className="mt-4 text-sm font-bold text-charcoal/60 dark:text-cream/60">Chapters</p>
          <h2 className="font-display text-5xl font-bold">{lessonCount}</h2>
        </Card>
        <Card>
          <FileText className="text-leaf dark:text-saffron" />
          <p className="mt-4 text-sm font-bold text-charcoal/60 dark:text-cream/60">Source groups</p>
          <h2 className="font-display text-5xl font-bold">{sourceMaterials.length}</h2>
        </Card>
      </div>

      <Card className="mt-5">
        <h2 className="font-display text-4xl font-bold">Source material map</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {sourceMaterials.map((source) => (
            <div key={source.group} className="rounded-2xl bg-cream p-4 dark:bg-ink/64">
              <h3 className="font-display text-3xl font-bold">{source.group}</h3>
              <p className="mt-2 text-sm leading-6 text-charcoal/64 dark:text-cream/64">{source.use}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {source.files.map((file) => (
                  <span
                    key={file}
                    className="rounded-full bg-leaf/10 px-3 py-1 text-xs font-bold text-leaf dark:bg-saffron/12 dark:text-saffron"
                  >
                    {file}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-5 space-y-5">
        {fullCourseCatalog.map((unit, unitIndex) => (
          <Card key={unit.slug}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf dark:text-saffron">
                  Unit {unitIndex + 1} • {unit.level.replace("_", " ")}
                </p>
                <h2 className="mt-2 font-display text-4xl font-bold">{unit.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-charcoal/64 dark:text-cream/64">
                  {unit.description}
                </p>
                <p className="mt-2 text-xs font-semibold text-charcoal/52 dark:text-cream/52">
                  Based on: {unit.source}
                </p>
              </div>
              <span className="rounded-full bg-leaf px-4 py-2 text-sm font-black text-cream">
                {unit.lessons.length} chapters
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {unit.lessons.map(([slug, title, description, exercises], chapterIndex) => (
                <div key={slug} className="rounded-2xl bg-cream p-4 dark:bg-ink/64">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-leaf dark:text-saffron">
                    Chapter {chapterIndex + 1}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-charcoal/64 dark:text-cream/64">{description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {exercises.map((exercise) => (
                      <span
                        key={exercise}
                        className="rounded-full bg-charcoal/8 px-3 py-1 text-xs font-bold dark:bg-cream/10"
                      >
                        {exercise}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
