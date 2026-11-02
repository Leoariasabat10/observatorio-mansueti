import Link from "next/link";
import { asociacion, legal, nav, observatorio, researchLines, social } from "@/config/observatorio";
import { Mark } from "@/components/brand/Mark";
import { SocialIcon } from "@/components/ui/SocialIcon";

const heading = "eyebrow text-paper/55";
const link = "text-sm text-paper/80 transition-colors hover:text-paper";

export function Footer() {
  return (
    <footer className="bg-slate text-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-4">
          <div className="flex items-center gap-3">
            <Mark className="size-11 shrink-0" inverted />
            <div className="leading-tight">
              <p className="text-sm font-semibold">{observatorio.name}</p>
              <p className="font-serif text-lg text-sky-300 italic">{observatorio.honoree}</p>
            </div>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/70">{observatorio.mission}</p>
          <ul className="mt-6 flex gap-3">
            {social.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  className="grid size-10 place-items-center border border-paper/20 transition-colors hover:border-teal hover:text-sky-300"
                >
                  <SocialIcon id={s.id} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Observatorio" className="lg:col-span-3">
          <h2 className={heading}>Observatorio</h2>
          <ul className="mt-5 space-y-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Líneas de investigación" className="lg:col-span-3">
          <h2 className={heading}>Líneas</h2>
          <ul className="mt-5 space-y-3">
            {researchLines.map((l) => (
              <li key={l.slug}>
                <Link href={`/investigacion#${l.slug}`} className={link}>
                  {l.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-2">
          <h2 className={heading}>Contacto</h2>
          <p className="mt-5 text-sm text-paper/80">
            {observatorio.email ? (
              <a href={`mailto:${observatorio.email}`} className={link}>
                {observatorio.email}
              </a>
            ) : (
              "[Pendiente: correo oficial]"
            )}
          </p>
          <a href={asociacion.url} target="_blank" rel="noopener" className={`${link} mt-4 inline-block underline underline-offset-4`}>
            {asociacion.label}
          </a>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 text-xs leading-relaxed text-paper/60 lg:grid-cols-12 lg:px-8">
          <p className="lg:col-span-5">{legal.disclaimer}</p>
          <p className="lg:col-span-5">
            <span className="text-paper/80">Habeas Data. </span>
            {legal.habeasData}
          </p>
          <p className="lg:col-span-2 lg:text-right">
            © {observatorio.copyrightYear} {observatorio.shortName}
          </p>
        </div>
      </div>
    </footer>
  );
}
