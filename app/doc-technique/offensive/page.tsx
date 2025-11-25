import { fetchOffensiveTechniques } from "@/lib/doc-offensive";
import OffensiveTechniqueDirectory from "@/components/offensive/offensive-technique-directory";

export const metadata = {
  title: "Doc offensive — Victory Road FR",
  description:
    "Toutes les techniques offensive classées par élément, OFF et source d'obtention.",
};

export default async function OffensiveDocPage() {
  const techniques = await fetchOffensiveTechniques();

  return (
    <div className="space-y-8 sm:space-y-10">
      <header className="space-y-3 sm:space-y-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
          Doc technique
        </p>
        <h1 className="text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
          Offensive — fiches OFF & sources
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          Liste consolidée des techniques offensive de la feuille communautaire. Filtre par
          élément, seuil OFF ou lieu d'obtention pour trouver la parade idéale en quelques
          secondes.
        </p>
      </header>

      <OffensiveTechniqueDirectory techniques={techniques} />
    </div>
  );
}

