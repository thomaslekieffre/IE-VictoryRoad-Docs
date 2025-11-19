import type { ComponentType, SVGProps } from "react";
import { BookOpenCheck, Sparkles, Swords } from "lucide-react";

export type HighlightCardContent = {
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const highlightCards: HighlightCardContent[] = [
  {
    title: "Passifs",
    description:
      "Chaque buff listé avec conditions, synergies élémentaires et priorités de farm.",
    icon: Swords,
  },
  {
    title: "Astuces",
    description:
      "Optimise les fèves, tokens et rerolls héros avec nos scénarios testés.",
    icon: Sparkles,
  },
  {
    title: "Docs techniques",
    description:
      "Fiches tir/défense/gardien avec frames clés, coûts et mappings élémentaires.",
    icon: BookOpenCheck,
  },
];

