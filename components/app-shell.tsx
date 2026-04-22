import Link from "next/link";
import { Settings } from "lucide-react";
import { GeezMark, StatPill } from "@/components/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import { navItems, user } from "@/lib/learning-data";
import { Flame, Heart, Sparkles } from "lucide-react";

export function AppShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-charcoal/10 bg-parchment/90 px-5 py-6 backdrop-blur-xl dark:border-cream/10 dark:bg-ink/88 md:block">
        <Link href="/dashboard" className="focus-ring mb-8 flex items-center gap-3 rounded-2xl">
          <GeezMark />
          <span>
            <span className="block font-display text-3xl font-bold">FidelAmharic</span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf dark:text-saffron">
              ቃል by ቃል
            </span>
          </span>
        </Link>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring flex items-center gap-3 rounded-2xl px-4 py-3 font-bold text-charcoal/72 transition hover:bg-leaf hover:text-cream dark:text-cream/72 dark:hover:bg-saffron dark:hover:text-ink"
            >
              <item.icon size={20} aria-hidden="true" />
              {item.label}
            </Link>
          ))}
          <Link
            href="/settings"
            className="focus-ring flex items-center gap-3 rounded-2xl px-4 py-3 font-bold text-charcoal/72 transition hover:bg-leaf hover:text-cream dark:text-cream/72 dark:hover:bg-saffron dark:hover:text-ink"
          >
            <Settings size={20} aria-hidden="true" />
            Settings
          </Link>
        </nav>
      </aside>

      <main className="md:pl-72">
        <header className="sticky top-0 z-30 border-b border-charcoal/10 bg-parchment/84 px-4 py-4 backdrop-blur-xl dark:border-cream/10 dark:bg-ink/84 md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-leaf dark:text-saffron">
                FidelAmharic
              </p>
              <h1 className="font-display text-3xl font-bold md:text-5xl">{title}</h1>
            </div>
            <div className="hidden items-center gap-2 lg:flex">
              <StatPill icon={Flame} label="Streak" value={`${user.streak} days`} tone="ember" />
              <StatPill icon={Sparkles} label="XP" value={user.xp.toLocaleString()} tone="gold" />
              <StatPill icon={Heart} label="Hearts" value={user.hearts} tone="green" />
            </div>
            <ThemeToggle />
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">{children}</div>
        <footer className="mx-auto max-w-7xl px-4 pb-10 text-sm font-bold text-charcoal/54 dark:text-cream/54 md:px-8">
          Built by Amir Abaraya.
        </footer>
      </main>

      <nav className="fixed bottom-3 left-3 right-3 z-50 grid grid-cols-6 rounded-3xl border border-charcoal/10 bg-parchment/94 p-2 shadow-gold backdrop-blur-xl dark:border-cream/10 dark:bg-charcoal/94 md:hidden">
        {navItems.slice(0, 6).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="focus-ring grid place-items-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-bold text-charcoal/70 dark:text-cream/70"
            aria-label={item.label}
          >
            <item.icon size={19} aria-hidden="true" />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
