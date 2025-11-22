"use client";

import { useEffect, useMemo, useState } from "react";

import type { Feve } from "@/lib/feves";
import FeveCard from "./feve-card";
import { cn } from "@/lib/utils";

type Props = {
  feves: Feve[];
};

export default function FeveDirectory({ feves }: Props) {
  const [query, setQuery] = useState("");
  const [colorFilter, setColorFilter] = useState("all");
  const [selectedFeveId, setSelectedFeveId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const colors = useMemo(() => {
    return Array.from(
      new Set(feves.map((feve) => feve.color).filter(Boolean)),
    ).sort();
  }, [feves]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return feves
      .filter((feve) => {
        const matchesQuery =
          !term ||
          feve.name.toLowerCase().includes(term) ||
          feve.obtention.toLowerCase().includes(term) ||
          feve.astuce.toLowerCase().includes(term);

        const matchesColor =
          colorFilter === "all" || feve.color.toLowerCase() === colorFilter;

        return matchesQuery && matchesColor;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [feves, query, colorFilter]);

  const visibleFeves = filtered.slice(0, visibleCount);

  const selectedFeve = useMemo(
    () => feves.find((feve) => feve.id === selectedFeveId),
    [feves, selectedFeveId],
  );

  const closeOverlay = () => setSelectedFeveId(null);

  useEffect(() => {
    setVisibleCount(12);
  }, [query, colorFilter]);

  useEffect(() => {
    if (!selectedFeve) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeOverlay();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedFeve]);

  return (
    <>
      <section
        className={cn(
          "space-y-8 transition duration-300",
          selectedFeve && "pointer-events-none opacity-30 blur-[1px]",
        )}
        aria-hidden={Boolean(selectedFeve)}
      >
        <div className="grid gap-4 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-xl shadow-slate-200/50 sm:grid-cols-2 sm:gap-6 sm:p-6">
          <Stat label="Fèves listées" value={feves.length.toString()} />
        </div>

        <div className="grid gap-4 rounded-3xl border border-slate-100 bg-white/90 p-4 shadow-lg shadow-slate-200/50 sm:grid-cols-2 sm:p-5 lg:grid-cols-[2fr_1fr]">
          <label className="col-span-full flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 sm:col-span-2">
            Recherche
            <input
              type="text"
              placeholder="Nom, obtention, astuce..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400"
            />
          </label>

          <FilterSelect
            label="Couleur"
            value={colorFilter}
            onChange={setColorFilter}
            options={colors}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-10 text-center text-sm text-slate-500">
            Aucun résultat avec ces filtres. Essaie une autre couleur ou vide la
            recherche.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {visibleFeves.map((feve) => (
              <FeveCard
                key={feve.id}
                feve={feve}
                onSelect={() => setSelectedFeveId(feve.id)}
              />
            ))}
          </div>
        )}

        {visibleCount < filtered.length && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + 8)}
              className="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Voir plus ({filtered.length - visibleCount} restants)
            </button>
          </div>
        )}
      </section>

      {selectedFeve && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 text-left sm:py-10"
          role="dialog"
          aria-modal="true"
          aria-label={`Focus sur ${selectedFeve.name}`}
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
                Focus fève
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
              <FeveCard feve={selectedFeve} isFocused />
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value.toLowerCase())}
        className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 transition focus:border-slate-400"
      >
        <option value="all">Toutes</option>
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
    <div className="rounded-2xl border border-slate-100 bg-white/70 px-4 py-5 text-center shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-400 sm:text-xs">
        {label}
      </p>
      <p className="mt-1 text-3xl font-black text-slate-900 sm:mt-2">{value}</p>
    </div>
  );
}

