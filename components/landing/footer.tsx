import type { ComponentPropsWithoutRef } from "react";
import { Github, Twitter } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import { cn } from "@/lib/utils";

const footerLinks = [
  {
    title: "Guides",
    links: [
      { label: "Héros S1", href: "/heros-s1" },
      { label: "Passifs (soon)", href: "#" },
      { label: "Docs techniques", href: "/doc-technique/tirs" },
    ],
  },
  {
    title: "Communauté",
    links: [
      { label: "Discord FR", href: "https://discord.gg/ievrfr"},
      { label: "Tournois", href: "https://discord.gg/t2Q3wJTXY8" },
      { label: "Soumettre une fiche (Soon)", href: "#" },
    ],
  },
];

const socialLinks = [
  { label: "Twitter", href: "https://x.com/ievrfr", icon: Twitter },
  { label: "GitHub", href: "https://github.com/thomaslekieffre", icon: Github },
  { label: "Discord", href: "https://discord.gg/ievrfr", icon: FaDiscord },
];

type FooterProps = ComponentPropsWithoutRef<"footer">;

const Footer = ({ className, ...props }: FooterProps) => {
  return (
    <footer
      className={cn(
        "rounded-3xl border border-white/60 bg-white/80 px-5 py-6 shadow-lg shadow-slate-200/60 backdrop-blur",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
            Victory Road FR
          </p>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Ressources communautaires pour optimiser ton club. Données mises à
            jour en continu par les joueurs francophones.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                {section.title}
              </p>
              <ul className="mt-2 space-y-1.5">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.label}`}>
                    <a
                      href={link.href}
                      className="text-slate-600 transition hover:text-slate-900"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Victory Road FR. Non affilié à Level-5.
        </p>
        <div className="flex items-center gap-3">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

