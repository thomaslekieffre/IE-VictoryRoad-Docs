import type { KeyboardEvent } from "react";

import type { Feve } from "@/lib/feves";
import { cn } from "@/lib/utils";

type ColorPalette = { badge: string; ring: string; gradient: string };

const colorTokens: Record<string, ColorPalette> = {
  bleu: {
    badge: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30",
    ring: "ring-blue-500/20 dark:ring-blue-500/30",
    gradient: "from-blue-500/15 to-transparent dark:from-blue-500/20",
  },
  rouge: {
    badge: "bg-red-500/10 text-red-700 border-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
    ring: "ring-red-500/20 dark:ring-red-500/30",
    gradient: "from-red-500/15 to-transparent dark:from-red-500/20",
  },
  rose: {
    badge: "bg-pink-500/10 text-pink-700 border-pink-500/20 dark:bg-pink-500/20 dark:text-pink-400 dark:border-pink-500/30",
    ring: "ring-pink-500/20 dark:ring-pink-500/30",
    gradient: "from-pink-500/15 to-transparent dark:from-pink-500/20",
  },
  vert: {
    badge: "bg-green-500/10 text-green-700 border-green-500/20 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30",
    ring: "ring-green-500/20 dark:ring-green-500/30",
    gradient: "from-green-500/15 to-transparent dark:from-green-500/20",
  },
  orange: {
    badge: "bg-orange-500/10 text-orange-700 border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30",
    ring: "ring-orange-500/20 dark:ring-orange-500/30",
    gradient: "from-orange-500/15 to-transparent dark:from-orange-500/20",
  },
  jaune: {
    badge: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30",
    ring: "ring-yellow-500/20 dark:ring-yellow-500/30",
    gradient: "from-yellow-500/15 to-transparent dark:from-yellow-500/20",
  },
  "bleu clair": {
    badge: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/30",
    ring: "ring-cyan-500/20 dark:ring-cyan-500/30",
    gradient: "from-cyan-500/15 to-transparent dark:from-cyan-500/20",
  },
  normal: {
    badge: "bg-muted text-muted-foreground border-border",
    ring: "ring-border",
    gradient: "from-muted/50 to-transparent",
  },
};

type FeveCardProps = {
  feve: Feve;
  onSelect?: () => void;
  isFocused?: boolean;
};

export default function FeveCard({
  feve,
  onSelect,
  isFocused = false,
}: FeveCardProps) {
  const palette = pickPalette(feve.color);
  const interactive = Boolean(onSelect);

  const handleKey = (event: KeyboardEvent<HTMLElement>) => {
    if (!interactive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.();
    }
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 rounded-3xl border border-border bg-card/90 p-4 shadow-lg transition sm:p-5",
        !isFocused && "hover:-translate-y-0.5 hover:shadow-2xl",
        palette.ring,
        isFocused && "ring-2 ring-ring shadow-2xl",
        interactive &&
          "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={handleKey}
    >
      {!isFocused && (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 opacity-30 transition duration-300 group-hover:opacity-50",
            "rounded-3xl bg-gradient-to-br",
            palette.gradient,
          )}
        />
      )}

      <header className="relative z-10 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            Fève
          </p>
          <h3 className="text-xl font-black text-foreground">{feve.name}</h3>
        </div>
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
            palette.badge,
          )}
        >
          {feve.color}
        </span>
      </header>

      <div className="relative z-10 space-y-3">
        <div className="rounded-2xl border border-dashed border-border bg-muted/50 px-4 py-3 text-sm text-foreground">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            Obtention
          </p>
          <p className="mt-1 leading-relaxed">{feve.obtention}</p>
        </div>

        {feve.astuce !== "—" && (
          <div className="rounded-2xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              Astuce
            </p>
            <p className="mt-1 leading-relaxed">{feve.astuce}</p>
          </div>
        )}
      </div>
    </article>
  );
}

function pickPalette(color: string): ColorPalette {
  const key = normalize(color);
  return colorTokens[key] ?? colorTokens.normal;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

