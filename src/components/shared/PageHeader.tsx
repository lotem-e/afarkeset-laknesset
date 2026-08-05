// The header every list page opens with: a big navy title, a
// gray count next to it ( "הצעות חוק על סדר היום / 513" ), and
// a one-line explanation of the page in simple Hebrew.
interface PageHeaderProps {
  title: string;
  count?: number;
  subtitle?: string;
}

export function PageHeader({ title, count, subtitle }: PageHeaderProps) {
  return (
    <header className="space-y-2">
      <div className="flex items-baseline gap-3">
        <h1 className="text-h1 text-primary">{title}</h1>
        {count !== undefined && (
          // dir="ltr" keeps "/ 513" reading left-to-right even
          // inside an RTL page.
          <span className="text-h2 font-normal text-muted-foreground" dir="ltr">
            / {count}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="max-w-2xl text-lead text-muted-foreground">{subtitle}</p>
      )}
    </header>
  );
}
