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
        <div className="flex justify-center rounded-3xl border border-border/60 bg-card/80 p-4 shadow-xl shadow-slate-200/50 dark:shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
          <Stat label="Fèves listées" value={feves.length.toString()} />
        </div>

        <div className="grid gap-4 rounded-3xl border border-border bg-card/90 p-4 shadow-lg shadow-slate-200/50 dark:shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:grid-cols-2 sm:p-5 lg:grid-cols-[2fr_1fr]">
          <label className="col-span-full flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground sm:col-span-2">
            Recherche
            <input
              type="text"
              placeholder="Nom, obtention, astuce..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 rounded-2xl border border-border bg-card px-4 text-sm font-medium text-foreground outline-none transition focus:border-ring"
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
          <p className="rounded-3xl border border-dashed border-border bg-muted/50 p-10 text-center text-sm text-muted-foreground">
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
              className="rounded-full border border-border bg-card px-6 py-2 text-sm font-semibold text-foreground transition hover:border-ring hover:bg-accent"
            >
              Voir plus ({filtered.length - visibleCount} restants)
            </button>
          </div>
        )}
      </section>

      {selectedFeve && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4 py-6 text-left sm:py-10"
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
          <div className="relative z-10 w-full max-w-3xl space-y-4 rounded-2xl border border-border bg-card p-4 shadow-2xl sm:rounded-3xl sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-sm">
                Focus fève
              </p>
              <button
                type="button"
                onClick={closeOverlay}
                className="rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground transition hover:bg-accent sm:px-4 sm:text-xs"
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
    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value.toLowerCase())}
        className="h-11 rounded-2xl border border-border bg-card px-3 text-sm font-medium text-foreground transition focus:border-ring"
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
    <div className="rounded-2xl border border-border bg-muted/50 px-4 py-5 text-center shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
        {label}
      </p>
      <p className="mt-1 text-3xl font-black text-foreground sm:mt-2">{value}</p>
    </div>
  );
}

