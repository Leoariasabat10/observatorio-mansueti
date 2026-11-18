"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

type Props = {
  src: string;
  poster: string;
  subtitulos: string;
  titulo: string;
  duracion: string;
};

/* Institutional video: poster + play control first (preload="none", nothing downloads until the visitor
   asks), then the native controls take over. Captions ship as an optional track, off by default. */
export function VideoMensaje({ src, poster, subtitulos, titulo, duracion }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const [iniciado, setIniciado] = useState(false);

  return (
    <div className="group relative aspect-video overflow-hidden rounded-sm bg-navy-deep sombra-larga ring-1 ring-navy/10">
      <video
        ref={video}
        className="absolute inset-0 size-full object-cover"
        src={src}
        poster={poster}
        preload="none"
        playsInline
        controls={iniciado}
        onPlay={() => setIniciado(true)}
        aria-label={titulo}
      >
        <track kind="captions" src={subtitulos} srcLang="es" label="Español" />
      </video>

      {!iniciado && (
        <button
          type="button"
          onClick={() => {
            setIniciado(true);
            void video.current?.play();
          }}
          className="absolute inset-0 cursor-pointer focus-visible:outline-offset-[-6px]"
          aria-label={`Reproducir el video: ${titulo} (${duracion})`}
        >
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-deep/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none" />
          <span
            aria-hidden
            className="absolute right-[4%] bottom-[5%] inline-flex items-center gap-3 rounded-full bg-paper p-1.5 text-sm font-semibold text-navy shadow-[0_14px_34px_-12px_rgba(3,23,74,0.7)] transition-[background-color,transform] duration-300 ease-out group-hover:bg-white group-active:scale-[0.97] sm:gap-3.5 sm:p-1.5 sm:pr-5"
          >
            <span className="grid size-9 place-items-center rounded-full bg-navy text-paper transition-transform duration-300 ease-out group-hover:scale-105 sm:size-10">
              <Play className="size-4 translate-x-px fill-current sm:size-5" strokeWidth={1.5} />
            </span>
            <span className="hidden sm:inline">Ver el mensaje</span>
            <span className="tnum hidden font-normal text-muted sm:inline">{duracion}</span>
          </span>
        </button>
      )}
    </div>
  );
}
