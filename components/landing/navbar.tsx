
"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, Search, X } from "lucide-react";

import { navItems } from "@/lib/nav-data";
import type { NavItem } from "@/lib/nav-data";
import { cn } from "@/lib/utils";

type NavbarProps = ComponentPropsWithoutRef<"header">;

const Navbar = ({ className, ...props }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.classList.remove("overflow-hidden");
      return;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.body.classList.add("overflow-hidden");
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", handleKey);
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "relative z-30 flex items-center justify-between rounded-3xl border border-white/60 bg-white/70 px-4 py-3 shadow-lg shadow-slate-200/60 backdrop-blur sm:px-6",
          className,
        )}
        {...props}
      >
        <span className="text-base font-black uppercase tracking-[0.25em] text-slate-900 sm:text-lg">
          Victory Road FR
        </span>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.label} item={item} />
          ))}

          <button
            type="button"
            className="ml-2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            aria-label="Recherche"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </button>
        </nav>

        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 md:hidden"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Ouvrir le menu principal"
        >
          <Menu className="h-4 w-4" />
          Menu
        </button>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/70 md:hidden">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Fermer le menu"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col gap-6 rounded-l-3xl border-l border-white/20 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">
                Menu
              </span>
              <button
                type="button"
                className="rounded-full border border-slate-200 p-2 text-slate-500"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Fermer le menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto pb-6">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 px-3 py-2 text-sm text-slate-600">
                <Search className="h-4 w-4 text-slate-400" />
                Rechercher
              </div>
              <ul className="space-y-4">
                {navItems.map((item) => (
                  <li key={`mobile-${item.label}`}>
                    <a
                      href={item.href ?? "#"}
                      className="flex items-center gap-3 rounded-2xl border border-slate-100 px-3 py-3 font-semibold text-slate-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5 text-slate-400" />
                      {item.label}
                    </a>
                    {item.dropdown && (
                      <ul className="ml-6 mt-3 space-y-2 border-l border-slate-100 pl-4 text-sm text-slate-500">
                        {item.dropdown.map((entry) => (
                          <li key={`${item.label}-${entry.label}`}>
                            <p className="font-semibold text-slate-700">{entry.label}</p>
                            <p className="text-[12px] text-slate-500">{entry.description}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

function NavLink({ item }: { item: NavItem }) {
  const Icon = item.icon;

  return (
    <div className="group relative">
      <a
        href={item.href ?? "#"}
        className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-white/60 hover:text-slate-950"
      >
        <Icon className="h-4 w-4 text-slate-500" strokeWidth={2.2} />
        {item.label}
        {item.dropdown && (
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition group-hover:rotate-180" />
        )}
      </a>

      {item.dropdown && (
        <div className="invisible absolute right-0 top-full z-50 mt-3 w-64 max-w-[calc(100vw-2rem)] translate-y-2 rounded-2xl border border-slate-100 bg-white p-3 text-sm shadow-2xl opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {item.label}
          </p>
          <ul className="space-y-2">
            {item.dropdown.map((entry) => (
              <li
                key={entry.label}
                className="rounded-xl px-3 py-2 transition hover:bg-slate-50"
              >
                <p className="text-xs font-semibold text-slate-800">
                  {entry.label}
                </p>
                <p className="text-[11px] text-slate-500">{entry.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

