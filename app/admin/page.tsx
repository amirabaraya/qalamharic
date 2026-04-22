import { AppShell } from "@/components/app-shell";
import { AdminContentPanel } from "@/components/admin-content-panel";

export default function AdminPage() {
  return (
    <AppShell title="Admin Content Panel">
      <AdminContentPanel />
    </AppShell>
  );
}
