import ContributorCard from "@/components/credits/contributor-card";
import {
  creators,
  contributors,
  enrichContributors,
} from "@/lib/credits";

export const metadata = {
  title: "Crédits — Victory Road FR",
  description: "Remerciements aux créateurs et contributeurs du site.",
};

export default async function CreditsPage() {
  // Enrichir les créateurs et contributeurs avec leurs avatars Discord
  const enrichedCreators = await enrichContributors(creators);
  const enrichedContributors = await enrichContributors(contributors);

  // Trier les contributeurs : VIP d'abord
  enrichedContributors.sort((a, b) => {
    if (a.isVip && !b.isVip) return -1;
    if (!a.isVip && b.isVip) return 1;
    return 0;
  });

  return (
    <div className="space-y-12 sm:space-y-16">
      <header className="space-y-3 sm:space-y-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
          À propos
        </p>
        <h1 className="text-3xl font-black leading-tight text-foreground sm:text-4xl md:text-5xl">
          Crédits
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          Merci à tous ceux qui ont contribué à la création et à l'enrichissement
          de ce site de ressources pour Inazuma Eleven Victory Road.
        </p>
      </header>

      <section className="space-y-6">
        <div>
          <h2 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">
            Créateurs du site
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {enrichedCreators.map((creator) => (
              <ContributorCard key={creator.name} contributor={creator} />
            ))}
          </div>
        </div>

        {enrichedContributors.length > 0 && (
          <div className="space-y-6 pt-8">
            <h2 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">
              Participants aux informations générales
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {enrichedContributors.map((contributor) => (
                <ContributorCard
                  key={contributor.name}
                  contributor={contributor}
                />
              ))}
            </div>
          </div>
        )}

        {enrichedContributors.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/50 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Les contributeurs seront ajoutés au fur et à mesure.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

