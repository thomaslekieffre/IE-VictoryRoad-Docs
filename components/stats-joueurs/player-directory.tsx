"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { PlayerStat, StatThresholds } from "@/lib/stats-joueurs";
import PlayerCard from "./player-card";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";


type PlayerDirectoryProps = {
  players: PlayerStat[];
  thresholds: StatThresholds;
};

const translateElement = (element: string) => {
  const translations: Record<string, string> = {
    Fire: "Feu",
    Mountain: "Terre",
    Wind: "Air",
    Wood: "Forêt",
    Forest: "Forêt",
    Void: "Néant",
  };
  return translations[element] ? `${translations[element]} (${element})` : element;
};

const translatePosition = (position: string) => {
  const translations: Record<string, string> = {
    GK: "Gardien",
    DF: "Défenseur",
    MF: "Milieu",
    FW: "Attaquant",
  };
  return translations[position] ? `${translations[position]} (${position})` : position;
};

export default function PlayerDirectory({ players, thresholds }: PlayerDirectoryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [positionFilter, setPositionFilter] = useState(searchParams.get("pos") || "all");
  const [elementFilter, setElementFilter] = useState(searchParams.get("el") || "all");
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "default");
  const [visibleCount, setVisibleCount] = useState(80);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [minStats, setMinStats] = useState({
    kick: Number(searchParams.get("min_kick")) || 0,
    body: Number(searchParams.get("min_body")) || 0,
    control: Number(searchParams.get("min_control")) || 0,
    guard: Number(searchParams.get("min_guard")) || 0,
    speed: Number(searchParams.get("min_speed")) || 0,
    stamina: Number(searchParams.get("min_stamina")) || 0,
    catch: Number(searchParams.get("min_catch")) || 0,
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (positionFilter !== "all") params.set("pos", positionFilter);
    if (elementFilter !== "all") params.set("el", elementFilter);
    if (sortOption !== "default") params.set("sort", sortOption);
    
    Object.entries(minStats).forEach(([key, value]) => {
      if (value > 0) params.set(`min_${key}`, value.toString());
    });

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [query, positionFilter, elementFilter, sortOption, minStats, pathname, router]);

  const positions = useMemo(
    () => Array.from(new Set(players.map((p) => p.position).filter(Boolean))).sort(),
    [players]
  );

  const elements = useMemo(
    () => Array.from(new Set(players.map((p) => p.element).filter(Boolean))).sort(),
    [players]
  );

  const filteredPlayers = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = players.filter((player) => {
      const matchesQuery = !term || player.name.toLowerCase().includes(term);
      const matchesPosition = positionFilter === "all" || player.position === positionFilter;
      const matchesElement = elementFilter === "all" || player.element === elementFilter;
      
      const matchesStats = Object.entries(minStats).every(([key, minVal]) => {
        if (minVal === 0) return true;
        // @ts-ignore - dynamic access to stats
        const statVal = player.stats?.[key] || 0;
        return statVal >= minVal;
      });

      return matchesQuery && matchesPosition && matchesElement && matchesStats;
    });

    return filtered.sort((a, b) => {
      if (sortOption === "default") {
        return 0; // Keep original order
      }
      
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      }
      
      // For stats
      // @ts-ignore - dynamic access to stats
      const statA = a.stats?.[sortOption] || 0;
      // @ts-ignore - dynamic access to stats
      const statB = b.stats?.[sortOption] || 0;
      
      return statB - statA; // Descending
    });
  }, [players, query, positionFilter, elementFilter, sortOption]);

  useEffect(() => {
    setVisibleCount(80);
  }, [query, positionFilter, elementFilter, sortOption, minStats]);

  const visiblePlayers = filteredPlayers.slice(0, visibleCount);

  const selectedPlayer = useMemo(
    () => players.find((p) => p.id === selectedPlayerId),
    [players, selectedPlayerId]
  );

  const closeOverlay = () => setSelectedPlayerId(null);

  useEffect(() => {
    if (!selectedPlayer) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeOverlay();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedPlayer]);

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

  return (
    <>
      <section
        className={cn(
          "space-y-6 transition duration-300",
          selectedPlayer && "pointer-events-none opacity-30 blur-[1px]"
        )}
        aria-hidden={Boolean(selectedPlayer)}
      >
        <div className="flex justify-center rounded-3xl border border-border/60 bg-card/80 p-4 shadow-xl shadow-slate-200/50">
          <Stat label="Joueurs listés" value={players.length.toString()} />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4">


          <div className="grid gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un joueur..."
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm outline-none focus:ring-1 focus:ring-ring"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <select
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
          >
            <option value="all">Toutes les positions</option>
            {positions.map((pos) => (
              <option key={pos} value={pos}>
                {translatePosition(pos)}
              </option>
            ))}
          </select>

          <select
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
            value={elementFilter}
            onChange={(e) => setElementFilter(e.target.value)}
          >
            <option value="all">Tous les éléments</option>
            {elements.map((el) => (
              <option key={el} value={el}>
                {translateElement(el)}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <select
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">Trier par...</option>
              <option value="name">Nom (A-Z)</option>
              <option value="kick">Frappe</option>
              <option value="control">Contrôle</option>
              <option value="guard">Pression</option>
              <option value="body">Physique</option>
              <option value="speed">Agilité</option>
              <option value="stamina">Intelligence</option>
              <option value="catch">Technique</option>
            </select>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-input transition-colors hover:bg-accent hover:text-accent-foreground",
                showFilters ? "bg-accent text-accent-foreground" : "bg-background"
              )}
              title="Filtres avancés"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid gap-4 rounded-xl border border-border bg-card p-4 shadow-sm animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Stats minimum</h3>
                <button 
                  onClick={() => setMinStats({
                    kick: 0, body: 0, control: 0, guard: 0, speed: 0, stamina: 0, catch: 0
                  })}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Réinitialiser
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                {[
                  { key: "kick", label: "Frappe" },
                  { key: "control", label: "Contrôle" },
                  { key: "guard", label: "Pression" },
                  { key: "body", label: "Physique" },
                  { key: "speed", label: "Agilité" },
                  { key: "stamina", label: "Intelligence" },
                  { key: "catch", label: "Technique" },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">{label}</label>
                    <input
                      type="number"
                      min="0"
                      max="999"
                      className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                      // @ts-ignore
                      value={minStats[key] || ""}
                      onChange={(e) => setMinStats(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {visiblePlayers.map((player) => (
            <PlayerCard 
              key={player.id} 
              player={player} 
              thresholds={thresholds}
              onSelect={() => setSelectedPlayerId(player.id)}
            />
          ))}
        </div>

        {visiblePlayers.length < filteredPlayers.length && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setVisibleCount((prev) => prev + 80)}
              className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Afficher plus de joueurs
            </button>
          </div>
        )}

        {filteredPlayers.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            Aucun joueur trouvé.
          </div>
        )}
      </section>

      {selectedPlayer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4 py-6 text-left sm:py-10"
          role="dialog"
          aria-modal="true"
          aria-label={`Focus sur ${selectedPlayer.name}`}
        >
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={closeOverlay}
            role="presentation"
            aria-label="Fermer le focus"
          />
          <div className="relative z-10 w-full max-w-md space-y-4 rounded-2xl border border-border bg-card p-4 shadow-2xl sm:rounded-3xl sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-sm">
                Focus Joueur
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
              <PlayerCard player={selectedPlayer} thresholds={thresholds} isFocused />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
