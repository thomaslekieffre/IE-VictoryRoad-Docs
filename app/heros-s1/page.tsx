import HeroDirectory from "@/components/heroes/hero-directory";
import { fetchHeroesS1Data } from "@/lib/heroes-s1";

export const revalidate = 60 * 60; // 1h

export const metadata = {
  title: "Héros S1 — Victory Road FR",
  description:
    "Liste exhaustive des héros S1 avec leurs passifs, conditions de drop et styles.",
};

export default async function HeroesS1Page() {
  const heroes = await fetchHeroesS1Data();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 font-sans text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 md:px-10">
        <header className="mb-8 space-y-3 sm:mb-10 sm:space-y-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-400 sm:text-xs">
            Base de données
          </p>
          <h1 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl md:text-5xl">
            Héros S1 — passifs, conditions et styles
          </h1>
          <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
            Données synchronisées directement depuis la feuille communautaire. Utilise les
            filtres pour trouver rapidement quel héros combler dans ta compo ou comparer les
            passifs avant un farm intensif.
          </p>
        </header>

        <HeroDirectory heroes={heroes} />
      </div>
    </div>
  );
}

