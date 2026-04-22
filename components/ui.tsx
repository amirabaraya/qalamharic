import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Button({
  children,
  href,
  variant = "primary",
  className,
  ...props
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = cn(
    "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition duration-200",
    variant === "primary" &&
      "bg-leaf text-parchment shadow-glow hover:-translate-y-0.5 hover:bg-charcoal dark:bg-saffron dark:text-ink dark:hover:bg-cream",
    variant === "secondary" &&
      "border border-charcoal/10 bg-cream text-charcoal hover:-translate-y-0.5 hover:border-saffron dark:border-cream/15 dark:bg-charcoal dark:text-cream",
    variant === "ghost" && "text-charcoal hover:bg-charcoal/5 dark:text-cream dark:hover:bg-cream/10",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  );
}

export function Card({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-charcoal/10 bg-parchment/82 p-5 shadow-sm dark:border-cream/10 dark:bg-charcoal/76",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatPill({
  icon: Icon,
  label,
  value,
  tone = "green"
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone?: "green" | "gold" | "ember";
}) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-charcoal/10 bg-cream/80 px-4 py-2 dark:border-cream/10 dark:bg-ink/60">
      <span
        className={cn(
          "grid size-9 place-items-center rounded-full",
          tone === "green" && "bg-leaf text-cream",
          tone === "gold" && "bg-saffron text-ink",
          tone === "ember" && "bg-ember text-cream"
        )}
      >
        <Icon size={18} aria-hidden="true" />
      </span>
      <span>
        <span className="block text-xs text-charcoal/60 dark:text-cream/60">{label}</span>
        <strong className="text-sm">{value}</strong>
      </span>
    </div>
  );
}

export function ProgressBar({
  value,
  className
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={cn("h-3 overflow-hidden rounded-full bg-charcoal/10 dark:bg-cream/10", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-leaf via-saffron to-ember"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-leaf dark:text-saffron">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-4xl font-bold leading-tight text-charcoal dark:text-cream md:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-charcoal/70 dark:text-cream/72 md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function GeezMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "geez-ring grid size-12 place-items-center rounded-2xl font-display text-3xl font-bold text-leaf dark:text-saffron",
        className
      )}
      aria-label="QalAmharic mark"
    >
      ቃ
    </div>
  );
}
