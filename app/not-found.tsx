import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="not-found shell">
      <code className="command">
        <span aria-hidden="true">$ </span>git checkout this-page
      </code>
      <h1>error: pathspec did not match any file known to git.</h1>
      <p>This page doesn&apos;t exist — it may have been rebased away.</p>
      <Link className="button" href="/">
        Back to main
      </Link>
    </main>
  );
}
