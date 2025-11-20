"use client";

import { useEffect, useMemo, useState } from "react";

import type { KeeperTechnique } from "@/lib/doc-gardien";
import { cn } from "@/lib/utils";
import KeeperTechniqueCard from "./keeper-technique-card";

type Props = {
  techniques: KeeperTechnique[];
};

export default function KeeperTechniqueDirectory({ techniques }: Props) {
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
        <div className="grid gap-4 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-xl shadow-slate-200/50 sm:grid-cols-3 sm:gap-6 sm:p-6">
          <Stat label="Techniques listées" value={techniques.length.toString()} />
          <Stat label="Éléments couverts" value={elements.length.toString()} />
          <Stat label="Sources uniques" value={uniqueLocations.length.toString()} />
        </div>

        <div className="grid gap-4 rounded-3xl border border-slate-100 bg-white/90 p-4 shadow-lg shadow-slate-200/50 sm:grid-cols-2 sm:p-5 lg:grid-cols-[2fr_1fr]">
          <label className="col-span-full flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 sm:col-span-2">
            Recherche
            <input
              type="text"
              placeholder="Nom, élément, boutique..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400"
            />
          </label>

          <FilterSelect
            label="Élément"
            value={elementFilter}
            onChange={setElementFilter}
            options={elements}
          />

          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Défense minimale ({minDef})
            <input
              type="range"
              min={0}
              max={maxDef}
              value={minDef}
              onChange={(event) => setMinDef(Number(event.target.value))}
              className="accent-slate-800"
            />
          </label>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-10 text-center text-sm text-slate-500">
            Rien ne correspond à ces filtres. Essaie un autre élément ou baisse le seuil DEF.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {visibleTechs.map((technique) => (
              <KeeperTechniqueCard
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
              className="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Voir plus ({filtered.length - visibleCount} restants)
            </button>
          </div>
        )}
      </section>

      {selectedTechnique && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 text-left sm:py-10"
          role="dialog"
          aria-modal="true"
          aria-label={`Focus ${selectedTechnique.nameFr}`}
        >
          <div className="absolute inset-0 cursor-pointer" onClick={closeOverlay} />
          <div className="relative z-10 w-full max-w-3xl space-y-4 rounded-2xl border border-white/10 bg-white/95 p-4 shadow-2xl sm:rounded-3xl sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400 sm:text-sm">
                Focus technique
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
              <KeeperTechniqueCard technique={selectedTechnique} isFocused />
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
    <div className="rounded-2xl border border-slate-100 bg-white/70 px-4 py-5 text-center shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-400 sm:text-xs">
        {label}
      </p>
      <p className="mt-1 text-3xl font-black text-slate-900 sm:mt-2">{value}</p>
    </div>
  );
}

