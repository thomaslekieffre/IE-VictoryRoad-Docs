import FeveDirectory from "@/components/feves/feve-directory";
import { fetchFeves } from "@/lib/feves";

export const metadata = {
  title: "Fèves — Victory Road FR",
  description:
    "Guide complet des fèves avec obtention, astuces et stratégies de farm.",
};

export default async function FevesPage() {
  const feves = await fetchFeves();

  return (
    <div className="space-y-8 sm:space-y-10">
      <header className="space-y-3 sm:space-y-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-400 sm:text-xs">
          Astuce
        </p>
        <h1 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl md:text-5xl">
          Fèves — obtention & astuces
        </h1>
        <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
          Liste consolidée des fèves avec leurs lieux d'obtention et astuces de farm
          optimisées. Filtre par couleur ou recherche par nom pour trouver rapidement la
          fève qui t'intéresse.
        </p>
      </header>

      <FeveDirectory feves={feves} />
    </div>
  );
}

