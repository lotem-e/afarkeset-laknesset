// The long-form text of a station or a special case: a list of
// TextBlock ( intro / bullets / paragraphs - the same shape the
// bill page uses ), every string rendered through RichText so
// content may carry [[b|..]] emphasis.
import { RichText } from "@/components/shared/RichText";
import type { TextBlock } from "@/content/types";

export function ProcessDetails({ blocks }: { blocks: TextBlock[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => (
        <div key={i} className="space-y-2">
          {block.intro && (
            <p className="text-p">
              <RichText text={block.intro} />
            </p>
          )}
          {block.bullets && (
            <ul className="list-disc space-y-1 ps-5 text-p">
              {block.bullets.map((bullet, j) => (
                <li key={j}>
                  <RichText text={bullet} />
                </li>
              ))}
            </ul>
          )}
          {block.paragraphs?.map((paragraph, j) => (
            <p key={j} className="text-p">
              <RichText text={paragraph} />
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
