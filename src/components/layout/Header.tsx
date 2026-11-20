"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, MessageCircle, X } from "lucide-react";
import { asociacion, contact, nav, observatorio } from "@/config/observatorio";
import { Mark } from "@/components/brand/Mark";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const current = (href: string) =>
    href !== "#contacto" && (href === "/" ? pathname === "/" : pathname.startsWith(href)) ? "page" : undefined;

  return (
    <>
      <div className="hidden bg-navy-deep text-paper/80 md:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center px-8 text-xs">
          <a href={asociacion.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 transition-colors hover:text-paper">
            Una iniciativa de la {asociacion.name} ({asociacion.acronym})
            <ArrowUpRight className="size-3" aria-hidden />
          </a>
        </div>
      </div>
      <header style={{ viewTransitionName: "site-header" }} className="sticky top-0 z-40 border-b border-rule bg-card/95 backdrop-blur" onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Mark className="h-10 w-auto shrink-0 sm:h-12" priority />
            <span className="min-w-0 border-l border-rule pl-3 leading-tight">
              <span className="block text-[0.95rem] font-extrabold tracking-[0.04em] text-navy sm:text-base">
                OBSERVATORIO {observatorio.acronym}
              </span>
              <span className="block text-[0.85rem] text-heritage italic sm:text-[0.9rem]">{observatorio.honoree}</span>
              <span className="sr-only">, inicio</span>
            </span>
          </Link>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-8 whitespace-nowrap">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} aria-current={current(item.href)} className="nav-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href={contact.whatsapp}
            target="_blank"
            rel="noopener"
            className="hidden shrink-0 items-center gap-2 rounded-sm bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue lg:inline-flex"
          >
            <MessageCircle className="size-4" aria-hidden />
            WhatsApp
          </a>

          <button
            type="button"
            className="grid size-11 shrink-0 place-items-center rounded-sm border border-rule text-navy lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>

        <nav id="menu-movil" aria-label="Menú móvil" hidden={!open} className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-rule bg-card lg:hidden">
          <ul className="mx-auto max-w-7xl px-5">
            {nav.map((item) => (
              <li key={item.href} className="border-b border-rule">
                <Link href={item.href} aria-current={current(item.href)} className="block py-4 font-display text-3xl text-navy aria-[current=page]:text-blue">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mx-auto max-w-7xl space-y-4 px-5 py-5">
            <a href={contact.whatsapp} target="_blank" rel="noopener" className="flex w-full items-center justify-center gap-2 rounded-sm bg-navy px-5 py-3.5 text-sm font-semibold text-white">
              <MessageCircle className="size-4" aria-hidden />
              Escribir por WhatsApp
            </a>
            <a href={asociacion.url} target="_blank" rel="noopener" className="flex items-center gap-1.5 text-xs text-muted">
              Una iniciativa de la {asociacion.acronym}
              <ArrowUpRight className="size-3" aria-hidden />
            </a>
          </div>
        </nav>
      </header>
    </>
  );
}
