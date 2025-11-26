import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Contributor } from "@/lib/credits";
import { Crown } from "lucide-react";

type ContributorCardProps = {
  contributor: Required<Contributor>;
};

export default function ContributorCard({ contributor }: ContributorCardProps) {
  const roleLabels = {
    creator: "Créateur",
    "co-creator": "Co-Créateur",
    contributor: "Contributeur",
  };

  const roleColors = {
    creator: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30",
    "co-creator": "bg-purple-500/10 text-purple-700 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30",
    contributor: "bg-muted text-muted-foreground border-border",
  };

  return (
    <div className="group relative flex flex-col items-center gap-3 rounded-2xl border border-border bg-card/80 p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-border sm:h-20 sm:w-20">
        <Image
          src={contributor.avatarUrl}
          alt={`Avatar de ${contributor.name}`}
          fill
          className="object-cover"
          unoptimized // Les avatars Discord peuvent changer, on ne les optimise pas
        />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="flex items-center gap-1.5 font-bold text-foreground">
          {contributor.name}
          {contributor.isVip && (
            <Crown className="h-4 w-4 fill-yellow-500 text-yellow-600 dark:text-yellow-400" />
          )}
        </h3>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            roleColors[contributor.role],
          )}
        >
          {roleLabels[contributor.role]}
        </span>
      </div>
    </div>
  );
}

