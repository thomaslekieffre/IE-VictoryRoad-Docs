import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Contributor } from "@/lib/credits";

type ContributorCardProps = {
  contributor: Contributor & { avatarUrl: string }; // avatarUrl est garanti après enrichissement
};

export default function ContributorCard({ contributor }: ContributorCardProps) {
  const roleLabels = {
    creator: "Créateur",
    "co-creator": "Co-Créateur",
    contributor: "Contributeur",
  };

  const roleColors = {
    creator: "bg-blue-50 text-blue-700 border-blue-100",
    "co-creator": "bg-purple-50 text-purple-700 border-purple-100",
    contributor: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <div className="group relative flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-slate-200 sm:h-20 sm:w-20">
        <Image
          src={contributor.avatarUrl}
          alt={`Avatar de ${contributor.name}`}
          fill
          className="object-cover"
          unoptimized // Les avatars Discord peuvent changer, on ne les optimise pas
        />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="font-bold text-slate-900">{contributor.name}</h3>
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

