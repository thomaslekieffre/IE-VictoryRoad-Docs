import type { ComponentPropsWithoutRef } from "react";
import { ChevronDown, Search } from "lucide-react";

import { navItems } from "@/lib/nav-data";
import type { NavItem } from "@/lib/nav-data";
import { cn } from "@/lib/utils";

type NavbarProps = ComponentPropsWithoutRef<"header">;

const Navbar = ({ className, ...props }: NavbarProps) => (
  <header
    className={cn(
      "relative z-30 flex items-center justify-between rounded-3xl border border-white/60 bg-white/70 px-6 py-3 shadow-lg shadow-slate-200/60 backdrop-blur",
      className,
    )}
    {...props}
  >
    <span className="text-lg font-black uppercase tracking-[0.2em] text-slate-900">
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
      aria-label="Ouvrir le menu principal"
    >
      Menu
      <ChevronDown className="h-4 w-4" />
    </button>
  </header>
);

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
        <div className="invisible absolute right-0 top-full z-50 mt-3 w-64 translate-y-2 rounded-2xl border border-slate-100 bg-white p-3 text-sm shadow-2xl opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
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

