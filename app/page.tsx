import { Map, Shield } from "lucide-react";

import HighlightCard from "@/components/landing/highlight-card";
import Hero from "@/components/landing/hero";
import Navbar from "@/components/landing/navbar";
import { highlightCards } from "@/lib/highlights";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 font-sans text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-16 pt-8 md:px-10">
        <Navbar />

        <main className="mt-10 flex flex-1 flex-col gap-10">
          <Hero
            badge="Guides & Ressources"
            title={
              <>
                Inazuma Eleven <span className="text-amber-300">Victory Road</span>{" "}
                — tout pour optimiser ton équipe.
              </>
            }
            subtitle="Stats, passifs, routes de farm, compositions méta et fiches techniques détaillées. Passe de capitaine casual à stratège pro en quelques clics."
            imageSrc="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2799860/0b621f72bfb77600f74d4ce59474a215856b8a46/capsule_616x353.jpg?t=1763354428"
            primaryCta={{
              href: "#docs",
              label: "Explorer les docs",
              icon: Map,
            }}
            secondaryCta={{
              href: "#passifs",
              label: "Voir les passifs",
              icon: Shield,
            }}
          />

          <section className="grid gap-6 md:grid-cols-3">
            {highlightCards.map((card) => (
              <HighlightCard key={card.title} {...card} />
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
