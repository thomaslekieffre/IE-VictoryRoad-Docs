import DefensiveTechniqueDirectory from "@/components/defensive/defensive-technique-directory";
import { fetchDefensiveTechniques } from "@/lib/doc-defensive";

export const metadata = {
  title: "Doc défensive — Victory Road FR",
  description:
    "Toutes les techniques défensives classées par élément, DEF et source d'obtention.",
};

export default async function DefensiveDocPage() {
  const techniques = await fetchDefensiveTechniques();

  return (
    <div className="space-y-8 sm:space-y-10">
      <header className="space-y-3 sm:space-y-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
          Doc technique
        </p>
        <h1 className="text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
          Défensive — fiches DEF & sources
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          Liste consolidée des techniques défensives de la feuille communautaire. Filtre par
          élément, seuil DEF ou lieu d'obtention pour trouver la parade idéale en quelques
          secondes.
        </p>
      </header>

      <DefensiveTechniqueDirectory techniques={techniques} />
    </div>
  );
}

