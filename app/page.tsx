import { ArrowRight, BookOpen, CheckCircle2, Flame, Heart, Mic, Sparkles } from "lucide-react";
import { MarketingNav } from "@/components/marketing-nav";
import { Button, Card, GeezMark, ProgressBar, SectionHeading, StatPill } from "@/components/ui";
import { lessons, practiceSets, units, user } from "@/lib/learning-data";

export default function LandingPage() {
  return (
    <>
      <MarketingNav />
      <main>
        <section className="pattern min-h-screen overflow-hidden px-4 pb-16 pt-32 md:pt-40">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-charcoal/10 bg-cream/76 px-4 py-2 text-sm font-bold text-leaf shadow-sm dark:border-cream/10 dark:bg-charcoal/76 dark:text-saffron">
                <GeezMark className="size-8 rounded-xl text-xl" />
                Ethiopian-rooted, modern Amharic learning
              </div>
              <h1 className="font-display text-6xl font-bold leading-[0.92] text-charcoal dark:text-cream md:text-8xl">
                QalAmharic
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-8 text-charcoal/72 dark:text-cream/72">
                Learn Amharic through beautiful Ge&apos;ez script, human conversation, pronunciation practice,
                daily goals, and review that remembers what your memory is about to forget.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/signup" className="px-7">
                  Start learning <ArrowRight size={18} />
                </Button>
                <Button href="/dashboard" variant="secondary">
                  View demo dashboard
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <StatPill icon={Flame} label="Streaks" value="Gentle daily rhythm" tone="ember" />
                <StatPill icon={Mic} label="Speaking" value="Pronunciation practice" />
                <StatPill icon={Sparkles} label="Review" value="Spaced repetition" tone="gold" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-12 hidden h-64 w-64 rounded-full border border-saffron/30 md:block" />
              <Card className="relative z-10 overflow-hidden p-0 shadow-glow">
                <div className="pattern bg-leaf p-7 text-cream">
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-cream/70">Today</p>
                      <h2 className="font-display text-5xl font-bold">ሰላም ነው?</h2>
                    </div>
                    <div className="grid size-16 place-items-center rounded-2xl bg-cream text-3xl text-leaf">ቃ</div>
                  </div>
                  <p className="relative z-10 mt-4 text-cream/82">Selam new? - a warm everyday greeting.</p>
                </div>
                <div className="space-y-5 p-6">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-cream p-4 text-center dark:bg-ink/65">
                      <Flame className="mx-auto text-ember" />
                      <strong className="mt-2 block">{user.streak}</strong>
                      <span className="text-xs text-charcoal/60 dark:text-cream/60">days</span>
                    </div>
                    <div className="rounded-2xl bg-cream p-4 text-center dark:bg-ink/65">
                      <Heart className="mx-auto text-leaf" />
                      <strong className="mt-2 block">{user.hearts}</strong>
                      <span className="text-xs text-charcoal/60 dark:text-cream/60">hearts</span>
                    </div>
                    <div className="rounded-2xl bg-cream p-4 text-center dark:bg-ink/65">
                      <Sparkles className="mx-auto text-saffron" />
                      <strong className="mt-2 block">{user.weeklyXp}</strong>
                      <span className="text-xs text-charcoal/60 dark:text-cream/60">XP</span>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex justify-between text-sm font-bold">
                      <span>Daily goal</span>
                      <span>
                        {user.dailyGoal}/{user.dailyGoalTarget} XP
                      </span>
                    </div>
                    <ProgressBar value={(user.dailyGoal / user.dailyGoalTarget) * 100} />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <SectionHeading
            eyebrow="A complete learning loop"
            title="Practice that respects the language"
            description="Every unit combines sound, script, meaning, and memory so learners build confidence from fidel recognition to advanced conversation."
          />
          <div className="mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-4">
            {practiceSets.map((set) => (
              <Card key={set.title}>
                <set.icon className="text-leaf dark:text-saffron" size={30} />
                <h3 className="mt-5 font-display text-3xl font-bold">{set.title}</h3>
                <p className="mt-2 text-sm leading-6 text-charcoal/68 dark:text-cream/68">{set.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="px-4 pb-20">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-leaf dark:text-saffron">
                Built for English speakers
              </p>
              <h2 className="mt-3 font-display text-5xl font-bold md:text-6xl">
                Start with sound and meaning before the script feels intimidating.
              </h2>
              <p className="mt-5 text-lg leading-8 text-charcoal/70 dark:text-cream/70">
                QalAmharic introduces Amharic through English explanations, transliteration, slow audio, and
                practical phrases first. The Ge&apos;ez script becomes familiar through repeated, meaningful use.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["1", "Hear", "Listen to the teacher voice and slow Amharic playback."],
                ["2", "Say", "Use Latin pronunciation guides before recording yourself."],
                ["3", "Read", "Connect the Ge'ez letters to words you already understand."]
              ].map(([step, title, text]) => (
                <Card key={step}>
                  <span className="grid size-11 place-items-center rounded-2xl bg-leaf font-black text-cream">
                    {step}
                  </span>
                  <h3 className="mt-5 font-display text-3xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-charcoal/68 dark:text-cream/68">{text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-charcoal px-4 py-20 text-cream dark:bg-black">
          <SectionHeading
            eyebrow="Beginner to advanced"
            title="A course map with momentum"
            description="Short lessons, visual progress, badges, and review queues keep the experience focused without copying the usual mascot-driven pattern."
          />
          <div className="mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-3">
            {units.slice(0, 3).map((unit) => (
              <Card key={unit.id} className="bg-cream text-charcoal dark:bg-charcoal dark:text-cream">
                <BookOpen className="text-saffron" />
                <h3 className="mt-4 font-display text-3xl font-bold">{unit.subtitle}</h3>
                <p className="mt-2 text-sm font-semibold text-charcoal/60 dark:text-cream/60">{unit.level}</p>
                <ProgressBar value={unit.progress} className="mt-5" />
              </Card>
            ))}
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-leaf dark:text-saffron">
                Sample lesson
              </p>
              <h2 className="mt-3 font-display text-5xl font-bold md:text-6xl">Read, hear, speak, write.</h2>
              <p className="mt-5 text-lg leading-8 text-charcoal/70 dark:text-cream/70">
                QalAmharic mixes English-to-Amharic and Amharic-to-English exercises with pronunciation,
                listening, vocabulary drills, and typed answers.
              </p>
            </div>
            <Card className="space-y-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between rounded-2xl bg-cream p-4 dark:bg-ink/64">
                  <div>
                    <p className="font-display text-3xl font-bold">{lesson.phrase}</p>
                    <p className="text-sm text-charcoal/62 dark:text-cream/62">{lesson.translation}</p>
                  </div>
                  <CheckCircle2 className="text-leaf dark:text-saffron" />
                </div>
              ))}
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
