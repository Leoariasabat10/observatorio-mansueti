"use client";

import { useSyncExternalStore } from "react";

// The site is static, so the build time is only the first render: in the browser the real clock takes over
// and refreshes every 30 s, so "próximo", "en vivo" and "realizado" change without republishing.
// Preview: ?ahora=2026-11-12T18:30 simulates a moment (read as Bogotá time) to review the "en vivo" state.

const PASO = 30_000;
let simulado: number | null | undefined;

function leerSimulado() {
  if (simulado !== undefined) return simulado;
  const sim = new URLSearchParams(window.location.search).get("ahora");
  const ms = sim ? Date.parse(/[zZ]|[+-]\d\d:\d\d$/.test(sim) ? sim : `${sim}-05:00`) : NaN;
  simulado = Number.isNaN(ms) ? null : ms;
  return simulado;
}

// Rounded to the 30 s step so the snapshot stays stable between ticks.
const snapshot = () => leerSimulado() ?? Math.floor(Date.now() / PASO) * PASO;

function subscribe(cb: () => void) {
  const id = setInterval(cb, PASO);
  return () => clearInterval(id);
}

export function useAhora(buildNow: number) {
  return useSyncExternalStore(subscribe, snapshot, () => buildNow);
}
