import Link from "next/link";
import { ButtonLink, SlideArrow } from "@/components/ui/Button";
import { categories } from "@/data/categories";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[70svh] items-center overflow-hidden bg-ink-950 py-24 text-white">
      <div className="shell max-w-2xl">
        <p className="font-display text-[7rem] font-extrabold leading-none tracking-tighter text-accent-500 sm:text-[10rem]">
          404
        </p>
        <h1 className="display-lg mt-2 text-white">This one's already sold</h1>
        <p className="mt-5 text-base leading-relaxed text-white/60">
          The page you're after doesn't exist — or the unit moved off the floor. Start from the
          inventory and we'll find you something better.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/inventory" size="lg">
            Browse inventory
            <SlideArrow />
          </ButtonLink>
          <ButtonLink href="/" variant="light" size="lg">
            Back to home
          </ButtonLink>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="eyebrow mb-4 text-white/40">Or jump to a category</p>
          <ul className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/inventory?category=${c.slug}`}
                  className="inline-block rounded-full border border-white/20 px-3.5 py-1.5 text-sm text-white/70 transition-colors hover:border-accent-400 hover:bg-accent-500 hover:text-white"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
