/**
 * PLACEHOLDER REVIEWS — not real customers.
 *
 * These are written to demonstrate the layout, and every name, quote and date
 * is invented. Publishing fabricated testimonials on a live business site is
 * deceptive advertising, so replace this list with genuine reviews before the
 * site goes public. Pull them from Google Business Profile, Facebook or your
 * own follow-up emails, with the customer's permission.
 *
 * Deliberately NOT wired to Review / AggregateRating structured data: emitting
 * star-rating schema for invented reviews misrepresents the business to search
 * engines. Once these are real, that markup is worth adding.
 */

export type Review = {
  id: string;
  body: string;
  name: string;
  /** What they bought or came in for, plus the store. */
  detail: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** ISO date — rendered as a readable month. */
  date: string;
  /**
   * Set true ONLY for a real review from a real customer.
   *
   * Star-rating structured data is emitted from verified entries alone.
   * Search engines treat fabricated review markup as a manual-action
   * offence, and it misrepresents the business to anyone reading a result.
   * Leave this unset while the entry is a placeholder.
   */
  verified?: boolean;
};

export const reviews: Review[] = [
  {
    id: "marcus-d",
    body: "Bought a Sea-Doo here after two other dealers told me I'd be waiting until next season. Had it on a trailer in four days, rigged, registered and with the first service already booked.",
    name: "Marcus D.",
    detail: "Sea-Doo RXT-X",
    rating: 5,
    date: "2026-06-14",
  },
  {
    id: "priya-r",
    body: "The service department is the reason I keep coming back. They found a wiring fault two other shops missed and charged me for one hour of diagnostic time.",
    name: "Priya R.",
    detail: "Service customer",
    rating: 5,
    date: "2026-05-28",
  },
  {
    id: "tony-v",
    body: "No pressure, no commission games. The salesman actually talked me out of the bigger machine and into the right one. Second unit I've bought from them.",
    name: "Tony V.",
    detail: "Polaris RANGER",
    rating: 5,
    date: "2026-05-09",
  },
  {
    id: "danielle-w",
    body: "First bike, and I was nervous about the whole thing. They sized me properly, walked me through the controls in the lot and never once made me feel like I was wasting their time.",
    name: "Danielle W.",
    detail: "Kawasaki Ninja 650",
    rating: 5,
    date: "2026-04-22",
  },
  {
    id: "owen-mcb",
    body: "Financing was the part I dreaded and it took about twenty minutes. They laid out three options with the real numbers on each, including the one that cost them the most.",
    name: "Owen McB.",
    detail: "Can-Am Outlander 850",
    rating: 5,
    date: "2026-04-03",
  },
  {
    id: "rosa-n",
    body: "Parts counter knew the part number off the top of his head from a description of the noise. Ordered Tuesday, fitted Thursday. That is rarer than it should be.",
    name: "Rosa N.",
    detail: "Parts & accessories",
    rating: 5,
    date: "2026-03-19",
  },
  {
    id: "gerald-p",
    body: "Traded a golf cart in and the number they quoted was the number I got. No renegotiating once the paperwork appeared, which is why I'll be back.",
    name: "Gerald P.",
    detail: "E-Z-GO trade-in",
    rating: 4,
    date: "2026-03-02",
  },
  {
    id: "steph-l",
    body: "Winter storage prep on the boat was thorough and they sent photos when it was done. Picked it up in spring and it started first turn.",
    name: "Steph L.",
    detail: "Marine service",
    rating: 5,
    date: "2026-02-11",
  },
];

/** Rounded to one decimal, e.g. 4.9 */
export const averageRating =
  Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10;

/** Only entries confirmed genuine. Placeholders never reach structured data. */
export const verifiedReviews = reviews.filter((r) => r.verified);

/**
 * schema.org aggregateRating + review nodes, or null when there is nothing
 * genuine to publish. Returning null keeps the markup off the page entirely
 * rather than emitting a zero-count rating, which search engines flag.
 *
 * This activates on its own: mark reviews `verified: true` as real ones come
 * in, and the star markup starts being emitted with no further code change.
 */
export function reviewSchema() {
  if (verifiedReviews.length === 0) return null;

  const total = verifiedReviews.reduce((sum, r) => sum + r.rating, 0);
  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Math.round((total / verifiedReviews.length) * 10) / 10,
      reviewCount: verifiedReviews.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: verifiedReviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      datePublished: r.date,
      reviewBody: r.body,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };
}
