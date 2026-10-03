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

/**
 * Server-rendered, dependency-free syntax highlighting for the X-ray layer.
 * The highlighted lines are injected as one static HTML string, so React has
 * hundreds fewer nodes to hydrate.
 */
export function CodeView({ file, code }: { file: string; code: string }) {
  const html = code
    .split("\n")
    .map(
      (line, i) =>
        `<span class="code-line"><span class="code-ln">${i + 1}</span>${tokenize(
          line,
        )
          .map((token) =>
            token.kind
              ? `<span class="tk-${token.kind}">${escape(token.text)}</span>`
              : escape(token.text),
          )
          .join("")}\n</span>`,
    )
    .join("");
  return (
    <div className="code-view">
      <div className="code-tab">
        <span className="code-dot" aria-hidden="true" />
        {file}
      </div>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
