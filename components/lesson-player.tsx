"use client";

import { useState } from "react";
import { Check, GraduationCap, Headphones, Heart, Mic, Volume2, X } from "lucide-react";
import { Button, Card, ProgressBar } from "@/components/ui";
import { speakText } from "@/lib/speech";
import { cn } from "@/lib/utils";

type LessonPlayerProps = {
  learner: { hearts: number };
  lesson: {
    id: string;
    slug: string;
    title: string;
    description: string;
    xpReward: number;
    durationMin: number;
    unit: { title: string };
    progress: Array<{ percent: number }>;
    exercises: Array<{
      id: string;
      type: string;
      prompt: string;
      amharicText: string | null;
      transliteration: string | null;
      englishText: string | null;
      options: unknown;
      answer: unknown;
      explanation: string | null;
    }>;
  };
};

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function answerText(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "value" in value && typeof value.value === "string") return value.value;
  return "";
}

export function LessonPlayer({ learner, lesson }: LessonPlayerProps) {
  const firstExercise = lesson.exercises[0];
  const [selected, setSelected] = useState<string | null>(null);
  const [saved, setSaved] = useState(lesson.progress[0]?.percent === 100);
  const [teacherStatus, setTeacherStatus] = useState("Start with the sound, then choose the meaning.");
  const options = asStringArray(firstExercise?.options);
  const correctAnswer = answerText(firstExercise?.answer);
  const phrase = firstExercise?.amharicText ?? lesson.title;
  const transliteration = firstExercise?.transliteration ?? "Listen slowly, then repeat.";
  const translation = firstExercise?.englishText ?? lesson.description;
  const isCorrect = selected === correctAnswer;

  async function saveProgress() {
    if (!isCorrect || saved) return;
    const response = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: lesson.id, correct: true })
    });
    if (response.ok) {
      setSaved(true);
      setTeacherStatus(`Lesson complete. You earned ${lesson.xpReward} XP.`);
    }
  }

  function playPhrase() {
    speakText(phrase, "am-ET", 0.72, `Amharic pronunciation: ${transliteration}. ${translation}.`).then((spoken) => {
      setTeacherStatus(
        spoken
          ? "Listen for the Amharic rhythm. If your device has no Amharic voice, you will hear a pronunciation guide."
          : "Audio playback is not available in this browser."
      );
    });
  }

  function teachPhrase() {
    speakText(
      `${translation}. In Amharic this is pronounced ${transliteration}. This lesson is for English speakers, so focus on meaning first and script shape second.`,
      "en-US",
      0.88
    ).then((spoken) => {
      setTeacherStatus(spoken ? "Teacher voice is explaining the phrase in English." : "Teacher voice is not available in this browser.");
    });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <Card className="pattern min-h-[560px]">
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-leaf dark:text-saffron">
              {lesson.unit.title}
            </p>
            <h2 className="mt-2 font-display text-5xl font-bold">{lesson.title}</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-cream px-4 py-2 font-bold dark:bg-ink/64">
            <Heart className="text-leaf" size={18} /> {learner.hearts}
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
          <p className="font-display text-7xl font-bold">{phrase}</p>
          <p className="mt-3 text-lg text-cream/72">{transliteration}</p>
          <p className="mt-2 text-cream/86">{translation}</p>
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
          <h3 className="text-xl font-black">{firstExercise?.prompt ?? "Choose the best meaning."}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {options.map((option) => {
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
              {isCorrect ? <Check /> : <X />} {isCorrect ? "Correct. Save this chapter and keep going." : firstExercise?.explanation ?? "Close. Listen once more and try again."}
            </span>
            <Button onClick={saveProgress} variant="secondary">
              {saved ? "Saved" : "Finish lesson"}
            </Button>
          </div>
        ) : null}
      </Card>

      <div className="space-y-5">
        <Card>
          <h3 className="font-display text-3xl font-bold">For first-time learners</h3>
          <ol className="mt-4 space-y-3 text-sm leading-6 text-charcoal/70 dark:text-cream/70">
            <li><strong>1.</strong> Hear the phrase before reading it.</li>
            <li><strong>2.</strong> Use the Latin guide: {transliteration}.</li>
            <li><strong>3.</strong> Match meaning first. Script mastery comes through repetition.</li>
          </ol>
        </Card>
        <Card>
          <h3 className="font-display text-3xl font-bold">Lesson mix</h3>
          <div className="mt-5 space-y-4">
            {[
              { icon: Headphones, label: "Listening", done: saved },
              { icon: Mic, label: "Pronunciation", done: false },
              { icon: Check, label: "Meaning", done: saved }
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
          <ProgressBar value={saved ? 100 : lesson.progress[0]?.percent ?? 0} className="mt-5" />
          <p className="mt-3 text-sm text-charcoal/64 dark:text-cream/64">
            {lesson.exercises.length} exercises in this chapter | {lesson.xpReward} XP
          </p>
        </Card>
      </div>
    </div>
  );
}
