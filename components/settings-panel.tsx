"use client";

import { useState } from "react";
import { Bell, Eye, Globe2, Moon, Shield, SlidersHorizontal, Volume2 } from "lucide-react";
import { Card } from "@/components/ui";

const initialSettings = [
  { icon: Bell, title: "Daily reminder", value: "7:30 PM", active: true },
  { icon: Volume2, title: "Audio autoplay", value: "Lessons only", active: true },
  { icon: Moon, title: "Dark mode", value: "Use the top-right theme button", active: true },
  { icon: Eye, title: "High contrast practice", value: "Larger answer targets", active: false },
  { icon: Globe2, title: "Interface language", value: "English explanations", active: true },
  { icon: Shield, title: "Private profile", value: "Hide from leaderboard", active: false }
];

export function SettingsPanel() {
  const [settings, setSettings] = useState(initialSettings);

  function toggle(title: string) {
    setSettings((items) =>
      items.map((item) => (item.title === title ? { ...item, active: !item.active } : item))
    );
  }

  return (
    <>
      <Card className="mb-5">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="text-leaf dark:text-saffron" />
          <div>
            <h2 className="font-display text-4xl font-bold">Learning preferences</h2>
            <p className="text-sm text-charcoal/64 dark:text-cream/64">
              Accessibility, notifications, audio behavior, privacy, and goal settings.
            </p>
          </div>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {settings.map((setting) => (
          <Card key={setting.title}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="grid size-12 place-items-center rounded-2xl bg-cream dark:bg-ink/64">
                  <setting.icon className="text-leaf dark:text-saffron" />
                </div>
                <div>
                  <h3 className="font-display text-3xl font-bold">{setting.title}</h3>
                  <p className="text-sm text-charcoal/60 dark:text-cream/60">{setting.value}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle(setting.title)}
                className={`focus-ring h-8 w-14 rounded-full p-1 transition ${setting.active ? "bg-leaf" : "bg-charcoal/20 dark:bg-cream/20"}`}
                aria-label={`${setting.title} toggle`}
                aria-pressed={setting.active}
              >
                <span
                  className={`block size-6 rounded-full bg-cream transition ${setting.active ? "translate-x-6" : "translate-x-0"}`}
                />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
