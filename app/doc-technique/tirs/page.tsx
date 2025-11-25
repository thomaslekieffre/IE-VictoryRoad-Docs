import { fetchTirsTechniques } from "@/lib/doc-tirs";
import TirsTechniqueDirectory from "@/components/tirs/tirs-technique-directory";

export const metadata = {
  title: "Doc tirs — Victory Road FR",
  description:
    "Toutes les techniques de tir classées par élément, DMG et source d'obtention.",
};

export default async function TirsDocPage() {
  const techniques = await fetchTirsTechniques();

  return (
    <div className="space-y-8 sm:space-y-10">
      <header className="space-y-3 sm:space-y-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
          Doc technique
        </p>
        <h1 className="text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
          Tirs — fiches DMG & sources
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          Liste consolidée des techniques de tir de la feuille communautaire. Filtre par
          élément, seuil DMG ou lieu d'obtention pour trouver la parade idéale en quelques
          secondes.
        </p>
      </header>

      <TirsTechniqueDirectory techniques={techniques} />
    </div>
  );
}

