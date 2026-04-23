"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowDown, ArrowUp, BookPlus, ShieldCheck, UserPlus } from "lucide-react";
import { Button, Card } from "@/components/ui";

type AdminUnit = {
  id: string;
  title: string;
  description: string;
  level: string;
  order: number;
  lessons: Array<{ id: string; title: string; order: number; published: boolean }>;
};

type AdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  xp: number;
};

export function AdminStudio({ units, users, canManageUsers }: { units: AdminUnit[]; users: AdminUser[]; canManageUsers: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [unitTitle, setUnitTitle] = useState("");
  const [unitDescription, setUnitDescription] = useState("");
  const [unitLevel, setUnitLevel] = useState("BEGINNER");
  const [lessonUnitId, setLessonUnitId] = useState(units[0]?.id ?? "");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [amharicText, setAmharicText] = useState("");
  const [transliteration, setTransliteration] = useState("");
  const [englishText, setEnglishText] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminRole, setAdminRole] = useState("EDITOR");

  async function submitJson(url: string, method: "POST" | "PATCH", body: unknown, message: string) {
    setStatus("Saving...");
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) {
      setStatus(payload?.error ?? "Could not save.");
      return;
    }
    setStatus(message);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <BookPlus className="text-leaf dark:text-saffron" />
          <h2 className="mt-4 font-display text-4xl font-bold">Add unit</h2>
          <div className="mt-5 space-y-3">
            <input className="focus-ring w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink" placeholder="Unit title" value={unitTitle} onChange={(event) => setUnitTitle(event.target.value)} />
            <textarea className="focus-ring min-h-28 w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink" placeholder="What this unit teaches" value={unitDescription} onChange={(event) => setUnitDescription(event.target.value)} />
            <select className="focus-ring w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink" value={unitLevel} onChange={(event) => setUnitLevel(event.target.value)}>
              <option value="BEGINNER">Beginner</option>
              <option value="LOWER_INTERMEDIATE">Lower intermediate</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
            <Button className="w-full" onClick={() => submitJson("/api/admin/units", "POST", { title: unitTitle, description: unitDescription, level: unitLevel }, "Unit created.")}>
              Create unit
            </Button>
          </div>
        </Card>

        <Card>
          <BookPlus className="text-leaf dark:text-saffron" />
          <h2 className="mt-4 font-display text-4xl font-bold">Add lesson</h2>
          <div className="mt-5 space-y-3">
            <select className="focus-ring w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink" value={lessonUnitId} onChange={(event) => setLessonUnitId(event.target.value)}>
              {units.map((unit) => <option key={unit.id} value={unit.id}>{unit.title}</option>)}
            </select>
            <input className="focus-ring w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink" placeholder="Lesson title" value={lessonTitle} onChange={(event) => setLessonTitle(event.target.value)} />
            <textarea className="focus-ring min-h-24 w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink" placeholder="Lesson goal" value={lessonDescription} onChange={(event) => setLessonDescription(event.target.value)} />
            <input className="focus-ring w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink" placeholder="Amharic, e.g. ሰላም" value={amharicText} onChange={(event) => setAmharicText(event.target.value)} />
            <input className="focus-ring w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink" placeholder="Transliteration, e.g. selam" value={transliteration} onChange={(event) => setTransliteration(event.target.value)} />
            <input className="focus-ring w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink" placeholder="English meaning" value={englishText} onChange={(event) => setEnglishText(event.target.value)} />
            <Button className="w-full" onClick={() => submitJson("/api/admin/lessons", "POST", { unitId: lessonUnitId, title: lessonTitle, description: lessonDescription, amharicText, transliteration, englishText, xpReward: 25 }, "Lesson created.")}>
              Create lesson
            </Button>
          </div>
        </Card>

        <Card>
          <UserPlus className="text-leaf dark:text-saffron" />
          <h2 className="mt-4 font-display text-4xl font-bold">Admin access</h2>
          {canManageUsers ? (
            <div className="mt-5 space-y-3">
              <input className="focus-ring w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink" placeholder="Name" value={adminName} onChange={(event) => setAdminName(event.target.value)} />
              <input className="focus-ring w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink" placeholder="Email" value={adminEmail} onChange={(event) => setAdminEmail(event.target.value)} />
              <input className="focus-ring w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink" placeholder="Temporary password" type="password" value={adminPassword} onChange={(event) => setAdminPassword(event.target.value)} />
              <select className="focus-ring w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink" value={adminRole} onChange={(event) => setAdminRole(event.target.value)}>
                <option value="EDITOR">Editor: course content only</option>
                <option value="ADMIN">Full admin: users and content</option>
                <option value="LEARNER">Learner</option>
              </select>
              <Button className="w-full" onClick={() => submitJson("/api/admin/users", "POST", { name: adminName, email: adminEmail, password: adminPassword, role: adminRole }, "User access saved.")}>
                Save access
              </Button>
            </div>
          ) : (
            <p className="mt-5 rounded-2xl bg-cream p-4 text-sm font-bold text-charcoal/62 dark:bg-ink/64 dark:text-cream/62">
              Editors can manage content. Full admins can create admins and change roles.
            </p>
          )}
        </Card>
      </div>

      {status ? <p className="rounded-2xl bg-leaf p-4 text-sm font-black text-cream" role="status">{status}</p> : null}

      <Card>
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-saffron" />
          <h2 className="font-display text-4xl font-bold">Course order</h2>
        </div>
        <div className="mt-5 space-y-4">
          {units.map((unit) => (
            <div key={unit.id} className="rounded-2xl bg-cream p-4 dark:bg-ink/64">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-leaf dark:text-saffron">Unit {unit.order} | {unit.level.replace("_", " ")}</p>
                  <h3 className="font-display text-3xl font-bold">{unit.title}</h3>
                  <p className="mt-1 text-sm text-charcoal/62 dark:text-cream/62">{unit.lessons.length} lessons</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => submitJson("/api/admin/reorder", "PATCH", { type: "unit", id: unit.id, direction: "up" }, "Unit moved.")}><ArrowUp size={16} /></Button>
                  <Button variant="secondary" onClick={() => submitJson("/api/admin/reorder", "PATCH", { type: "unit", id: unit.id, direction: "down" }, "Unit moved.")}><ArrowDown size={16} /></Button>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {unit.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between rounded-xl bg-parchment px-3 py-2 text-sm font-bold dark:bg-charcoal/70">
                    <span>{lesson.order}. {lesson.title}</span>
                    <span className="flex gap-2">
                      <Button variant="ghost" onClick={() => submitJson("/api/admin/reorder", "PATCH", { type: "lesson", id: lesson.id, direction: "up" }, "Lesson moved.")}><ArrowUp size={14} /></Button>
                      <Button variant="ghost" onClick={() => submitJson("/api/admin/reorder", "PATCH", { type: "lesson", id: lesson.id, direction: "down" }, "Lesson moved.")}><ArrowDown size={14} /></Button>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {canManageUsers ? (
        <Card>
          <h2 className="font-display text-4xl font-bold">People and roles</h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-charcoal/10 dark:border-cream/10">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-cream text-xs uppercase tracking-[0.16em] text-charcoal/58 dark:bg-ink dark:text-cream/58">
                <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">XP</th></tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-charcoal/10 dark:border-cream/10">
                    <td className="p-4 font-bold">{user.name ?? "Learner"}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.role}</td>
                    <td className="p-4">{user.xp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
