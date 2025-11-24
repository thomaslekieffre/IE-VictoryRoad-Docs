import type { ComponentType, SVGProps } from "react";
import { BookOpenCheck, HomeIcon, Info, Sparkles, Swords } from "lucide-react";

export type DropdownItem = {
  label: string;
  description: string;
  href?: string;
};

export type NavItem = {
  label: string;
  href?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  dropdown?: DropdownItem[];
};

export const navItems: NavItem[] = [
  { label: "Accueil", icon: HomeIcon, href: "/" },
  {
    label: "Passif",
    icon: Swords,
    dropdown: [
      { label: "Bientôt #1", description: "Passifs listés très bientôt" },
      { label: "Bientôt #2", description: "Reste à l’écoute" },
      { label: "Bientôt #3", description: "Encore un peu de patience" },
    ],
  },
  {
    label: "Astuce",
    icon: Sparkles,
    dropdown: [
      {
        label: "Fèves",
        description: "Optimiser les récoltes quotidiennes",
        href: "/astuce/feves",
      },
      {
        label: "Farm Token",
        description: "Routes rapides pour max tokens",
        href: "/astuce/farm-token",
      },
      {
        label: "Héros S1",
        description: "Débloquer les vétérans de Raimon",
        href: "/heros-s1",
      },
    ],
  },
  {
    label: "Doc Technique",
    icon: BookOpenCheck,
    dropdown: [
      {
        label: "Tirs",
        description: "Puissance, éléments et coûts",
        href: "/doc-technique/tirs",
      },
      { 
        label: "Attaque",
        description: "Puissance, éléments et synergies",
        href: "/doc-technique/offensive",
      },
      {
        label: "Défense",
        description: "Contres, blocs, interceptions",
        href: "/doc-technique/defensive",
      },
      {
        label: "Gardien",
        description: "Posture, murs, timings",
        href: "/doc-technique/gardien",
      },
    ],
  },
  { label: "Crédits", icon: Info, href: "#credits" },
];

