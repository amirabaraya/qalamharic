import { AppShell } from "@/components/app-shell";
import { AdminContentPanel } from "@/components/admin-content-panel";
import { Button, Card } from "@/components/ui";
import { getCurrentLearner } from "@/lib/learner";

export default async function AdminPage() {
  const learner = await getCurrentLearner();

  return (
    <AppShell title="Admin Content Panel" learner={learner}>
      <Card className="mb-5 bg-leaf text-cream">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-cream/70">Admin shortcut</p>
        <h2 className="mt-2 font-display text-4xl font-bold">Review the full course catalog.</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-cream/76">
          See every source group, unit, chapter, and exercise type generated from your worksheets, textbooks,
          literature, poetry, and audio materials.
        </p>
        <Button href="/admin/courses" variant="secondary" className="mt-5">
          Open full course admin
        </Button>
      </Card>
      <AdminContentPanel />
    </AppShell>
  );
}
