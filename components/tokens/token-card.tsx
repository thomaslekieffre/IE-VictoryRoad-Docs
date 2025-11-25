import type { KeyboardEvent } from "react";

import type { Token } from "@/lib/tokens";
import { cn } from "@/lib/utils";

type ColorPalette = { badge: string; ring: string; gradient: string };

const colorTokens: Record<string, ColorPalette> = {
  bleu: {
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    ring: "ring-blue-100",
    gradient: "from-blue-500/15 to-transparent",
  },
  violet: {
    badge: "bg-purple-50 text-purple-700 border-purple-100",
    ring: "ring-purple-100",
    gradient: "from-purple-500/15 to-transparent",
  },
  vert: {
    badge: "bg-green-50 text-green-700 border-green-100",
    ring: "ring-green-100",
    gradient: "from-green-500/15 to-transparent",
  },
  rose: {
    badge: "bg-pink-50 text-pink-700 border-pink-100",
    ring: "ring-pink-100",
    gradient: "from-pink-500/15 to-transparent",
  },
  rouge: {
    badge: "bg-red-50 text-red-700 border-red-100",
    ring: "ring-red-100",
    gradient: "from-red-500/15 to-transparent",
  },
  jaune: {
    badge: "bg-yellow-50 text-yellow-700 border-yellow-100",
    ring: "ring-yellow-100",
    gradient: "from-yellow-500/15 to-transparent",
  },
  orange: {
    badge: "bg-orange-50 text-orange-700 border-orange-100",
    ring: "ring-orange-100",
    gradient: "from-orange-500/15 to-transparent",
  },
  normal: {
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    ring: "ring-slate-100",
    gradient: "from-slate-500/10 to-transparent",
  },
};

type TokenCardProps = {
  token: Token;
  onSelect?: () => void;
  isFocused?: boolean;
};

export default function TokenCard({
  token,
  onSelect,
  isFocused = false,
}: TokenCardProps) {
  const palette = pickPalette(token.color);
  const interactive = Boolean(onSelect);
  const imageSrc = token.imageUrl
    ? `/api/token-image?src=${encodeURIComponent(token.imageUrl)}`
    : null;

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
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
            Token
          </p>
          <h3 className="text-xl font-black text-slate-900">{token.name}</h3>
        </div>
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
            palette.badge,
          )}
        >
          {token.color}
        </span>
      </header>

      <div className="relative z-10 space-y-3">
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-600">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
            Emplacement
          </p>
          <p className="mt-1 leading-relaxed">{token.location}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
            PNJ
          </p>
          <p className="mt-1 leading-relaxed">{token.npc}</p>
        </div>

        {imageSrc && !isFocused && (
          <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400 mb-2">
              Photo
            </p>
            <img
              src={imageSrc}
              alt={`Emplacement pour ${token.name}`}
              className="w-full rounded-xl object-cover"
              loading="lazy"
            />
            <p className="mt-2 text-[10px] text-slate-500 italic">
              Petit curseur bleu = emplacement
            </p>
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

