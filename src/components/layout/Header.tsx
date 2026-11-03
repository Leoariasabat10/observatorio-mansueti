"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { asociacion, nav, observatorio, primaryCta } from "@/config/observatorio";
import { Mark } from "@/components/brand/Mark";

type NavItem = (typeof nav)[number];

const isExternal = (item: NavItem) => "external" in item && item.external;
const externalProps = (item: NavItem) => (isExternal(item) ? { target: "_blank", rel: "noopener" } : {});

function ExternalMark() {
  return (
    <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 2h6v6M10 2 3 9" />
    </svg>
  );
}

function CtaButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href={primaryCta.href}
      className={`inline-flex items-center justify-center gap-2 rounded-sm bg-navy px-5 py-3 text-sm font-semibold text-paper transition-colors duration-200 hover:bg-blue ${className}`}
    >
      {primaryCta.label}
      <span aria-hidden>→</span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const subRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!subOpen && !menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSubOpen(false);
        setMenuOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (subRef.current && !subRef.current.contains(e.target as Node)) setSubOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [subOpen, menuOpen]);

  const current = (href: string) => (pathname === href.split("#")[0] ? "page" : undefined);
  const closeOnLink = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a")) {
      setMenuOpen(false);
      setSubOpen(false);
    }
  };

  return (
    <>
    <div className="hidden bg-navy text-paper/80 xl:block">
      <div className="mx-auto flex h-8 max-w-7xl items-center justify-end px-8">
        <a href={asociacion.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-xs transition-colors hover:text-paper">
          {asociacion.label}
          <ExternalMark />
        </a>
      </div>
    </div>
    <header className="sticky top-0 z-40 border-t-[3px] border-gold border-b border-b-rule bg-card/95 backdrop-blur" onClick={closeOnLink}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3.5 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label={`${observatorio.shortName}, inicio`}>
          <Mark className="h-10 w-auto shrink-0 sm:h-12" priority />
          <span className="min-w-0 border-l border-rule pl-3 leading-tight">
            <span className="block text-[0.95rem] font-extrabold tracking-[0.04em] text-navy sm:text-base">OBSERVATORIO {observatorio.acronym}</span>
            <span className="block font-serif text-[0.95rem] text-heritage italic sm:text-base">{observatorio.honoree}</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden xl:block">
          <ul className="flex items-center gap-6 whitespace-nowrap">
            {nav.filter((item) => !isExternal(item)).map((item) =>
              "children" in item ? (
                <li key={item.href} ref={subRef} className="group relative flex items-center gap-1">
                  <Link href={item.href} aria-current={current(item.href)} className="nav-link">
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    aria-expanded={subOpen}
                    aria-controls="sub-lineas"
                    onClick={() => setSubOpen((o) => !o)}
                    className="p-1 text-muted"
                  >
                    <span className="sr-only">Submenú {item.label}</span>
                    <svg viewBox="0 0 10 6" className={`size-2.5 transition-transform duration-200 ${subOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="m1 1 4 4 4-4" />
                    </svg>
                  </button>
                  <ul
                    id="sub-lineas"
                    className={`absolute top-full left-0 min-w-64 pt-4 ${subOpen ? "block" : "hidden group-hover:block"}`}
                  >
                    <li className="border border-rule bg-card py-2 shadow-lg">
                      <ul>
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} className="block px-5 py-2.5 text-sm text-navy transition-colors hover:bg-paper hover:text-blue">
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </li>
              ) : (
                <li key={item.href}>
                  <Link href={item.href} aria-current={current(item.href)} className="nav-link inline-flex items-center gap-1.5" {...externalProps(item)}>
                    {item.label}
                    {isExternal(item) && <ExternalMark />}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <span className="hidden shrink-0 xl:block">
          <CtaButton />
        </span>

        <button
          type="button"
          className="grid size-11 shrink-0 place-items-center border border-rule text-navy xl:hidden"
          aria-expanded={menuOpen}
          aria-controls="menu-movil"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="sr-only">{menuOpen ? "Cerrar menú" : "Abrir menú"}</span>
          <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            {menuOpen ? <path d="m4 4 12 12M16 4 4 16" /> : <path d="M2 5h16M2 10h16M2 15h16" />}
          </svg>
        </button>
      </div>

      <nav id="menu-movil" aria-label="Menú móvil" hidden={!menuOpen} className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-rule bg-card xl:hidden">
        <ul className="mx-auto max-w-7xl px-5 py-2 lg:px-8">
          {nav.map((item) => (
            <li key={item.href} className="border-b border-rule last:border-0">
              <Link href={item.href} aria-current={current(item.href)} className="flex items-center gap-2 py-3.5 font-serif text-xl text-navy" {...externalProps(item)}>
                {item.label}
                {isExternal(item) && <ExternalMark />}
              </Link>
              {"children" in item && (
                <ul className="-mt-1 mb-3 border-l-2 border-blue pl-4">
                  {item.children.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} className="block py-2 text-sm text-muted">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="mx-auto max-w-7xl px-5 pb-5 lg:px-8">
          <CtaButton className="w-full" />
        </div>
      </nav>
    </header>
    </>
  );
}
