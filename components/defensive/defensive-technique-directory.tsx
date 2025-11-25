"use client";

import { useEffect, useMemo, useState } from "react";

import type { DefensiveTechnique } from "@/lib/doc-defensive";
import DefensiveTechniqueCard from "./defensive-technique-card";
import { cn } from "@/lib/utils";

type Props = {
  techniques: DefensiveTechnique[];
};

export default function DefensiveTechniqueDirectory({ techniques }: Props) {
  const [query, setQuery] = useState("");
  const [elementFilter, setElementFilter] = useState("all");
  const [minDef, setMinDef] = useState(() => {
    const values = techniques.map((tech) => tech.def).filter(Boolean);
    return Math.min(...values, 0);
  });
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedTechniqueId, setSelectedTechniqueId] = useState<string | null>(null);

  const elements = useMemo(() => {
    return Array.from(
      new Set(
        techniques
          .map((tech) => tech.element)
          .filter(Boolean)
          .map((element) => element.trim()),
      ),
    ).sort();
  }, [techniques]);

  const maxDef = useMemo(() => {
    return techniques.reduce((max, tech) => Math.max(max, tech.def), 0);
  }, [techniques]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return techniques
      .filter((tech) => {
        const matchesQuery =
          !term ||
          tech.nameFr.toLowerCase().includes(term) ||
          tech.nameEn.toLowerCase().includes(term) ||
          tech.location.toLowerCase().includes(term);

        const matchesElement =
          elementFilter === "all" ||
          tech.element.toLowerCase() === elementFilter;

        const matchesDef = tech.def >= minDef;

        return matchesQuery && matchesElement && matchesDef;
      })
      .sort((a, b) => {
        if (b.def === a.def) {
          return a.nameFr.localeCompare(b.nameFr);
        }
        return b.def - a.def;
      });
  }, [techniques, query, elementFilter, minDef]);

  const visibleTechs = filtered.slice(0, visibleCount);

  const uniqueLocations = useMemo(() => {
    return Array.from(
      new Set(
        techniques
          .map((tech) => tech.location.split("(")[0].trim())
          .filter(Boolean),
      ),
    );
  }, [techniques]);

  const selectedTechnique = useMemo(
    () => techniques.find((tech) => tech.id === selectedTechniqueId),
    [techniques, selectedTechniqueId],
  );

  useEffect(() => {
    setVisibleCount(12);
  }, [query, elementFilter]);

  useEffect(() => {
    if (!selectedTechnique) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedTechniqueId(null);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedTechnique]);

  const closeOverlay = () => setSelectedTechniqueId(null);

  return (
    <>
      <section
        className={cn(
          "space-y-8 sm:space-y-10 transition duration-300",
          selectedTechnique && "pointer-events-none opacity-30 blur-[1px]",
        )}
        aria-hidden={Boolean(selectedTechnique)}
      >
        <div className="grid gap-4 rounded-3xl border border-border/60 bg-card/80 p-4 shadow-xl shadow-slate-200/50 sm:grid-cols-3 sm:gap-6 sm:p-6">
          <Stat label="Techniques listées" value={techniques.length.toString()} />
          <Stat label="Éléments couverts" value={elements.length.toString()} />
          <Stat label="Sources uniques" value={uniqueLocations.length.toString()} />
        </div>

        <div className="grid gap-4 rounded-3xl border border-border bg-card/90 p-4 shadow-lg shadow-slate-200/50 sm:grid-cols-2 sm:p-5 lg:grid-cols-[2fr_1fr]">
          <label className="col-span-full flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground sm:col-span-2">
            Recherche
            <input
              type="text"
              placeholder="Nom, élément, boutique..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 rounded-2xl border border-border px-4 text-sm font-medium text-foreground outline-none transition focus:border-ring"
            />
          </label>

          <FilterSelect
            label="Élément"
            value={elementFilter}
            onChange={setElementFilter}
            options={elements}
          />

          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Défense minimale ({minDef})
            <input
              type="range"
              min={0}
              max={maxDef}
              value={minDef}
              onChange={(event) => setMinDef(Number(event.target.value))}
              className="accent-foreground"
            />
          </label>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border bg-muted/50 p-10 text-center text-sm text-muted-foreground">
            Rien ne correspond à ces filtres. Essaie un autre élément ou baisse le seuil DEF.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {visibleTechs.map((technique) => (
              <DefensiveTechniqueCard
                key={technique.id}
                technique={technique}
                onSelect={() => setSelectedTechniqueId(technique.id)}
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

      {selectedTechnique && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4 py-6 text-left sm:py-10"
          role="dialog"
          aria-modal="true"
          aria-label={`Focus ${selectedTechnique.nameFr}`}
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
                Focus technique
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
              <DefensiveTechniqueCard technique={selectedTechnique} isFocused />
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
    <div className="rounded-2xl border border-border bg-muted/50 px-4 py-5 text-center shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
        {label}
      </p>
      <p className="mt-1 text-3xl font-black text-foreground sm:mt-2">{value}</p>
    </div>
  );
}

