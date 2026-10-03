import type { ProfileLink } from "../data/portfolio";

/** Monochrome marks for profile links. The link name lives on the parent anchor. */
export function LinkIcon({
  name,
  size = 20,
}: {
  name: ProfileLink["label"];
  size?: number;
}) {
  const shared = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
    focusable: "false" as const,
  };
  if (name === "GitHub")
    return (
      <svg {...shared} fill="currentColor">
        <path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.34-3.8-1.34-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.71 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.51-.28-5.15-1.25-5.15-5.56 0-1.23.44-2.23 1.16-3.01-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.81 10.81 0 0 1 5.65 0c2.15-1.45 3.1-1.15 3.1-1.15.61 1.55.23 2.7.11 2.98.72.78 1.16 1.78 1.16 3.01 0 4.32-2.64 5.27-5.16 5.55.4.35.77 1.04.77 2.09v3.11c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z" />
      </svg>
    );
  if (name === "LinkedIn")
    return (
      <svg {...shared} fill="currentColor">
        <path d="M5.4 8.2H1.9V22h3.5V8.2ZM3.65 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM22.1 13.65c0-3.68-1.96-5.4-4.57-5.4-2.11 0-3.07 1.16-3.6 1.96V8.2h-3.5V22h3.5v-7.71c0-2.04.38-4.01 2.92-4.01 2.5 0 2.53 2.34 2.53 4.14V22h3.5v-8.35Z" />
      </svg>
    );
  return (
    <svg
      {...shared}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === "Email" ? (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 6 9 7 9-7" />
        </>
      ) : name === "Phone" ? (
        <path d="M20 15.5c-1.3 0-2.55-.22-3.7-.64a1 1 0 0 0-1.05.25l-2.22 2.22a15.4 15.4 0 0 1-6.35-6.35L8.9 8.76a1 1 0 0 0 .25-1.05A10.77 10.77 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1c0 9.39 7.61 17 17 17a1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1Z" />
      ) : (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" />
          <path d="M14 2v6h6M12 11v7m-3-3 3 3 3-3" />
        </>
      )}
    </svg>
  );
}

export function ArrowIcon({
  direction = "out",
}: {
  direction?: "out" | "down" | "right";
}) {
  const d =
    direction === "down"
      ? "M8 3v10m0 0 4-4m-4 4-4-4"
      : direction === "right"
        ? "M3 8h10m0 0-4-4m4 4-4 4"
        : "M5 11 11 5m0 0H6.5M11 5v4.5";
  return (
    <svg
      className="arrow-icon"
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
