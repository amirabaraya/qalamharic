"use client";

import { useState } from "react";
import { Check, GraduationCap, Headphones, Heart, Mic, Volume2, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button, Card, ProgressBar } from "@/components/ui";
import { lessons, user } from "@/lib/learning-data";
import { speakText } from "@/lib/speech";
import { cn } from "@/lib/utils";

const lesson = lessons[0];

export default function LessonPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [teacherStatus, setTeacherStatus] = useState("Start with the sound, then choose the meaning.");
  const isCorrect = selected === lesson.answer;

  function playPhrase() {
    const spoken = speakText(lesson.phrase, "am-ET", 0.72);
    setTeacherStatus(spoken ? "Listen for the soft rhythm of the phrase." : "Audio playback is not available in this browser.");
  }

  function teachPhrase() {
    const spoken = speakText(
      `${lesson.translation}. In Amharic this is pronounced ${lesson.transliteration}. Listen for two parts: selam, then new.`,
      "en-US",
      0.88
    );
    setTeacherStatus(spoken ? "Teacher voice is explaining the phrase in English." : "Teacher voice is not available in this browser.");
  }

  return (
    <AppShell title="Lesson">
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card className="pattern min-h-[560px]">
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-leaf dark:text-saffron">
                {lesson.unit}
              </p>
              <h2 className="mt-2 font-display text-5xl font-bold">{lesson.title}</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-cream px-4 py-2 font-bold dark:bg-ink/64">
              <Heart className="text-leaf" size={18} /> {user.hearts}
            </div>
          </div>

          <div className="relative z-10 mt-8 rounded-3xl bg-leaf p-8 text-cream">
            <button
              className="focus-ring mb-5 grid size-12 place-items-center rounded-full bg-cream text-leaf"
              aria-label="Play phrase"
              onClick={playPhrase}
              type="button"
            >
              <Volume2 />
            </button>
            <p className="font-display text-7xl font-bold">{lesson.phrase}</p>
            <p className="mt-3 text-lg text-cream/72">{lesson.transliteration}</p>
            <p className="mt-2 text-cream/86">{lesson.translation}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={playPhrase}>
                <Volume2 size={18} /> Hear it
              </Button>
              <Button variant="secondary" onClick={teachPhrase}>
                <GraduationCap size={18} /> Explain in English
              </Button>
            </div>
            <p className="mt-4 text-sm font-bold text-cream/78" role="status">
              {teacherStatus}
            </p>
          </div>

          <div className="relative z-10 mt-8">
            <h3 className="text-xl font-black">{lesson.prompt}</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {lesson.options.map((option) => {
                const active = selected === option;
                return (
                  <button
                    key={option}
                    onClick={() => setSelected(option)}
                    className={cn(
                      "focus-ring rounded-2xl border border-charcoal/10 bg-cream p-5 text-left text-xl font-bold transition hover:-translate-y-0.5 dark:border-cream/10 dark:bg-ink/64",
                      active && "border-saffron bg-saffron/18"
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {selected ? (
            <div
              className={cn(
                "relative z-10 mt-6 flex flex-col gap-3 rounded-2xl p-4 font-bold sm:flex-row sm:items-center sm:justify-between",
                isCorrect ? "bg-leaf text-cream" : "bg-ember text-cream"
              )}
              role="status"
            >
              <span className="flex items-center gap-2">
                {isCorrect ? <Check /> : <X />} {isCorrect ? "Beautiful. That greeting carries warmth." : "Close. Try the greeting phrase."}
              </span>
              <Button href="/practice" variant="secondary">
                Continue
              </Button>
            </div>
          ) : null}
        </Card>

        <div className="space-y-5">
          <Card>
            <h3 className="font-display text-3xl font-bold">For first-time learners</h3>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-charcoal/70 dark:text-cream/70">
              <li><strong>1.</strong> Hear the phrase before reading it.</li>
              <li><strong>2.</strong> Use the Latin guide: {lesson.transliteration}.</li>
              <li><strong>3.</strong> Match meaning first. Script mastery comes through repetition.</li>
            </ol>
          </Card>
          <Card>
            <h3 className="font-display text-3xl font-bold">Lesson mix</h3>
            <div className="mt-5 space-y-4">
              {[
                { icon: Headphones, label: "Listening", done: true },
                { icon: Mic, label: "Pronunciation", done: false },
                { icon: Check, label: "Meaning", done: false }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl bg-cream p-4 dark:bg-ink/64">
                  <span className="flex items-center gap-3 font-bold">
                    <item.icon className="text-leaf dark:text-saffron" /> {item.label}
                  </span>
                  <span className="text-sm font-bold">{item.done ? "Done" : "Next"}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="font-display text-3xl font-bold">Progress</h3>
            <ProgressBar value={46} className="mt-5" />
            <p className="mt-3 text-sm text-charcoal/64 dark:text-cream/64">4 of 9 exercises complete</p>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
