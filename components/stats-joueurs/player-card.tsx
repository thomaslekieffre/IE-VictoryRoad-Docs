import type { PlayerStat, StatThresholds } from "@/lib/stats-joueurs";
import { cn } from "@/lib/utils";

type PlayerCardProps = {
  player: PlayerStat;
  thresholds?: StatThresholds;
  onSelect?: (player: PlayerStat) => void;
  isFocused?: boolean;
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
  return translations[element] || element;
};

const translatePosition = (position: string) => {
  const translations: Record<string, string> = {
    GK: "Gardien",
    DF: "Défenseur",
    MF: "Milieu",
    FW: "Attaquant",
  };
  return translations[position] || position;
};

const translateStat = (stat: string) => {
  const translations: Record<string, string> = {
    kick: "Frappe",
    control: "Contrôle",
    guard: "Pression",
    body: "Physique",
    speed: "Agilité",
    stamina: "Intelligence",
    catch: "Technique",
  };
  return translations[stat.toLowerCase()] || stat;
};

const getStatColor = (stat: string, value: number, thresholds?: StatThresholds) => {
  // Default thresholds if none provided
  let currentThresholds = [80, 95, 110, 125];

  if (thresholds && thresholds[stat]) {
    currentThresholds = thresholds[stat];
  } else {
    // Fallback logic if thresholds are missing
    if (stat === "kick") {
      currentThresholds = [100, 120, 140, 160];
    } else if (stat === "catch") {
      currentThresholds = [120, 150, 180, 210];
    }
  }

  if (value < currentThresholds[0]) return "text-green-500 dark:text-green-400";
  if (value < currentThresholds[1]) return "text-blue-500 dark:text-blue-400";
  if (value < currentThresholds[2]) return "text-purple-500 dark:text-purple-400";
  if (value < currentThresholds[3]) return "text-yellow-500 dark:text-yellow-400";
  return "text-orange-500 dark:text-orange-400";
};

export default function PlayerCard({ player, thresholds, onSelect, isFocused = false }: PlayerCardProps) {
  const interactive = Boolean(onSelect);

  return (
    <div 
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all",
        interactive && "cursor-pointer hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10",
        isFocused && "shadow-xl shadow-primary/10 ring-2 ring-primary"
      )}
      onClick={() => interactive && onSelect?.(player)}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(e) => {
        if (interactive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect?.(player);
        }
      }}
    >
      <div className={cn("relative w-full overflow-hidden bg-muted", isFocused ? "aspect-video" : "aspect-[3/4]")}>
        {/* Placeholder for image - in a real app, use next/image */}
        {player.image ? (
          <img
            src={player.image}
            alt={player.name}
            className={cn(
              "h-full w-full object-cover transition-transform duration-500",
              interactive && "group-hover:scale-105"
            )}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            Pas d'image
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
          <h3 className="text-lg font-bold text-white">{player.name}</h3>
          <div className="flex items-center gap-2 text-xs text-white/80">
            <span className="rounded bg-white/20 px-1.5 py-0.5 backdrop-blur-sm">
              {translatePosition(player.position)}
            </span>
            <span className="rounded bg-white/20 px-1.5 py-0.5 backdrop-blur-sm">
              {translateElement(player.element)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        {player.stats && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {Object.entries(player.stats).map(([stat, value]) => (
              <div key={stat} className="flex justify-between border-b border-border/50 pb-1">
                <span className="capitalize text-muted-foreground">{translateStat(stat)}</span>
                <span className={cn("font-bold", getStatColor(stat, value, thresholds))}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
