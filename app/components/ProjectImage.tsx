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
  return (
    <div className="project-image">
      {errored ? (
        <span className="image-fallback">
          {initials}
          <small>Preview unavailable</small>
        </span>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 650px) 90vw, (max-width: 1100px) 45vw, 650px"
          className="object-contain"
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}
