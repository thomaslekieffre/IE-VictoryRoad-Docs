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
    badge: "bg-pink-50 text-pink-600 border-pink-100",
    dot: "bg-pink-400",
    glow: "from-pink-500/20 to-transparent",
  },
  rouge: {
    badge: "bg-red-50 text-red-600 border-red-100",
    dot: "bg-red-400",
    glow: "from-red-500/20 to-transparent",
  },
  gris: {
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
    glow: "from-slate-500/15 to-transparent",
  },
  bleu: {
    badge: "bg-sky-50 text-sky-600 border-sky-100",
    dot: "bg-sky-400",
    glow: "from-sky-500/20 to-transparent",
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
        "group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-lg shadow-slate-200/60 transition-all sm:gap-4 sm:rounded-3xl sm:p-5",
        interactive && "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
        interactive && "hover:-translate-y-1 hover:shadow-2xl",
        isFocused && "ring-2 ring-slate-500 shadow-3xl",
      )}
      role={interactive ? "button" : "region"}
      tabIndex={interactive ? 0 : undefined}
      onClick={() => onSelect?.(hero)}
      onKeyDown={handleKey}
      aria-pressed={isFocused}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100",
          `bg-gradient-to-br ${palette.glow}`,
        )}
      />
      <div className="relative z-10 space-y-4 sm:space-y-5">
        <header className="flex items-start justify-between gap-3 sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 sm:text-xs">
              {getObtentionLabel(hero.constellation)} — {hero.constellation || "—"}
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">{hero.name}</h3>
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
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-400 sm:text-xs">
              {hero.style}
            </span>
          </div>
        </header>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-400 sm:text-xs">
            Passifs
          </p>
          {hero.passives.length === 0 ? (
            <p className="mt-2 rounded-xl border border-dashed border-slate-200 px-3 py-2 text-center text-[11px] text-slate-400 sm:mt-3 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-xs">
              Pas de passifs renseignés pour l'instant.
            </p>
          ) : (
            <ul className="mt-2 space-y-2 text-xs text-slate-600 sm:mt-3 sm:text-sm">
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

