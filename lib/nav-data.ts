import type { ComponentType, SVGProps } from "react";
import {
  BookOpenCheck,
  HomeIcon,
  Info,
  Sparkles,
  Swords,
  Users2,
} from "lucide-react";

export type DropdownItem = {
  label: string;
  description: string;
};

export type NavItem = {
  label: string;
  href?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  dropdown?: DropdownItem[];
};

export const navItems: NavItem[] = [
  { label: "Accueil", icon: HomeIcon, href: "#" },
  { label: "Héros S1", icon: Users2, href: "/heros-s1" },
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
      { label: "Fèves", description: "Optimiser les récoltes quotidiennes" },
      { label: "Farm Token", description: "Routes rapides pour max tokens" },
      { label: "Héros S1", description: "Débloquer les vétérans de Raimon" },
    ],
  },
  {
    label: "Doc Technique",
    icon: BookOpenCheck,
    dropdown: [
      { label: "Tirs", description: "Puissance, éléments et synergies" },
      { label: "Défense", description: "Contres, blocs, interceptions" },
      { label: "Gardien", description: "Posture, murs, timings" },
    ],
  },
  { label: "Crédits", icon: Info, href: "#credits" },
];

