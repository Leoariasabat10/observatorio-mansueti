import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Schibsted_Grotesk } from "next/font/google";
import { observatorio } from "@/config/observatorio";
import { siteConfig } from "@site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

// Bodoni Moda (high-contrast didone, optical-size axis) only at large sizes; Schibsted Grotesk for text and UI. Both OFL.
const bodoni = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin"], axes: ["opsz"], style: ["normal", "italic"] });
const schibsted = Schibsted_Grotesk({ variable: "--font-schibsted", subsets: ["latin"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${observatorio.shortName} | ${observatorio.name}`,
    template: `%s | ${observatorio.shortName}`,
  },
  description: observatorio.mission,
  openGraph: { type: "website", locale: "es_CO", siteName: observatorio.shortName },
};

export const viewport: Viewport = {
  themeColor: "#062265",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CO" className={`${bodoni.variable} ${schibsted.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-navy focus:px-4 focus:py-2 focus:text-paper"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
