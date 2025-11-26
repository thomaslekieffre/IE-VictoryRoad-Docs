"use client";

import type { ComponentPropsWithoutRef, Dispatch, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X, Moon, Sun } from "lucide-react";
import Link from "next/link";

import { navItems } from "@/lib/nav-data";
import type { NavItem } from "@/lib/nav-data";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

type NavbarProps = ComponentPropsWithoutRef<"header">;

const Navbar = ({ className, ...props }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.classList.remove("overflow-hidden");
      return;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
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
          "relative z-30 flex items-center justify-between rounded-3xl border border-border/60 bg-card/70 px-4 py-3 shadow-lg backdrop-blur sm:px-6",
          className,
        )}
        {...props}
      >
        <Link
          href="/"
          className="text-base font-black uppercase tracking-[0.25em] text-foreground sm:text-lg"
        >
          Victory Road FR
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              />
            ))}
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            className="hidden rounded-full border border-border bg-background/50 p-2 text-foreground transition hover:bg-accent md:flex"
            aria-label={mounted && theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-semibold text-foreground md:hidden"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Ouvrir le menu principal"
          >
            <Menu className="h-4 w-4" />
            Menu
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Fermer le menu"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col gap-6 rounded-l-3xl border-l border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground">
                Menu
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="rounded-full border border-border bg-background/50 p-2 text-foreground transition hover:bg-accent"
                  aria-label={mounted && theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
                >
                  {mounted && theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  className="rounded-full border border-border p-2 text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Fermer le menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto pb-6">
              <ul className="space-y-4">
                {navItems.map((item) => (
                  <li key={`mobile-${item.label}`}>
                    <a
                      href={item.href ?? "#"}
                      className="flex items-center gap-3 rounded-2xl border border-border px-3 py-3 font-semibold text-foreground"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                      {item.label}
                    </a>
                    {item.dropdown && (
                      <ul className="ml-6 mt-3 space-y-2 border-l border-border pl-4 text-sm text-muted-foreground">
                        {item.dropdown.map((entry) => (
                          <li key={`${item.label}-${entry.label}`}>
                            <a
                              href={entry.href ?? "#"}
                              className="block rounded-xl px-3 py-2 transition hover:bg-accent"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <p className="font-semibold text-foreground">{entry.label}</p>
                              <p className="text-[12px] text-muted-foreground">
                                {entry.description}
                              </p>
                            </a>
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

type NavLinkProps = {
  item: NavItem;
  activeDropdown: string | null;
  setActiveDropdown: Dispatch<SetStateAction<string | null>>;
};

function NavLink({ item, activeDropdown, setActiveDropdown }: NavLinkProps) {
  const Icon = item.icon;
  const hasDropdown = Boolean(item.dropdown);
  const isOpen = hasDropdown && activeDropdown === item.label;
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    if (hasDropdown) setActiveDropdown(item.label);
  };

  const handleLeave = () => {
    if (!hasDropdown) return;
    closeTimeout.current = setTimeout(() => {
      setActiveDropdown((current) =>
        current === item.label ? null : current,
      );
    }, 120);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocusCapture={handleEnter}
      onBlurCapture={handleLeave}
    >
      <a
        href={item.href ?? "#"}
        className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-accent hover:text-foreground"
        aria-haspopup={hasDropdown ? "true" : undefined}
        aria-expanded={hasDropdown ? isOpen : undefined}
      >
        <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={2.2} />
        {item.label}
        {item.dropdown && (
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground transition",
              isOpen && "rotate-180 text-foreground",
            )}
          />
        )}
      </a>

      {item.dropdown && (
        <div
          className={cn(
            "pointer-events-none invisible absolute right-0 top-full z-50 mt-3 w-64 max-w-[calc(100vw-2rem)] translate-y-2 rounded-2xl border border-border bg-card p-3 text-sm shadow-2xl opacity-0 transition",
            isOpen && "pointer-events-auto visible translate-y-0 opacity-100",
          )}
        >
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {item.label}
          </p>
          <ul className="space-y-2">
            {item.dropdown.map((entry) => (
              <li key={entry.label}>
                <a
                  href={entry.href ?? "#"}
                  className="block rounded-xl px-3 py-2 transition hover:bg-accent"
                >
                  <p className="text-xs font-semibold text-foreground">
                    {entry.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {entry.description}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
