"use client";

import Image from "next/image";
import { useState } from "react";

export function HeroMascot() {
  const [errored, setErrored] = useState(false);

  if (errored) return null;

  return (
    <div className="pointer-events-none absolute bottom-0 right-2 hidden h-[200px] w-[200px] sm:block md:h-[240px] md:w-[240px] lg:right-6">
      <Image
        src="/mascot.png"
        alt=""
        fill
        className="object-contain object-bottom"
        onError={() => setErrored(true)}
      />
    </div>
  );
}
