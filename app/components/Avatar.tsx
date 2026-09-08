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
      className="avatar-ring inline-flex shrink-0 items-center justify-center rounded-full p-[2.5px] shadow-[0_4px_16px_-6px_rgba(20,149,138,0.45)] transition-transform duration-300 hover:scale-105"
      style={{ width: size, height: size }}
    >
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-card">
        {errored ? (
          <span className="font-mono text-sm font-medium text-brand-700">
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
    </div>
  );
}
