import "./store-shots.css";
import Image from "next/image";
import type { CSSProperties } from "react";

/**
 * A mobile app's real store screenshots in a coverflow: the middle one faces
 * the viewer, the others turn towards it and fall back into the dark. Used
 * for the apps whose screens are artwork and photography, not just layout.
 */
export function StoreShots({
  shots,
  glow,
}: {
  /** Image paths left to right; the middle one is in front. */
  shots: string[];
  /** Brand glow colour behind the screenshots, as "r g b". */
  glow: string;
}) {
  const mid = (shots.length - 1) / 2;
  return (
    <div className="ss-stage" style={{ "--glow": glow } as CSSProperties}>
      <span className="ss-ring" />
      {shots.map((src, index) => {
        const i = index - mid;
        return (
          <figure
            key={src}
            className="ss-shot"
            style={
              {
                "--i": i,
                "--a": Math.abs(i),
                zIndex: 10 - Math.abs(i),
              } as CSSProperties
            }
          >
            <Image
              src={src}
              alt=""
              width={621}
              height={1344}
              sizes="(max-width: 900px) 34vw, 220px"
            />
          </figure>
        );
      })}
    </div>
  );
}
