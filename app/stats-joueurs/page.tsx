import { Suspense } from "react";
import PlayerDirectory from "@/components/stats-joueurs/player-directory";
import { fetchPlayerStats, calculateStatThresholds } from "@/lib/stats-joueurs";

export const metadata = {
  title: "Stats Joueurs — Victory Road FR",
  description:
    "Statistiques détaillées des joueurs.",
};

export default async function PlayerStatsPage() {
  const players = await fetchPlayerStats();
  const thresholds = calculateStatThresholds(players);

  return (
    <div className="space-y-8 sm:space-y-10">
      <header className="space-y-3 sm:space-y-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
          Base de données
        </p>
        <h1 className="text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
          Statistiques des Joueurs
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          Retrouvez ici les statistiques détaillées de tous les joueurs <strong>(Rareté Verte, Niveau 50, sans équipement)</strong>.
          <br />
          Niveau des statistiques de base : <span className="text-green-500">Vert</span> (100-70%) → <span className="text-blue-500">Bleu</span> (69-50%) → <span className="text-purple-500">Violet</span> (49-30%) → <span className="text-yellow-500">Jaune</span> (29-15%) → <span className="text-orange-500">Orange</span> (Top 14%).
        </p>
      </header>

      <Suspense fallback={<div>Chargement des filtres…</div>}>
        <PlayerDirectory players={players} thresholds={thresholds} />
      </Suspense>
    </div>
  );
}
