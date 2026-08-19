import { Quote, Star } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Stagger, StaggerItem } from "./motion/Reveal";
import { ButtonLink, SlideArrow } from "./ui/Button";
import { reviews, averageRating, type Review } from "@/data/reviews";
import { cn } from "@/lib/utils";

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          className={cn(
            "h-3.5 w-3.5",
            n <= rating ? "fill-accent-500 text-accent-500" : "fill-ink-200 text-ink-200",
          )}
        />
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-6 transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-ink-300 hover:shadow-lift">
      <div className="flex items-center justify-between gap-3">
        <Stars rating={review.rating} />
        <Quote aria-hidden="true" className="h-6 w-6 shrink-0 text-accent-500/20" />
      </div>

      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">
        {review.body}
      </blockquote>

      <figcaption className="mt-5 border-t border-ink-100 pt-4">
        <span className="block font-display text-sm font-extrabold uppercase tracking-[0.02em] text-ink-900">
          {review.name}
        </span>
        <span className="mt-0.5 block text-xs text-ink-400">
          {review.detail} ·{" "}
          <time dateTime={review.date}>
            {new Date(review.date).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </time>
        </span>
      </figcaption>
    </figure>
  );
}

export function Reviews() {
  return (
    <section className="border-t border-ink-200 bg-ink-50 py-20 lg:py-24" aria-labelledby="reviews-heading">
      <div className="shell">
        <SectionHeading
          id="reviews-heading"
          eyebrow="What customers say"
          title="Bought here, serviced here, came back"
          body="Reviews from the sales floor, the service desk and the parts counter."
          align="center"
        />

        <div className="mt-6 flex items-center justify-center gap-3">
          <Stars rating={Math.round(averageRating)} className="scale-110" />
          <span className="font-display text-sm font-extrabold text-ink-900">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-sm text-ink-400">from {reviews.length} reviews</span>
        </div>

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" step={0.05}>
          {reviews.map((review) => (
            <StaggerItem key={review.id} className="h-full">
              <ReviewCard review={review} />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-ink-500">
            Bought or serviced with us? We read every review that comes in.
          </p>
          <ButtonLink href="/contact" variant="outline" size="md">
            Get in touch
            <SlideArrow />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
