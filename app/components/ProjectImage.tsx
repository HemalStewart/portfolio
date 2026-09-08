"use client";

import Image from "next/image";
import { useState } from "react";

export function ProjectImage({
  src,
  alt,
  initials,
}: {
  src: string;
  alt: string;
  initials: string;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-brand-500/10">
        <span className="font-mono text-3xl font-medium tracking-tight text-brand-300/40">
          {initials}
        </span>
        <span className="absolute bottom-3 right-4 font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Preview coming soon
        </span>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-white/5">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 700px"
        className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
        onError={() => setErrored(true)}
      />
    </div>
  );
}
