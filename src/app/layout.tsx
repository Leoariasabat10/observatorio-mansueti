import type { Metadata, Viewport } from "next";
import { Archivo, Libre_Caslon_Display, Libre_Caslon_Text } from "next/font/google";
import { observatorio } from "@/config/observatorio";
import { siteConfig } from "@site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const caslonDisplay = Libre_Caslon_Display({ variable: "--font-caslon-display", subsets: ["latin"], weight: "400" });
const caslon = Libre_Caslon_Text({ variable: "--font-caslon", subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"] });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"] });

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
    <html lang="es-CO" className={`${caslonDisplay.variable} ${caslon.variable} ${archivo.variable} antialiased`}>
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
