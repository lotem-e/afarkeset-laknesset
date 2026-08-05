// Renders the tiny markup our Hebrew content uses:
//   [[l|טקסט]] -> an underlined reference ( a future link )
//   [[h|טקסט]] -> a highlighted phrase
//   [[b|טקסט]] -> bold
// Content stays readable plain text; the styling decision
// lives here, once.
//
// How the parsing works: the regex finds every [[x|...]]
// token; split() keeps the captured pieces, so the array
// alternates plain text, marker letter, marked text, plain
// text... and we walk it in steps of three.
import { Fragment } from "react";

const TOKEN = /\[\[([lhb])\|(.+?)\]\]/g;

export function RichText({ text }: { text: string }) {
  const parts = text.split(TOKEN);
  const out = [];
  for (let i = 0; i < parts.length; i += 3) {
    const plain = parts[i];
    if (plain) out.push(<Fragment key={i}>{plain}</Fragment>);
    const marker = parts[i + 1];
    const marked = parts[i + 2];
    if (marker && marked) {
      if (marker === "l")
        out.push(
          <span key={i + 1} className="underline decoration-primary/50 underline-offset-4">
            {marked}
          </span>,
        );
      else if (marker === "h")
        out.push(
          <mark key={i + 1} className="rounded bg-text-highlight px-0.5 text-foreground">
            {marked}
          </mark>,
        );
      else
        out.push(
          <strong key={i + 1} className="font-bold">
            {marked}
          </strong>,
        );
    }
  }
  return <>{out}</>;
}
