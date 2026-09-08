"use client";

import Image from "next/image";
import { useState } from "react";

export function Avatar({
  src,
  alt,
  fallbackInitials,
  size = 56,
}: {
  src: string;
  alt: string;
  fallbackInitials: string;
  size?: number;
}) {
  const [errored, setErrored] = useState(false);

  return (
    <div
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-brand-500/50 bg-card "
      style={{ width: size, height: size }}
    >
      {errored ? (
        <span className="font-mono text-sm font-medium text-brand-300">
          {fallbackInitials}
        </span>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}
