import { releases } from "../data/portfolio";

const branchColors = [
  "var(--tea)",
  "var(--leaf)",
  "var(--clay)",
  "var(--leaf)",
  "var(--tea)",
];

/**
 * A `git log --graph` of the products that reached production. Each row is a
 * branch that forked from `main`, picked up a commit and merged back. Pure SVG +
 * CSS: the strokes draw in once on load and nothing runs on the main thread.
 */
export function BranchGraph() {
  return (
    <figure className="graph-card" aria-labelledby="graph-caption">
      <div className="graph-bar">
        <span className="graph-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <code id="graph-caption">git log --graph main</code>
      </div>
      <ol className="graph-list">
        {releases.map((release, index) => {
          const platforms = release.deployments.map((d) =>
            d.platform.startsWith("Ministry") ? "Web" : d.platform,
          );
          return (
            <li
              key={release.name}
              className="graph-row"
              style={
                {
                  "--i": index,
                  "--branch": branchColors[index % branchColors.length],
                } as React.CSSProperties
              }
            >
              <svg
                className="graph-lane"
                viewBox="0 0 56 76"
                aria-hidden="true"
                focusable="false"
              >
                <path className="graph-main" d="M14 0V76" pathLength={1} />
                <path
                  className="graph-branch"
                  d="M14 70C14 56 40 58 40 44V34C40 20 14 22 14 10"
                  pathLength={1}
                />
                <circle className="graph-commit" cx="40" cy="39" r="4" />
                <circle className="graph-merge" cx="14" cy="10" r="6" />
              </svg>
              <div className="graph-text">
                <span className="graph-meta">
                  {index === 0 ? (
                    <span className="tag tag-head">HEAD → main</span>
                  ) : null}
                  <span className="tag">live</span>
                  <span>merge {release.project}</span>
                </span>
                <strong>{release.name}</strong>
                <span className="graph-platforms">
                  {[...new Set(platforms)].join(" · ")}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
