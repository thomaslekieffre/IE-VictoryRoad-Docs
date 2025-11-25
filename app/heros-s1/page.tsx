import HeroDirectory from "@/components/heroes/hero-directory";
import { fetchHeroesS1Data } from "@/lib/heroes-s1";

export const metadata = {
  title: "Héros S1 — Victory Road FR",
  description:
    "Liste exhaustive des héros S1 avec leurs passifs, conditions de drop et styles.",
};

export default async function HeroesS1Page() {
  const heroes = await fetchHeroesS1Data();

  return (
    <div className="space-y-8 sm:space-y-10">
      <header className="space-y-3 sm:space-y-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
          Base de données
        </p>
        <h1 className="text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
          Héros S1 — passifs, conditions et styles
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          Données synchronisées directement depuis la feuille communautaire. Utilise les filtres
          pour trouver rapidement quel héros combler dans ta compo ou comparer les passifs avant
          un farm intensif.
        </p>
      </header>

      <HeroDirectory heroes={heroes} />
    </div>
  );
}

