import type { KeyboardEvent } from "react";
import type { HeroS1 } from "@/lib/heroes-s1";
import { cn } from "@/lib/utils";

type HeroCardProps = {
  hero: HeroS1;
  onSelect?: (hero: HeroS1) => void;
  isFocused?: boolean;
};

const colorTokens: Record<string, { badge: string; dot: string; glow: string }> = {
  rose: {
    badge: "bg-pink-500/10 text-pink-600 border-pink-500/20 dark:bg-pink-500/20 dark:text-pink-400 dark:border-pink-500/30",
    dot: "bg-pink-400 dark:bg-pink-500",
    glow: "from-pink-500/20 to-transparent dark:from-pink-500/25",
  },
  rouge: {
    badge: "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
    dot: "bg-red-400 dark:bg-red-500",
    glow: "from-red-500/20 to-transparent dark:from-red-500/25",
  },
  gris: {
    badge: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
    glow: "from-muted/50 to-transparent",
  },
  bleu: {
    badge: "bg-sky-500/10 text-sky-600 border-sky-500/20 dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30",
    dot: "bg-sky-400 dark:bg-sky-500",
    glow: "from-sky-500/20 to-transparent dark:from-sky-500/25",
  },
};

export default function HeroCard({
  hero,
  onSelect,
  isFocused = false,
}: HeroCardProps) {
  const colorKey = hero.color.toLowerCase();
  const palette = colorTokens[colorKey] ?? colorTokens.gris;

  const interactive = Boolean(onSelect);

  const handleKey = (event: KeyboardEvent<HTMLElement>) => {
    if (!interactive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.(hero);
    }
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card/90 p-4 shadow-lg transition-all sm:gap-4 sm:rounded-3xl sm:p-5",
        interactive && "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        interactive && "hover:-translate-y-1 hover:shadow-2xl",
        isFocused && "ring-2 ring-ring shadow-3xl",
      )}
      role={interactive ? "button" : "region"}
      tabIndex={interactive ? 0 : undefined}
      onClick={() => onSelect?.(hero)}
      onKeyDown={handleKey}
      aria-pressed={isFocused}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-30 transition duration-300 group-hover:opacity-50",
          `bg-gradient-to-br ${palette.glow}`,
        )}
      />
      <div className="relative z-10 space-y-4 sm:space-y-5">
        <header className="flex items-start justify-between gap-3 sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">
              {getObtentionLabel(hero.constellation)} — {hero.constellation || "—"}
            </p>
            <h3 className="mt-1 text-lg font-bold text-foreground sm:text-xl">{hero.name}</h3>
          </div>
          <div className="flex flex-shrink-0 flex-col items-end gap-1 text-right">
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:px-3 sm:py-1 sm:text-xs",
                palette.badge,
              )}
            >
              {hero.color || "—"}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
              {hero.style}
            </span>
          </div>
        </header>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
            Passifs
          </p>
          {hero.passives.length === 0 ? (
            <p className="mt-2 rounded-xl border border-dashed border-border px-3 py-2 text-center text-[11px] text-muted-foreground sm:mt-3 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-xs">
              Pas de passifs renseignés pour l'instant.
            </p>
          ) : (
            <ul className="mt-2 space-y-2 text-xs text-foreground sm:mt-3 sm:text-sm">
              {hero.passives.map((passive, index) => (
                <li key={`${hero.id}-passive-${index}`} className="flex gap-2 sm:gap-3">
                  <span
                    className={cn(
                      "mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full sm:h-2 sm:w-2",
                      palette.dot,
                    )}
                  />
                  <span className="leading-relaxed">{passive}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}

function getObtentionLabel(value: string) {
  if (!value) {
    return "Constellation";
  }

  const normalized = value.toLowerCase();
  if (normalized.includes("march") || normalized.includes("coffre")) {
    return "Obtention";
  }

  return "Constellation";
}

