"use client";

import { useEffect, useMemo, useState } from "react";
import TirsTechniqueCard from "./tirs-technique-card";
import { cn } from "@/lib/utils";
import type { TirsTechnique } from "../../lib/doc-tirs";

type Props = {
  techniques: TirsTechnique[];
};

function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function TirsTechniqueDirectory({ techniques }: Props) {
  const [query, setQuery] = useState("");
  const [elementFilter, setElementFilter] = useState("all");
  const [shotTypeFilter, setShotTypeFilter] = useState("all");
  const [minOff, setMinOff] = useState(() => {
    const values = techniques.map((tech) => tech.off).filter(Boolean);
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

  const shotTypes = useMemo(() => {
    return Array.from(
      new Set(
        techniques
          .map((t) => t.shotType)
          .filter((t) => t && t !== "—")
          .map((t) => t.trim()),
      ),
    ).sort();
  }, [techniques]);

  const maxOff = useMemo(() => {
    return techniques.reduce((max, tech) => Math.max(max, tech.off), 0);
  }, [techniques]);

  const filtered = useMemo(() => {
    const term = normalizeSearch(query);

    return techniques
      .filter((tech) => {
        const haystack = [
          tech.nameFr,
          tech.nameEn,
          tech.nameJp,
          tech.element,
          tech.location,
          tech.shotType,
        ]
          .filter(Boolean)
          .join(" ");

        const matchesQuery =
          !term || normalizeSearch(haystack).includes(term);

        const matchesElement =
          elementFilter === "all" ||
          tech.element.toLowerCase() === elementFilter;

        const normalizedShotType = normalizeSearch(tech.shotType || "");
        const matchesShotType =
          shotTypeFilter === "all" ||
          normalizedShotType.startsWith(shotTypeFilter);

        const matchesOff = tech.off >= minOff;

        return matchesQuery && matchesElement && matchesShotType && matchesOff;
      })
      .sort((a, b) => {
        if (b.off === a.off) {
          return a.nameFr.localeCompare(b.nameFr);
        }
        return b.off - a.off;
      });
  }, [techniques, query, elementFilter, shotTypeFilter, minOff]);

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
  }, [query, elementFilter, shotTypeFilter]);

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
        <div className="grid gap-4 rounded-3xl border border-border/60 bg-card/80 p-4 shadow-xl sm:grid-cols-3 sm:gap-6 sm:p-6">
          <Stat label="Techniques listées" value={techniques.length.toString()} />
          <Stat label="Éléments couverts" value={elements.length.toString()} />
          <Stat label="Sources uniques" value={uniqueLocations.length.toString()} />
        </div>

        <div className="grid gap-4 rounded-3xl border border-border bg-card/90 p-4 shadow-lg sm:grid-cols-2 sm:p-5 lg:grid-cols-[2fr_1fr]">
          <label className="col-span-full flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground sm:col-span-2">
            Recherche
            <input
              type="text"
              placeholder="Nom, élément, tir long/contre, boutique..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 rounded-2xl border border-border bg-card px-4 text-sm font-medium text-foreground outline-none transition focus:border-ring"
            />
          </label>

          <FilterSelect
            label="Élément"
            value={elementFilter}
            onChange={setElementFilter}
            options={elements}
          />

          <FilterSelect
            label="Type de tir"
            value={shotTypeFilter}
            onChange={setShotTypeFilter}
            options={shotTypes}
          />

          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Attaque minimale ({minOff})
            <input
              type="range"
              min={0}
              max={maxOff}
              value={minOff}
              onChange={(event) => setMinOff(Number(event.target.value))}
              className="accent-slate-800"
            />
          </label>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border bg-muted/50 p-10 text-center text-sm text-muted-foreground">
            Rien ne correspond à ces filtres. Essaie un autre élément, un autre type de tir ou baisse le seuil ATTAQUE.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {visibleTechs.map((technique) => (
              <TirsTechniqueCard
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
              <TirsTechniqueCard technique={selectedTechnique} isFocused />
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
