"use client";

import { useState } from "react";
import { CalendarClock, MessageSquare, Phone, Repeat2 } from "lucide-react";
import { Button, ButtonLink, SlideArrow } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { RequestInfoForm } from "./forms/RequestInfoForm";
import type { Location } from "@/data/site";

export function ProductActions({
  title,
  stockNumber,
  store,
}: {
  title: string;
  stockNumber: string;
  store?: Location;
}) {
  const [dialog, setDialog] = useState<"info" | "ride" | null>(null);

  return (
    <>
      <div className="space-y-2.5">
        <Button size="lg" className="w-full" onClick={() => setDialog("info")}>
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          Request information
          <SlideArrow />
        </Button>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <Button variant="outline" size="lg" onClick={() => setDialog("ride")}>
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
            Test ride
          </Button>
          <ButtonLink href="/financing#apply" variant="outline" size="lg">
            Get financing
          </ButtonLink>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <ButtonLink href="/trade-in" variant="ghost" size="lg" className="border border-ink-200">
            <Repeat2 className="h-4 w-4" aria-hidden="true" />
            Trade-in value
          </ButtonLink>
          {store && (
            <ButtonLink href={store.phoneHref} variant="ghost" size="lg" className="border border-ink-200">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {store.phone}
            </ButtonLink>
          )}
        </div>
      </div>

      <Modal
        open={dialog === "info"}
        onClose={() => setDialog(null)}
        title="Request information"
        description="Tell us what you'd like to know and we'll come back the same day."
      >
        <RequestInfoForm unit={title} stockNumber={stockNumber} kind="request-info" />
      </Modal>

      <Modal
        open={dialog === "ride"}
        onClose={() => setDialog(null)}
        title="Schedule a test ride"
        description="Bring a licence and we'll have it fuelled and waiting."
      >
        <RequestInfoForm unit={title} stockNumber={stockNumber} kind="test-ride" />
      </Modal>
    </>
  );
}
