import { experience, releases } from "../../data/portfolio";
import { BranchMark } from "../icons";

const lines = [
  "git clone github.com/HemalStewart/main",
  `Resolving deltas: ${experience[experience.length - 1].start.slice(0, 4)} → today`,
  `Checking out: ${releases.length} live products`,
];

/**
 * The boot screen: a short clone sequence and a counter, then the panel
 * wipes up to reveal the hero. Pure CSS, so it never waits on JavaScript; a
 * tiny inline script in the layout skips it on repeat visits in a session,
 * and reduced motion never shows it.
 */
export function Boot() {
  return (
    <div className="boot" aria-hidden="true">
      <div className="boot-top shell">
        <span className="boot-mark">
          <BranchMark size={18} />
          hemal/main
        </span>
        <span>Colombo, Sri Lanka</span>
      </div>
      <div className="boot-bottom shell">
        <ol className="boot-log">
          {lines.map((line, index) => (
            <li key={line} style={{ "--i": index } as React.CSSProperties}>
              <span>$</span> {line}
            </li>
          ))}
        </ol>
        <span className="boot-count" />
      </div>
      <span className="boot-bar" />
    </div>
  );
}
