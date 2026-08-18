"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { ButtonLink, SlideArrow } from "./ui/Button";
import { EASE } from "./motion/Reveal";
import { cn } from "@/lib/utils";

const SLIDE_MS = 6500;

const slides = [
  {
    image: "/images/hero/hero-1.webp",
    alt: "Stylised poster of a sport motorcycle against a Vermont sunset",
    eyebrow: "2025 arrivals are landing",
    title: ["Find your next", "adventure"],
    body: "Burlington, Vermont. Hundreds of units in stock across motorcycles, ATVs, side-by-sides, watercraft and boats.",
    primary: { label: "Shop inventory", href: "/inventory" },
    secondary: { label: "View specials", href: "/specials" },
  },
  {
    image: "/images/hero/hero-2.webp",
    alt: "Stylised poster of a personal watercraft on open water",
    eyebrow: "Watercraft season",
    title: ["Own the", "water"],
    body: "Sea-Doo and Yamaha WaveRunners in stock now, rigged with trailers and ready to launch the same day.",
    primary: { label: "Shop watercraft", href: "/inventory?category=watercraft" },
    secondary: { label: "Payment calculator", href: "/financing#calculator" },
  },
  {
    image: "/images/hero/hero-3.webp",
    alt: "Stylised poster of a side-by-side UTV on a desert trail",
    eyebrow: "Side-by-sides",
    title: ["Built for", "the trail"],
    body: "Can-Am, Polaris and CFMOTO UTVs, delivered with the accessories fitted and the first service already booked.",
    primary: { label: "Shop side-by-sides", href: "/inventory?category=side-by-sides" },
    secondary: { label: "Value my trade", href: "/trade-in" },
  },
  {
    image: "/images/hero/hero-4.webp",
    alt: "Stylised poster of a centre console boat offshore",
    eyebrow: "Marine department",
    title: ["Offshore", "ready"],
    body: "Boats, outboards and full marine service in house — rigging, repowers and winter storage prep.",
    primary: { label: "Shop boats", href: "/inventory?category=boats" },
    secondary: { label: "Marine service", href: "/service" },
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Parallax: art drifts slower than the copy, copy fades as it leaves.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const go = useCallback((next: number) => {
    setIndex((slides.length + next) % slides.length);
  }, []);

  useEffect(() => {
    if (!playing || reduced) return;
    const t = setTimeout(() => go(index + 1), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, playing, reduced, go]);

  const slide = slides[index];

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Featured departments"
      className="relative isolate flex min-h-[clamp(34rem,88svh,54rem)] items-end overflow-hidden bg-ink-950 text-white"
    >
      {/* Art layer */}
      <motion.div style={reduced ? undefined : { y: imageY }} className="absolute inset-0 -z-10 scale-110">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.image}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: reduced ? 1 : 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.1, ease: EASE },
              // Slow Ken Burns push that runs the length of the slide.
              scale: { duration: reduced ? 0 : SLIDE_MS / 1000 + 1.4, ease: "linear" },
            }}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(6,8,11,0.95)_0%,rgba(6,8,11,0.72)_38%,rgba(6,8,11,0.25)_70%,rgba(6,8,11,0.55)_100%)]"
      />

      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="shell relative w-full pb-14 pt-32 sm:pb-20 sm:pt-40"
      >
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
                exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
              }}
            >
              <motion.p
                variants={lineVariants(reduced)}
                className="eyebrow mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-3.5 py-1.5 text-white/85 backdrop-blur-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400" aria-hidden="true" />
                {slide.eyebrow}
              </motion.p>

              <h1 className="display-xl">
                {slide.title.map((line, i) => (
                  <span key={line} className="block overflow-hidden">
                    <motion.span
                      variants={lineVariants(reduced)}
                      className={cn("block", i === 1 && "text-accent-400")}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p
                variants={lineVariants(reduced)}
                className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
              >
                {slide.body}
              </motion.p>

              <motion.div variants={lineVariants(reduced)} className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href={slide.primary.href} size="lg">
                  {slide.primary.label}
                  <SlideArrow />
                </ButtonLink>
                <ButtonLink href={slide.secondary.href} variant="light" size="lg">
                  {slide.secondary.label}
                </ButtonLink>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-12 flex items-center gap-5 sm:mt-16">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous slide"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white/80 transition-all duration-300 hover:border-white hover:bg-white hover:text-ink-900"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next slide"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white/80 transition-all duration-300 hover:border-white hover:bg-white hover:text-ink-900"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              className="ml-1 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white/80 transition-all duration-300 hover:border-white hover:bg-white hover:text-ink-900"
            >
              {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>

          <ol className="flex flex-1 items-center gap-2" aria-label="Slides">
            {slides.map((s, i) => (
              <li key={s.image} className="flex-1 sm:max-w-24">
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}: ${s.eyebrow}`}
                  aria-current={i === index}
                  className="group/track block w-full py-3"
                >
                  <span className="relative block h-0.5 w-full overflow-hidden rounded-full bg-white/25">
                    {i === index && (
                      <motion.span
                        key={`${index}-${playing}`}
                        className="absolute inset-y-0 left-0 block bg-accent-400"
                        initial={{ width: reduced ? "100%" : "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: playing && !reduced ? SLIDE_MS / 1000 : 0,
                          ease: "linear",
                        }}
                      />
                    )}
                    {i < index && <span className="absolute inset-0 bg-white/60" />}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <p className="hidden font-display text-xs font-bold tracking-[0.2em] text-white/50 sm:block">
            {String(index + 1).padStart(2, "0")}
            <span className="mx-1 text-white/25">/</span>
            {String(slides.length).padStart(2, "0")}
          </p>
        </div>
      </motion.div>
    </section>
  );
}

function lineVariants(reduced: boolean | null) {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : "0.9em" },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
    exit: { opacity: 0, y: reduced ? 0 : "-0.5em", transition: { duration: 0.3, ease: EASE } },
  };
}
