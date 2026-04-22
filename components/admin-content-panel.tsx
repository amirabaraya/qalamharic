"use client";

import { useState } from "react";
import { BarChart3, FilePlus2, Languages, PencilRuler, ShieldCheck } from "lucide-react";
import { Button, Card, ProgressBar } from "@/components/ui";
import { adminContent } from "@/lib/learning-data";

type AdminRow = {
  title: string;
  status: string;
  level: string;
  exercises: number;
};

export function AdminContentPanel() {
  const [items, setItems] = useState<AdminRow[]>(adminContent);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("Beginner");

  function addLesson() {
    const trimmed = title.trim();
    if (!trimmed) return;
    setItems((current) => [
      { title: trimmed, status: "Draft", level, exercises: 0 },
      ...current
    ]);
    setTitle("");
    setLevel("Beginner");
    setShowForm(false);
  }

  return (
    <>
      <div className="mb-5 grid gap-5 lg:grid-cols-[1fr_340px]">
        <Card className="pattern bg-charcoal text-cream dark:bg-black">
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">Content studio</p>
            <h2 className="mt-3 font-display text-5xl font-bold">Create lessons with sound, script, and memory rules.</h2>
            <p className="mt-4 max-w-3xl text-cream/72">
              Authors can draft units, add bilingual prompts, upload audio, set CEFR-ish levels, and tune spaced
              repetition intervals before publishing.
            </p>
            <Button variant="secondary" className="mt-6" onClick={() => setShowForm((value) => !value)}>
              <FilePlus2 size={18} /> New lesson
            </Button>
          </div>
        </Card>
        <Card>
          <BarChart3 className="text-leaf dark:text-saffron" />
          <h3 className="mt-4 font-display text-4xl font-bold">Content health</h3>
          <ProgressBar value={74} className="mt-5" />
          <p className="mt-3 text-sm text-charcoal/64 dark:text-cream/64">74% of beginner units have complete audio.</p>
        </Card>
      </div>

      {showForm ? (
        <Card className="mb-5">
          <h2 className="font-display text-4xl font-bold">Draft a new lesson</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_220px_auto] md:items-end">
            <label>
              <span className="mb-2 block text-sm font-bold">Lesson title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="focus-ring w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink"
                placeholder="First coffee greeting"
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold">Level</span>
              <select
                value={level}
                onChange={(event) => setLevel(event.target.value)}
                className="focus-ring w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-ink"
              >
                <option>Beginner</option>
                <option>A2</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </label>
            <Button onClick={addLesson}>Add draft</Button>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card>
          <h2 className="font-display text-4xl font-bold">Lesson inventory</h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-charcoal/10 dark:border-cream/10">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-cream text-xs uppercase tracking-[0.16em] text-charcoal/58 dark:bg-ink dark:text-cream/58">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Level</th>
                  <th className="p-4">Exercises</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={`${item.title}-${item.level}`} className="border-t border-charcoal/10 dark:border-cream/10">
                    <td className="p-4 font-bold">{item.title}</td>
                    <td className="p-4">{item.level}</td>
                    <td className="p-4">{item.exercises}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-leaf/12 px-3 py-1 text-xs font-black text-leaf dark:bg-saffron/14 dark:text-saffron">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="space-y-5">
          {[
            { icon: Languages, title: "Translation pairs", text: "English-to-Amharic and reverse prompts with accepted answers." },
            { icon: PencilRuler, title: "Exercise builder", text: "Multiple choice, type answer, audio choice, pronunciation, and flashcards." },
            { icon: ShieldCheck, title: "Accessibility checks", text: "Contrast, keyboard flow, captions, transliteration, and reduced motion." }
          ].map((tool) => (
            <Card key={tool.title}>
              <tool.icon className="text-leaf dark:text-saffron" />
              <h3 className="mt-4 font-display text-3xl font-bold">{tool.title}</h3>
              <p className="mt-2 text-sm leading-6 text-charcoal/64 dark:text-cream/64">{tool.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
