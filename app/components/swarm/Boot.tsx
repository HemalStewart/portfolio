import { CREW } from "./crew";
import "./boot.css";

/**
 * The opening: for the first moment after the page paints, the file "opens"
 * — a card counts to 100% while the crew's cursors fly in from every side
 * and ring it, name tags showing. It is CSS alone, so it starts with the
 * first paint; Swarm.tsx ends it (`html[data-booted]`) and the cursors burst
 * out from the ring to build the page. Only shown under `html[data-motion]`,
 * and it dismisses itself if the script never arrives.
 */
export function Boot() {
  return (
    <div className="boot" aria-hidden="true">
      <div className="boot-card">
        <p className="boot-top">
          <span className="boot-file">
            <b>Hemal Herath</b>
            <small>portfolio · opening file</small>
          </span>
          <span className="boot-pct" />
        </p>
        <i className="boot-bar" />
        <p className="boot-note">
          <span>{CREW.length} cursors joining</span>
          <span>1 developer</span>
        </p>
      </div>
    </div>
  );
}
