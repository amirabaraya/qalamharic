import { AppShell } from "@/components/app-shell";
import { PracticeLab } from "@/components/practice-lab";
import { getCurrentLearner } from "@/lib/learner";

export default async function PracticePage() {
  const learner = await getCurrentLearner();

  return (
    <AppShell title="Practice" learner={learner}>
      <PracticeLab />
    </AppShell>
  );
}
