const KEYWORDS = new Set(
  "abstract as async await break case catch class const continue default else export extends final for function if implements import in interface late new null override private protected public required return static super switch this throw try type var void while with yield true false".split(
    " ",
  ),
);

// Order matters: comments and strings win over everything inside them.
const TOKEN =
  /(\/\/[^\n]*|#[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(<\?php)|(\$[A-Za-z_]\w*)|(\b\d+(?:\.\d+)?\b)|(@\w+)|([A-Za-z_]\w*)(?=\s*[(<])|([A-Za-z_]\w*)/g;

type Token = { text: string; kind?: string };

function tokenize(code: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  for (const match of code.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) out.push({ text: code.slice(last, index) });
    const [
      text,
      comment,
      string,
      phpTag,
      variable,
      number,
      annotation,
      call,
      word,
    ] = match;
    const kind = comment
      ? "c"
      : string
        ? "s"
        : phpTag || annotation
          ? "k"
          : variable
            ? "v"
            : number
              ? "n"
              : call
                ? KEYWORDS.has(call)
                  ? "k"
                  : /^[A-Z]/.test(call)
                    ? "t"
                    : "f"
                : word && KEYWORDS.has(word)
                  ? "k"
                  : word && /^[A-Z]/.test(word)
                    ? "t"
                    : undefined;
    out.push({ text, kind });
    last = index + text.length;
  }
  if (last < code.length) out.push({ text: code.slice(last) });
  return out;
}

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const LANGUAGES: Record<string, string> = {
  tsx: "TypeScript React",
  ts: "TypeScript",
  dart: "Dart",
  php: "PHP",
  py: "Python",
};

/**
 * An editor window for a project's illustrative code: title bar with the file
 * tab, server-rendered syntax highlighting (one static HTML string, so React
 * has hundreds fewer nodes to hydrate) and a status bar. The font is sized in
 * CSS from the line count and longest line (`--lines`, `--cols`) so the whole
 * sample always fits the frame, from a phone card to the pinned stage.
 */
export function CodeView({
  file,
  code,
  theme = "dark",
}: {
  file: string;
  code: string;
  theme?: "dark" | "light";
}) {
  const lines = code.split("\n");
  const html = lines
    .map(
      (line, i) =>
        `<span class="code-line" style="--n:${i}"><span class="code-ln">${i + 1}</span>${tokenize(
          line,
        )
          .map((token) =>
            token.kind
              ? `<span class="tk-${token.kind}">${escape(token.text)}</span>`
              : escape(token.text),
          )
          .join("")}${i < lines.length - 1 ? "\n" : ""}</span>`,
    )
    .join("");
  const language = LANGUAGES[file.split(".").pop() ?? ""] ?? "Code";
  return (
    <div
      className={`code-view code-${theme}`}
      style={
        {
          "--lines": lines.length,
          "--cols": Math.max(...lines.map((line) => line.length)),
        } as React.CSSProperties
      }
    >
      <div className="code-bar">
        <span className="code-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="code-tab">
          <span className="code-dot" aria-hidden="true" />
          {file}
        </span>
      </div>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
      <div className="code-status">
        <span>{language}</span>
        <span>Illustrative sketch · real source on request</span>
      </div>
    </div>
  );
}
