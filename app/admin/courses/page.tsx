import { BookOpen, FileText, Layers3 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AdminStudio } from "@/components/admin-studio";
import { Card } from "@/components/ui";
import { canManageUsers, requireContentAdmin } from "@/lib/admin";
import { sourceMaterials } from "@/lib/course-catalog";
import { prisma } from "@/lib/prisma";

export default async function AdminCoursesPage() {
  const learner = await requireContentAdmin();
  const [units, users, lessonCount] = await Promise.all([
    prisma.courseUnit.findMany({
      orderBy: { order: "asc" },
      include: { lessons: { orderBy: { order: "asc" }, select: { id: true, title: true, order: true, published: true } } }
    }),
    prisma.user.findMany({
      orderBy: [{ role: "asc" }, { createdAt: "desc" }],
      take: 50,
      select: { id: true, name: true, email: true, role: true, xp: true }
    }),
    prisma.lesson.count()
  ]);

  return (
    <AppShell title="Admin Courses" learner={learner}>
      <div className="grid gap-5 md:grid-cols-3">
        <Card>
          <Layers3 className="text-leaf dark:text-saffron" />
          <p className="mt-4 text-sm font-bold text-charcoal/60 dark:text-cream/60">Course units</p>
          <h2 className="font-display text-5xl font-bold">{units.length}</h2>
        </Card>
        <Card>
          <BookOpen className="text-leaf dark:text-saffron" />
          <p className="mt-4 text-sm font-bold text-charcoal/60 dark:text-cream/60">Lessons</p>
          <h2 className="font-display text-5xl font-bold">{lessonCount}</h2>
        </Card>
        <Card>
          <FileText className="text-leaf dark:text-saffron" />
          <p className="mt-4 text-sm font-bold text-charcoal/60 dark:text-cream/60">Source groups</p>
          <h2 className="font-display text-5xl font-bold">{sourceMaterials.length}</h2>
        </Card>
      </div>

      <Card className="mt-5 mb-5 bg-charcoal text-cream dark:bg-black">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">Admin studio</p>
        <h2 className="mt-3 font-display text-5xl font-bold">Build the path, then let learners move step by step.</h2>
        <p className="mt-4 max-w-3xl text-cream/72">
          Inspired by effective language apps: keep lessons bite-sized, mix new material with review, keep the next step obvious,
          and reserve full course control for admins.
        </p>
      </Card>

      <AdminStudio units={units} users={users} canManageUsers={canManageUsers(learner.role)} />
    </AppShell>
  );
}
