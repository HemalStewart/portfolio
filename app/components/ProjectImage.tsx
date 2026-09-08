"use client";

import Image from "next/image";
import { useState } from "react";

export function ProjectImage({
  src,
  alt,
  accent,
  initials,
}: {
  src: string;
  alt: string;
  accent: string;
  initials: string;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${accent} 14%, white), color-mix(in srgb, ${accent} 4%, white))`,
        }}
      >
        <span
          className="font-mono text-3xl font-medium tracking-tight opacity-30"
          style={{ color: accent }}
        >
          {initials}
        </span>
        <span className="absolute bottom-3 right-4 font-mono text-[10px] uppercase tracking-widest text-slate-400">
          Preview coming soon
        </span>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 700px"
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
        onError={() => setErrored(true)}
      />
    </div>
  );
}
