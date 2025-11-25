import TokenDirectory from "@/components/tokens/token-directory";
import { fetchTokens } from "@/lib/tokens";

export const metadata = {
  title: "Farm Token — Victory Road FR",
  description:
    "Guide complet des tokens avec emplacements, PNJ et stratégies de farm optimisées.",
};

export default async function FarmTokenPage() {
  const tokens = await fetchTokens();

  return (
    <div className="space-y-8 sm:space-y-10">
      <header className="space-y-3 sm:space-y-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
          Astuce
        </p>
        <h1 className="text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
          Farm Token — routes rapides
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          Liste consolidée des tokens avec leurs emplacements et PNJ. Filtre par
          emplacement ou recherche par nom pour trouver rapidement le token qui
          t'intéresse.
        </p>
      </header>

      <TokenDirectory tokens={tokens} />
    </div>
  );
}

