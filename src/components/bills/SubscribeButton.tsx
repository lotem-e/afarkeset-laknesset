// The follow control on cards and the bill page. Two looks:
// - not following: an outlined pill with a bell - "הרשמה לעדכונים"
// - following:     a quiet confirmation line with a check
// The button only ANNOUNCES the click; who remembers the
// choice ( Phase 5: the tracking store ) is not its business.
import { Bell, Check } from "lucide-react";

interface SubscribeButtonProps {
  subscribed: boolean;
  onToggle: () => void;
}

export function SubscribeButton({ subscribed, onToggle }: SubscribeButtonProps) {
  if (subscribed) {
    return (
      <button
        onClick={onToggle}
        className="group flex items-center gap-1.5 text-small text-foreground"
        title="ביטול הרשמה"
      >
        <Check className="size-4 text-stage-done-foreground" />
        <span className="group-hover:line-through">אתם רשומים לעדכונים לחוק זה</span>
      </button>
    );
  }
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 rounded-full border border-primary/40 px-3.5 py-1 text-small text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      <Bell className="size-3.5" />
      <span>הרשמה לעדכונים</span>
    </button>
  );
}
