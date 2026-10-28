import type { ReactNode } from "react";

/** Inline formatting: **bold** text. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? <strong key={i}>{part.slice(2, -2)}</strong> : part
  );
}

/**
 * Renders an article written in simple plain text:
 * blank line = new paragraph, "## " = heading, "- " = bullet point, **text** = bold.
 */
export default function PostBody({ body }: { body: string }) {
  const blocks = body.replace(/\r\n/g, "\n").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="pbody">
      {blocks.map((b, i) => {
        const lines = b.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.length === 1 && /^#{2,3}\s/.test(lines[0])) return <h2 key={i}>{lines[0].replace(/^#{2,3}\s+/, "")}</h2>;
        if (lines.every((l) => /^[-*•]\s/.test(l))) {
          return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.replace(/^[-*•]\s+/, ""))}</li>)}</ul>;
        }
        return <p key={i}>{lines.map((l, j) => <span key={j}>{j > 0 ? <br /> : null}{inline(l)}</span>)}</p>;
      })}
    </div>
  );
}
