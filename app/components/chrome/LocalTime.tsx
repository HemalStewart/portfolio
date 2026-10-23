"use client";

import { useEffect, useState } from "react";

const format = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Colombo",
});

/** Hemal's local time in Colombo, ticking; the server renders a placeholder. */
export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(format.format(new Date()));
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 15_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, []);

  const [hours, minutes] = (time ?? "--:--").split(":");
  return (
    <span className="local-time">
      <span>Colombo</span>
      <time aria-label={time ? `${time} in Colombo` : undefined}>
        {hours}
        <span className="local-time-colon" aria-hidden="true">
          :
        </span>
        {minutes}
      </time>
    </span>
  );
}
