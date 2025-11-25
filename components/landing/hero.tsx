import type { ComponentType, ReactNode, SVGProps } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type HeroCta = {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

type HeroProps = {
  badge: string;
  title: ReactNode;
  subtitle: string;
  imageSrc: string;
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  className?: string;
};

const Hero = ({
  badge,
  title,
  subtitle,
  imageSrc,
  primaryCta,
  secondaryCta,
  className,
}: HeroProps) => (
  <section
    className={cn(
      "relative overflow-hidden rounded-[32px] border border-border shadow-2xl",
      className,
    )}
  >
    <div className="absolute inset-0">
      <Image
        src={imageSrc}
        alt="Illustration Inazuma Eleven Victory Road"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/40 to-slate-950/80" />
    </div>

    <div className="relative z-10 flex flex-col gap-4 px-6 py-12 text-white sm:gap-6 sm:px-8 sm:py-16 md:px-16 md:py-20">
      <span className="w-fit rounded-full border border-white/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80 sm:px-4 sm:text-xs">
        {badge}
      </span>
      <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl">{title}</h1>
      <p className="max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
        {subtitle}
      </p>
      <div className="flex flex-col gap-3 text-sm font-semibold sm:flex-row sm:flex-wrap">
        <HeroButton {...primaryCta} />
        <HeroButton {...secondaryCta} variant="secondary" />
      </div>
    </div>
  </section>
);

export default Hero;

function HeroButton({
  href,
  label,
  icon: Icon,
  variant = "primary",
}: HeroCta & { variant?: "primary" | "secondary" }) {
  const isPrimary = variant === "primary";
  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-full px-5 py-3 transition",
        isPrimary
          ? "bg-amber-300 text-slate-950 hover:bg-amber-200"
          : "border border-white/30 text-white hover:bg-white/10",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </a>
  );
}

