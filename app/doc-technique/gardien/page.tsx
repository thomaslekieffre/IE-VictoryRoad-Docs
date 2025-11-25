import KeeperTechniqueDirectory from "@/components/keepers/keeper-technique-directory";
import { fetchKeeperTechniques } from "@/lib/doc-gardien";

export const metadata = {
  title: "Doc gardien — Victory Road FR",
  description:
    "Toutes les techniques gardien classées par élément, DEF et source d’obtention.",
};

export default async function GardienDocPage() {
  const techniques = await fetchKeeperTechniques();

  return (
    <div className="space-y-8 sm:space-y-10">
      <header className="space-y-3 sm:space-y-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
          Doc technique
        </p>
        <h1 className="text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
          Gardien — fiches DEF & sources
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          Liste consolidée des techniques gardien de la feuille communautaire. Filtre par élément,
          seuil DEF ou lieu d’obtention pour trouver la parade idéale en quelques secondes.
        </p>
      </header>

      <KeeperTechniqueDirectory techniques={techniques} />
    </div>
  );
}

