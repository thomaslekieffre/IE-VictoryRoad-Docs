import type { KeyboardEvent } from "react";

import type { DefensiveTechnique } from "@/lib/doc-defensive";
import { cn } from "@/lib/utils";

type ElementPalette = { badge: string; ring: string; gradient: string };

const elementTokens: Record<string, ElementPalette> = {
  feu: {
    badge: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30",
    ring: "ring-rose-500/20 dark:ring-rose-500/30",
    gradient: "from-rose-500/15 to-transparent dark:from-rose-500/20",
  },
  vent: {
    badge: "bg-sky-500/10 text-sky-700 border-sky-500/20 dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30",
    ring: "ring-sky-500/20 dark:ring-sky-500/30",
    gradient: "from-sky-500/20 to-transparent dark:from-sky-500/25",
  },
  foudre: {
    badge: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30",
    ring: "ring-amber-500/20 dark:ring-amber-500/30",
    gradient: "from-amber-500/15 to-transparent dark:from-amber-500/20",
  },
  terre: {
    badge: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30",
    ring: "ring-yellow-500/20 dark:ring-yellow-500/30",
    gradient: "from-yellow-500/15 to-transparent dark:from-yellow-500/20",
  },
  montagne: {
    badge: "bg-amber-500/15 text-amber-800 border-amber-500/25 dark:bg-amber-500/25 dark:text-amber-300 dark:border-amber-500/35",
    ring: "ring-amber-500/25 dark:ring-amber-500/35",
    gradient: "from-amber-700/20 to-transparent dark:from-amber-700/25",
  },
  montage: {
    badge: "bg-amber-500/15 text-amber-800 border-amber-500/25 dark:bg-amber-500/25 dark:text-amber-300 dark:border-amber-500/35",
    ring: "ring-amber-500/25 dark:ring-amber-500/35",
    gradient: "from-amber-700/20 to-transparent dark:from-amber-700/25",
  },
  foret: {
    badge: "bg-emerald-500/15 text-emerald-800 border-emerald-500/25 dark:bg-emerald-500/25 dark:text-emerald-300 dark:border-emerald-500/35",
    ring: "ring-emerald-500/25 dark:ring-emerald-500/35",
    gradient: "from-emerald-700/20 to-transparent dark:from-emerald-700/25",
  },
  normal: {
    badge: "bg-muted text-muted-foreground border-border",
    ring: "ring-border",
    gradient: "from-muted/50 to-transparent",
  },
};

const locationTags = [
  { keyword: "boutique", label: "Boutique" },
  { keyword: "chronicle", label: "Chronicle" },
  { keyword: "marché", label: "Marché" },
  { keyword: "vs", label: "VS" },
  { keyword: "histoire", label: "Story" },
];

type DefensiveTechniqueCardProps = {
  technique: DefensiveTechnique;
  onSelect?: () => void;
  isFocused?: boolean;
};

export default function DefensiveTechniqueCard({
  technique,
  onSelect,
  isFocused = false,
}: DefensiveTechniqueCardProps) {
  const palette = pickPalette(technique.element);
  const interactive = Boolean(onSelect);

  const handleKey = (event: KeyboardEvent<HTMLElement>) => {
    if (!interactive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.();
    }
  };

  const tags = locationTags.filter((tag) =>
    technique.location.toLowerCase().includes(tag.keyword),
  );

  const hasShotBlock = technique.shotBlock !== "—" && technique.shotBlock.toLowerCase().includes("oui");

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
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            Technique défensive
          </p>
          <h3 className="text-xl font-black text-foreground">{technique.nameFr}</h3>
          <p className="text-xs text-muted-foreground">
            {technique.nameEn}
            {technique.nameJp && (
              <span className="text-muted-foreground/70"> • {technique.nameJp}</span>
            )}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={cn(
              "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
              palette.badge,
            )}
          >
            {technique.element}
          </span>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground">
            DEF
          </p>
          <p className="text-3xl font-black text-foreground">{technique.def}</p>
        </div>
      </header>

      <div className="relative z-10 space-y-3">
        {hasShotBlock && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400">
            ✓ Blocage de tir
          </div>
        )}

        <div className="rounded-2xl border border-dashed border-border bg-muted/50 px-4 py-3 text-sm text-foreground">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            Emplacement
          </p>
          <p className="mt-1 leading-relaxed">{technique.location}</p>

          {technique.price !== "—" && (
            <p className="mt-2 text-xs text-muted-foreground">
              Prix indicatif : <span className="font-semibold">{technique.price}</span>
            </p>
          )}

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={`${technique.id}-${tag.keyword}`}
                  className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground"
                >
                  {tag.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function pickPalette(element: string): ElementPalette {
  const key = normalize(element);
  if (elementTokens[key]) {
    return elementTokens[key];
  }

  if (key.includes("foret")) {
    return elementTokens.foret;
  }

  if (key.includes("mont")) {
    return elementTokens.montagne;
  }

  return elementTokens.normal;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

