// The friendly "nothing here" block, used when a list or a
// bill-page section has no data yet.
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  action?: ReactNode; // an optional link / button under the text
}

export function EmptyState({ title, action }: EmptyStateProps) {
  return (
    <div className="space-y-2 py-8 text-center">
      <p className="text-p text-muted-foreground">{title}</p>
      {action}
    </div>
  );
}
