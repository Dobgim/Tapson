import { Mail, Phone, Trash2 } from "lucide-react";
import { Badge } from "./ui";
import { setLeadStatusAction, deleteLeadAction } from "@/lib/admin/actions";
import type { Lead, LeadStatus } from "@/lib/admin/store";

const NEXT: { status: LeadStatus; label: string }[] = [
  { status: "new", label: "New" },
  { status: "contacted", label: "Contacted" },
  { status: "won", label: "Won" },
  { status: "closed", label: "Closed" },
];

export function LeadRow({ lead }: { lead: Lead }) {
  return (
    <li className="px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-ink-900">{lead.name}</p>
            <Badge tone={lead.status}>{lead.status}</Badge>
            <span className="font-display text-[0.625rem] uppercase tracking-[0.12em] text-ink-400">
              {lead.kind.replace(/-/g, " ")}
            </span>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500">
            <a
              href={`mailto:${lead.email}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-accent-500"
            >
              <Mail aria-hidden className="size-3.5" />
              {lead.email}
            </a>
            {lead.phone && (
              <a
                href={`tel:${lead.phone.replace(/\D/g, "")}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-accent-500"
              >
                <Phone aria-hidden className="size-3.5" />
                {lead.phone}
              </a>
            )}
            <span className="text-ink-400">{lead.reference}</span>
          </div>

          {lead.message && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">{lead.message}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <time
            dateTime={lead.createdAt}
            className="text-[0.6875rem] text-ink-400"
            suppressHydrationWarning
          >
            {new Date(lead.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </time>
          <form action={deleteLeadAction}>
            <input type="hidden" name="id" value={lead.id} />
            <button
              type="submit"
              aria-label={`Delete enquiry from ${lead.name}`}
              className="rounded-md p-2 text-ink-400 transition-colors hover:bg-accent-500/10 hover:text-accent-500"
            >
              <Trash2 aria-hidden className="size-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Status is a plain form post, so it works without client JS. */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {NEXT.map(({ status, label }) => (
          <form key={status} action={setLeadStatusAction}>
            <input type="hidden" name="id" value={lead.id} />
            <input type="hidden" name="status" value={status} />
            <button
              type="submit"
              disabled={lead.status === status}
              className={
                lead.status === status
                  ? "cursor-default rounded-md bg-ink-900 px-2.5 py-1 font-display text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-white"
                  : "rounded-md border border-ink-200 px-2.5 py-1 font-display text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-ink-500 transition-colors hover:border-ink-400 hover:text-ink-900"
              }
            >
              {label}
            </button>
          </form>
        ))}
      </div>
    </li>
  );
}
