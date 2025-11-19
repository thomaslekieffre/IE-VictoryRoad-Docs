import type { ComponentType, SVGProps } from "react";

type HighlightCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

const HighlightCard = ({ icon: Icon, title, description }: HighlightCardProps) => (
  <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200/60">
    <div className="mb-3 flex items-center gap-2 text-slate-700">
      <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 text-slate-600">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">
        {title}
      </h3>
    </div>
    <p className="text-sm text-slate-500">{description}</p>
  </article>
);

export default HighlightCard;

