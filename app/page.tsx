import { BookOpenCheck, Sparkles, Swords, ArrowRight } from "lucide-react";
import Link from "next/link";

import Hero from "@/components/landing/hero";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      <Hero
        badge="Guides & Ressources"
        title={
          <>
            Inazuma Eleven <span className="text-amber-300">Victory Road</span> — tout
            pour optimiser ton équipe.
          </>
        }
        subtitle="Stats, passifs, routes de farm, compositions méta et fiches techniques détaillées. Passe de capitaine casual à stratège pro en quelques clics."
        imageSrc="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2799860/0b621f72bfb77600f74d4ce59474a215856b8a46/capsule_616x353.jpg?t=1763354428"
        primaryCta={{
          href: "/doc-technique/tirs",
          label: "Explorer les docs",
          icon: BookOpenCheck,
        }}
        secondaryCta={{
          href: "/astuce/feves",
          label: "Voir les astuces",
          icon: Sparkles,
        }}
      />

      <section className="space-y-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
            Ressources
          </p>
          <h2 className="mt-2 text-2xl font-black text-foreground sm:text-3xl">
            Guides & Documentation
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group relative flex flex-col gap-4 rounded-3xl border border-border bg-card/80 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl sm:p-8">
            <Link href="/astuce/feves" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Astuces</h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              Optimise les fèves, tokens et rerolls héros avec nos scénarios testés.
            </p>
            <Link
              href="/astuce/feves"
              className="mt-auto flex items-center gap-2 text-sm font-semibold text-foreground"
            >
              <span>Explorer</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link
                href="/astuce/feves"
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
              >
                Fèves
              </Link>
              <Link
                href="/astuce/farm-token"
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
              >
                Tokens
              </Link>
              <Link
                href="/heros-s1"
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
              >
                Héros S1
              </Link>
            </div>
          </div>

          <div className="group relative flex flex-col gap-4 rounded-3xl border border-border bg-card/80 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl sm:p-8">
            <Link href="/doc-technique/tirs" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                <BookOpenCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Docs techniques</h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              Fiches tir/défense/gardien avec frames clés, coûts et mappings élémentaires.
            </p>
            <Link
              href="/doc-technique/tirs"
              className="mt-auto flex items-center gap-2 text-sm font-semibold text-foreground"
            >
              <span>Explorer</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link
                href="/doc-technique/tirs"
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
              >
                Tirs
              </Link>
              <Link
                href="/doc-technique/offensive"
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
              >
                Attaque
              </Link>
              <Link
                href="/doc-technique/defensive"
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
              >
                Défense
              </Link>
              <Link
                href="/doc-technique/gardien"
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
              >
                Gardien
              </Link>
            </div>
          </div>

          <div className="group relative flex flex-col gap-4 rounded-3xl border border-border bg-card/80 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl sm:p-8">
            <Link href="/stats-joueurs" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                <Swords className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Joueurs</h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              Statistiques détaillées, recrutement des héros et guides d'évolution.
            </p>
            <Link
              href="/stats-joueurs"
              className="mt-auto flex items-center gap-2 text-sm font-semibold text-foreground"
            >
              <span>Explorer</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link
                href="/stats-joueurs"
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
              >
                Stats
              </Link>
              <Link
                href="/heros-s1"
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
              >
                Héros S1
              </Link>
              <span className="rounded-full bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground/50 cursor-not-allowed">
                Esprit guerrier
              </span>
              <span className="rounded-full bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground/50 cursor-not-allowed">
                Miximax
              </span>
              <span className="rounded-full bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground/50 cursor-not-allowed">
                Eveil
              </span>
              <span className="rounded-full bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground/50 cursor-not-allowed">
                Totem
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
