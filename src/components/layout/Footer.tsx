import Link from "next/link";
import { siteConfig } from "@site";
import { asociacion, contact, legal, nav, navSecciones, observatorio, social } from "@/config/observatorio";
import { ejes } from "@/lib/ejes";
import { SocialIcon } from "@/components/ui/SocialIcon";

const heading = "eyebrow text-paper/70";
const link = "text-sm text-paper/80 transition-colors hover:text-paper";

export function Footer() {
  return (
    <footer id="contacto" className="diferido noche grano relative scroll-mt-20 overflow-hidden text-paper">
      {/* Editorial wordmark: the name set large across the page, honoree below. */}
      <div className="mx-auto max-w-7xl px-5 pt-20 pb-14 lg:px-8 lg:pt-28">
        <p className="font-display text-[clamp(3.25rem,11.5vw,10.5rem)] leading-[0.82] font-medium tracking-[-0.035em]" aria-hidden>
          Observatorio <span className="text-sky">{observatorio.acronym}</span>
        </p>
        <div className="mt-8 flex flex-col gap-3 border-t border-paper/15 pt-6 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="font-display text-2xl text-gold italic sm:text-3xl">{observatorio.honoree}</p>
          <p className="max-w-md text-sm text-paper/70">{observatorio.name}</p>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 sm:grid-cols-2 lg:grid-cols-12 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-4">
          <p className="max-w-sm text-sm leading-relaxed text-paper/70">{observatorio.mission}</p>
          <ul className="mt-6 flex gap-3">
            {social.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  className="grid size-10 place-items-center border border-paper/20 transition-colors hover:border-blue hover:text-sky"
                >
                  <SocialIcon id={s.id} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Observatorio" className="lg:col-span-2">
          <h2 className={heading}>Observatorio</h2>
          <ul className="mt-5 space-y-3">
            {[...nav, ...navSecciones].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Ejes temáticos" className="lg:col-span-3">
          <h2 className={heading}>Ejes temáticos</h2>
          <ul className="mt-5 space-y-3">
            {ejes.map((e) => (
              <li key={e.slug}>
                <Link href={`/programa-academico?eje=${e.slug}`} className={link}>
                  {e.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sm:col-span-2 lg:col-span-3">
          <h2 className={heading}>Contacto</h2>
          <address className="mt-5 space-y-3 text-sm text-paper/80 not-italic">
            <p>
              {contact.address.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </p>
            <p>
              <a href={contact.whatsapp} target="_blank" rel="noopener" className={link}>WhatsApp {contact.phoneDisplay}</a>
            </p>
            <p>
              <a href={`mailto:${contact.email}`} className={`${link} break-all`}>{contact.email}</a>
            </p>
          </address>
          <h2 className={`${heading} mt-10`}>Entidad matriz</h2>
          <p className="mt-4 text-sm leading-relaxed text-paper/80">
            <a href={asociacion.url} target="_blank" rel="noopener" className={`${link} underline underline-offset-4`}>
              {asociacion.name}
            </a>
            <span className="mt-1 block">
              <a href={asociacion.facebook} target="_blank" rel="noopener" className={link}>Facebook de la {asociacion.acronym}</a>
            </span>
          </p>
        </div>
      </div>

      <div className="relative border-t border-paper/10">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 text-xs leading-relaxed text-paper/60 lg:grid-cols-12 lg:px-8">
          <p className="lg:col-span-5">{legal.disclaimer}</p>
          <p className="lg:col-span-5">
            <span className="text-paper/80">Habeas Data. </span>
            {legal.habeasData}
          </p>
          <p className="lg:col-span-2 lg:text-right">
            © {observatorio.copyrightYear} {observatorio.shortName}
            {siteConfig.agency.name && !siteConfig.agency.name.startsWith("AGENCIA_") && (
              <a href={siteConfig.agency.url} target="_blank" rel="noopener" className="mt-1 block hover:text-paper">
                Sitio: {siteConfig.agency.name}
              </a>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
