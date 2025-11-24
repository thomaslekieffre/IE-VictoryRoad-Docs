import type { KeyboardEvent } from "react";

import type { KeeperTechnique } from "@/lib/doc-gardien";
import { cn } from "@/lib/utils";

type ElementPalette = { badge: string; ring: string; gradient: string };

const elementTokens: Record<string, ElementPalette> = {
  feu: {
    badge: "bg-rose-50 text-rose-600 border-rose-100",
    ring: "ring-rose-100",
    gradient: "from-rose-500/15 to-transparent",
  },
  vent: {
    badge: "bg-sky-50 text-sky-700 border-sky-100",
    ring: "ring-sky-100",
    gradient: "from-sky-500/20 to-transparent",
  },
  foudre: {
    badge: "bg-amber-50 text-amber-600 border-amber-100",
    ring: "ring-amber-100",
    gradient: "from-amber-500/15 to-transparent",
  },
  terre: {
    badge: "bg-yellow-50 text-yellow-700 border-yellow-100",
    ring: "ring-yellow-100",
    gradient: "from-yellow-500/15 to-transparent",
  },
  montagne: {
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    ring: "ring-amber-200",
    gradient: "from-amber-700/20 to-transparent",
  },
  montage: {
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    ring: "ring-amber-200",
    gradient: "from-amber-700/20 to-transparent",
  },
  foret: {
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    ring: "ring-emerald-200",
    gradient: "from-emerald-700/20 to-transparent",
  },
  normal: {
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    ring: "ring-slate-100",
    gradient: "from-slate-500/10 to-transparent",
  },
};

const locationTags = [
  { keyword: "boutique", label: "Boutique" },
  { keyword: "chronicle", label: "Chronicle" },
  { keyword: "marché", label: "Marché" },
  { keyword: "vs", label: "VS" },
  { keyword: "histoire", label: "Story" },
];

type KeeperTechniqueCardProps = {
  technique: KeeperTechnique;
  onSelect?: () => void;
  isFocused?: boolean;
};

export default function KeeperTechniqueCard({
  technique,
  onSelect,
  isFocused = false,
}: KeeperTechniqueCardProps) {
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

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white/90 p-4 shadow-lg shadow-slate-200/60 transition sm:p-5",
        !isFocused && "hover:-translate-y-0.5 hover:shadow-2xl",
        palette.ring,
        isFocused && "ring-2 ring-slate-400 shadow-2xl",
        interactive &&
          "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
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
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
            Technique gardien
          </p>
          <h3 className="text-xl font-black text-slate-900">{technique.nameFr}</h3>
          <p className="text-xs text-slate-500">
            {technique.nameEn}
            {technique.nameJp && (
              <span className="text-slate-400"> • {technique.nameJp}</span>
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
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-400">
            DEF
          </p>
          <p className="text-3xl font-black text-slate-900">{technique.def}</p>
        </div>
      </header>

      <div className="relative z-10 rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-600">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
          Emplacement
        </p>
        <p className="mt-1 leading-relaxed">{technique.location}</p>

        {technique.price !== "—" && (
          <p className="mt-2 text-xs text-slate-500">
            Prix indicatif : <span className="font-semibold">{technique.price}</span>
          </p>
        )}

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={`${technique.id}-${tag.keyword}`}
                className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500"
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
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

