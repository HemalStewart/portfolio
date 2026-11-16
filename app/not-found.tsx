import Link from "next/link";
import { FrameLabel, Stamp } from "./components/board/marks";

export default function NotFound() {
  return (
    <main id="main" className="not-found shell">
      <p>
        <FrameLabel who="design">404</FrameLabel>
      </p>
      <h1>
        Nothing pinned <em>here.</em>
      </h1>
      <p className="not-found-lede">
        This page isn&apos;t on the board — it may have been moved or taken
        down.
      </p>
      <Link className="btn btn-ink" href="/">
        Back to the board
      </Link>
      <Stamp className="not-found-stamp">Not found</Stamp>
    </main>
  );
}
