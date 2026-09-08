"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Microsoft Fluent Emoji (MIT) — see public/mascot.LICENSE.txt.
 * Source art is 256px, so it is rendered small to stay crisp on retina.
 */
export function HeroMascot() {
  const [errored, setErrored] = useState(false);

  if (errored) return null;

  return (
    <div className="pointer-events-none absolute bottom-[14%] right-[6%] hidden h-[120px] w-[120px] sm:block md:bottom-[16%] md:right-[10%] md:h-[150px] md:w-[150px]">
      <Image
        src="/mascot.png"
        alt=""
        fill
        sizes="150px"
        className="hero-dot object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
        onError={() => setErrored(true)}
      />
    </div>
  );
}
