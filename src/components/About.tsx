import Image from "next/image";
import { Counter } from "./motion/Counter";
import { Reveal } from "./motion/Reveal";
import { ButtonLink, SlideArrow } from "./ui/Button";

const stats = [
  { value: 20, suffix: "+", label: "Years in South Florida" },
  { value: 10000, suffix: "+", label: "Rides delivered" },
  { value: 3, suffix: "", label: "Stores, one inventory" },
  { value: 5, suffix: "-star", label: "Average service rating" },
];

export function About() {
  return (
    <section className="bg-white py-20 lg:py-28" aria-labelledby="about-heading">
      <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal direction="right" blur>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-900 shadow-lift-lg">
            <Image
              src="/images/dealership/showroom.webp"
              alt="Stylised artwork of the RIVA Motorsports showroom floor"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-ink-900">
              <Image
                src="/images/dealership/service.webp"
                alt="Stylised artwork of the service department"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-ink-900">
              <Image
                src="/images/dealership/marine.webp"
                alt="Stylised artwork of the marine department"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow mb-3 text-accent-500">About RIVA</p>
            <h2 id="about-heading" className="display-lg text-ink-900">
              Two decades of getting South Florida out on the water and into the dirt
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-600">
              <p>
                We started as a single store selling watercraft and outboards. Twenty years later
                we're three stores, nine departments and a shared inventory that moves between
                Miami, Key Largo and Pompano Beach so the unit you want is never at the wrong
                address for long.
              </p>
              <p>
                What hasn't changed is the way the place runs. The same technicians have been in the
                shop for a decade. The parts counter knows what actually fits. And nobody here works
                on a commission structure that rewards putting you on the wrong machine.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-ink-200 pt-8 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={0.08 * i}>
                <p className="font-display text-3xl font-extrabold tracking-tight text-ink-900">
                  <Counter to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-xs leading-snug text-ink-500">{stat.label}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/about" size="lg">
              Our story
              <SlideArrow />
            </ButtonLink>
            <ButtonLink href="/locations" variant="outline" size="lg">
              Visit a store
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
