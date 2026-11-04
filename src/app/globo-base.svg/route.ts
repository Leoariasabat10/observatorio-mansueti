import { globoBaseSvg } from "@/lib/globo";

// Built once at export time into out/globo-base.svg; injected inline by the Globo component after load.
export const dynamic = "force-static";

export function GET() {
  return new Response(globoBaseSvg(), { headers: { "Content-Type": "image/svg+xml; charset=utf-8" } });
}
