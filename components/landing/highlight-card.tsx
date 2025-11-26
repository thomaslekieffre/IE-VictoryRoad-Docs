import type { ComponentType, SVGProps } from "react";

type HighlightCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

const HighlightCard = ({ icon: Icon, title, description }: HighlightCardProps) => (
  <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-lg shadow-slate-200/60 dark:shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:rounded-3xl sm:p-5">
    <div className="mb-2 flex items-center gap-2 text-slate-700 sm:mb-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-600 sm:h-9 sm:w-9 sm:rounded-2xl">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </span>
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm">
        {title}
      </h3>
    </div>
    <p className="text-xs text-slate-500 sm:text-sm">{description}</p>
  </article>
);

export default HighlightCard;

