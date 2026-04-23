import { AppShell } from "@/components/app-shell";
import { SettingsPanel } from "@/components/settings-panel";
import { getCurrentLearner } from "@/lib/learner";

export default async function SettingsPage() {
  const learner = await getCurrentLearner();

  return (
    <AppShell title="Settings" learner={learner}>
      <SettingsPanel />
    </AppShell>
  );
}
