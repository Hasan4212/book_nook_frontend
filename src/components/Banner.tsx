
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDES = [
  {
    src: "/Images/banner-2.jpg",
    alt: "Beautiful stacked books on a table",
    title: "Borrow, read,",
    highlight: "return. Repeat.",
    description:
      "Discover your next favorite book. Borrow, enjoy reading, and return it with ease.",
  },
  {
    src: "/Images/banner-3.jpg",
    alt: "An open book with beautifully arranged pages",
    title: "Every book has",
    highlight: "a new story.",
    description:
      "Explore inspiring stories, discover new ideas, and let every page take you somewhere new.",
  },
  {
    src: "/Images/banner-image.jpg",
    alt: "Beautiful curved bookshelves in a library",
    title: "Your next chapter",
    highlight: "starts here.",
    description:
      "A world of knowledge and imagination is waiting. Find the perfect book for your next adventure.",
  },
];

// Slider settings
const SLIDE_INTERVAL = 9000;
const SLIDE_DURATION = 3000;

export default function Banner() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto Slide
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Previous Slide
  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? SLIDES.length - 1 : prev - 1
    );
  };

  // Next Slide
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  // Go to selected slide
  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  return (
    <section
      className="group relative isolate w-full overflow-hidden bg-[#0d1a14]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
      aria-roledescription="carousel"
      aria-label="Book Nook featured books"
    >
      {/* Slider Track */}
      <div
        className="flex w-full ease-in-out motion-reduce:transition-none"
        style={{
          transform: `translate3d(-${current * 100}%, 0, 0)`,
          transitionProperty: "transform",
          transitionDuration: `${SLIDE_DURATION}ms`,
        }}
      >
        {SLIDES.map((slide, index) => (
          <div
            key={slide.src}
            className="relative min-w-full shrink-0"
            aria-hidden={current !== index}
          >
            <div className="relative h-[480px] w-full sm:h-[540px] lg:h-[600px]">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                draggable={false}
                className="object-cover object-center"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#081b13]/95 via-[#081b13]/65 to-[#081b13]/20" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#081b13]/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
          <div
            key={current}
            className="max-w-2xl animate-[fadeIn_700ms_ease-in-out]"
          >
            <p className="mb-5 text-xs font-bold tracking-[0.4em] text-[#ef9a78] sm:text-sm">
              BOOK NOOK
            </p>

            <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {SLIDES[current].title}
              <br />
              <span className="text-[#9bd5a8]">
                {SLIDES[current].highlight}
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
              {SLIDES[current].description}
            </p>

            <Link
              href="/all-books"
              className="pointer-events-auto mt-8 inline-flex items-center gap-3 rounded-lg bg-[#91d3a1] px-7 py-3.5 text-sm font-bold text-[#10281b] shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#a9e4b5] hover:shadow-xl"
            >
              Browse Books
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Previous Button */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-2xl text-white backdrop-blur-sm transition hover:scale-110 hover:bg-[#91d3a1] hover:text-[#10281b] sm:left-6 sm:size-12"
      >
        &#8249;
      </button>

      {/* Next Button */}
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-2xl text-white backdrop-blur-sm transition hover:scale-110 hover:bg-[#91d3a1] hover:text-[#10281b] sm:right-6 sm:size-12"
      >
        &#8250;
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={current === index ? "true" : undefined}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-500 ${
              current === index
                ? "w-9 bg-[#91d3a1]"
                : "w-2 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-6 right-6 z-20 hidden items-center gap-2 text-sm font-medium text-white/80 sm:flex">
        <span className="text-[#91d3a1]">
          0{current + 1}
        </span>
        <span>/</span>
        <span>0{SLIDES.length}</span>
      </div>
    </section>
  );
}
