"use client";

import { useEffect, useMemo, useState } from "react";

import type { HeroS1 } from "@/lib/heroes-s1";
import HeroCard from "./hero-card";
import { cn } from "@/lib/utils";

type HeroDirectoryProps = {
  heroes: HeroS1[];
};

export default function HeroDirectory({ heroes }: HeroDirectoryProps) {
  const [query, setQuery] = useState("");
  const [styleFilter, setStyleFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const styles = useMemo(
    () =>
      Array.from(new Set(heroes.map((hero) => hero.style).filter(Boolean))).sort(),
    [heroes],
  );

  const colors = useMemo(
    () =>
      Array.from(new Set(heroes.map((hero) => hero.color).filter(Boolean))).sort(),
    [heroes],
  );

  const filteredHeroes = useMemo(() => {
    const term = query.trim().toLowerCase();

    return heroes
      .filter((hero) => {
        const matchesQuery =
          !term ||
          hero.name.toLowerCase().includes(term) ||
          hero.passives.some((p) => p.toLowerCase().includes(term)) ||
          hero.style.toLowerCase().includes(term);

        const matchesStyle =
          styleFilter === "all" || hero.style.toLowerCase() === styleFilter;
        const matchesColor =
          colorFilter === "all" || hero.color.toLowerCase() === colorFilter;

        return matchesQuery && matchesStyle && matchesColor;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [heroes, query, styleFilter, colorFilter]);

  const visibleHeroes = filteredHeroes.slice(0, visibleCount);

  const totalPassives = useMemo(
    () => heroes.reduce((acc, hero) => acc + hero.passives.length, 0),
    [heroes],
  );

  const selectedHero = useMemo(
    () => heroes.find((hero) => hero.id === selectedHeroId),
    [heroes, selectedHeroId],
  );

  const closeOverlay = () => setSelectedHeroId(null);

  useEffect(() => {
    setVisibleCount(10);
  }, [query, styleFilter, colorFilter]);

  useEffect(() => {
    if (!selectedHero) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeOverlay();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedHero]);

  return (
    <>
      <section
        className={cn(
          "space-y-8 transition duration-300",
          selectedHero && "pointer-events-none opacity-30 blur-[1px]",
        )}
        aria-hidden={Boolean(selectedHero)}
      >
        <div className="grid gap-3 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-xl shadow-slate-200/50 sm:grid-cols-3 sm:gap-4 sm:p-6">
          <Stat label="Héros recensés" value={heroes.length.toString()} />
          <Stat label="Styles uniques" value={styles.length.toString()} />
          <Stat label="Passifs analysés" value={totalPassives.toString()} />
        </div>

        <div className="grid gap-4 rounded-3xl border border-slate-100 bg-white/90 p-4 shadow-lg shadow-slate-200/50 sm:p-5 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <label className="col-span-full flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 sm:col-span-2">
            Recherche
            <input
              type="text"
              placeholder="Nom, effet, style..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400"
            />
          </label>

          <FilterSelect
            label="Style"
            value={styleFilter}
            onChange={setStyleFilter}
            options={styles}
            className="w-full"
          />

          <FilterSelect
            label="Couleur"
            value={colorFilter}
            onChange={setColorFilter}
            options={colors}
            className="w-full"
          />
        </div>

        {filteredHeroes.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-10 text-center text-sm text-slate-500">
            Aucun résultat avec ces filtres. Essaie un autre style ou vide la recherche.
          </p>
        ) : (
          <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
            {visibleHeroes.map((hero) => (
              <HeroCard
                key={hero.id}
                hero={hero}
                onSelect={() => setSelectedHeroId(hero.id)}
              />
            ))}
          </div>
        )}

        {visibleCount < filteredHeroes.length && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + 10)}
              className="w-full rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
            >
              Voir plus ({filteredHeroes.length - visibleCount} restants)
            </button>
          </div>
        )}
      </section>

      {selectedHero && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 text-left sm:py-10"
          role="dialog"
          aria-modal="true"
          aria-label={`Focus sur ${selectedHero.name}`}
        >
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={closeOverlay}
            role="presentation"
            aria-label="Fermer le focus"
          />
          <div className="relative z-10 w-full max-w-3xl space-y-4 rounded-2xl border border-white/10 bg-white/95 p-4 shadow-2xl sm:rounded-3xl sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400 sm:text-sm">
                Focus héros
              </p>
              <button
                type="button"
                onClick={closeOverlay}
                className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-slate-100 sm:px-4 sm:text-xs"
              >
                Fermer
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto">
              <HeroCard hero={selectedHero} isFocused />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
}) {
  return (
    <label
      className={cn(
        "flex min-w-0 flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 sm:min-w-[180px]",
        className,
      )}
    >
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value.toLowerCase())}
        className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 transition focus:border-slate-400"
      >
        <option value="all">Tous</option>
        {options.map((option) => (
          <option key={option} value={option.toLowerCase()}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white/70 px-3 py-4 text-center shadow-sm sm:rounded-2xl sm:px-4 sm:py-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-400 sm:text-xs">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black text-slate-900 sm:mt-2 sm:text-3xl">{value}</p>
    </div>
  );
}

