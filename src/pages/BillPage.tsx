// עמוד הצעת חוק - the full bill page ( the product's core ).
//
// Layout ( RTL ): breadcrumb on top, then two columns - the
// editorial main column on the right, the meta side rail on
// the left ( Phase 7 ).
//
// useParams reads the ":id" piece of the URL /bill/:id, and we
// look the bill up by that slug.
import { Link, useParams } from "react-router-dom";
import { Mic } from "lucide-react";
import { BillSections } from "@/components/bill-page/BillSections";
import { BillSideRail } from "@/components/bill-page/BillSideRail";
import { Breadcrumb } from "@/components/bill-page/Breadcrumb";
import { RichText } from "@/components/shared/RichText";
import { getBill } from "@/content/bills";

export function BillPage() {
  const { id } = useParams();
  const bill = id ? getBill(id) : undefined;

  // A friendly dead-end for a wrong / outdated link.
  if (!bill) {
    return (
      <div className="space-y-4 py-16 text-center">
        <h1 className="text-h2 text-primary">לא מצאנו את הצעת החוק הזאת</h1>
        <p className="text-p text-muted-foreground">
          ייתכן שהקישור השתנה או שההצעה הוסרה.
        </p>
        <Link to="/" className="text-p text-accent underline underline-offset-4">
          חזרה לכל הצעות החוק
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <Breadcrumb />

      <div className="flex items-start gap-10">
        {/* Main editorial column */}
        <div className="min-w-0 flex-1 space-y-7">
          <h1 className="text-h1 text-primary">
            {bill.name}
            {bill.subtitle && (
              <>
                : <span className="font-normal">{bill.subtitle}</span>
              </>
            )}
          </h1>

          <p className="text-lead">
            <RichText text={bill.intro ?? bill.summary} />
          </p>

          {/* The podcast is a designed future feature - the
              button keeps its place, politely. */}
          <button
            className="flex items-center gap-2 rounded-full border border-primary/40 px-4 py-1.5 text-small text-primary"
            title="בקרוב"
          >
            <Mic className="size-4" />
            <span>ספרו לי על ההצעה בפודקאסט</span>
          </button>

          {bill.sections ? (
            <BillSections bill={bill} />
          ) : (
            <p className="rounded-2xl bg-muted p-5 text-p font-normal text-muted-foreground">
              העמוד המפורט של הצעת החוק הזאת עוד בכתיבה. בינתיים אפשר לעקוב אחרי
              ההתקדמות שלה בסרגל הצד.
            </p>
          )}
        </div>

        {/* Meta side rail: follow, type, leaders, committee,
            and the stage-by-stage progress. */}
        <BillSideRail bill={bill} />
      </div>
    </div>
  );
}
