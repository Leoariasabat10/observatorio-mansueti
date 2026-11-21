import type { Metadata } from "next";
import { getEdiciones } from "@/lib/latitud";
import { EdicionVista, Masthead, SinEdiciones } from "@/components/latitud/Edicion";

export const metadata: Metadata = {
  title: "Latitud Sudamericana: Pensamiento Jurídico",
  description: "Magazine digital del Observatorio ASDTSS con artículos, análisis y reflexiones sobre el pensamiento jurídico sudamericano en Derecho del Trabajo y Seguridad Social.",
  alternates: { canonical: "/latitud-sudamericana" },
};

export default function Latitud() {
  const [ultima, ...anteriores] = getEdiciones();
  return (
    <>
      <Masthead />
      {ultima ? <EdicionVista e={ultima} otras={anteriores} /> : <SinEdiciones />}
    </>
  );
}
