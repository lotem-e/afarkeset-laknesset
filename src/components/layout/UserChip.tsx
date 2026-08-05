// The user's avatar chip, floating in the top corner opposite
// the sidebar ( the design shows it top-left; in RTL that is
// the "end" side ). Decorative in the MVP - there are no
// accounts, so it is a placeholder person.
export function UserChip() {
  return (
    <div className="fixed end-6 top-6 z-20">
      <div className="relative">
        <div className="flex size-11 items-center justify-center rounded-full bg-primary text-small font-bold text-primary-foreground shadow-md">
          ל
        </div>
        {/* The blue notification dot from the design */}
        <span className="absolute -end-0.5 -top-0.5 size-3 rounded-full bg-accent ring-2 ring-background" />
      </div>
    </div>
  );
}
