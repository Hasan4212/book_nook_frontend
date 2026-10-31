import Image from "next/image";

const CAROUSEL_DOTS = [0, 1, 2, 3, 4];

export default function Banner() {
  return (
    <section className="relative min-h-[480px] w-full overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1920&q=80"
        alt="Curved shelves of books in a library"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a14]/90 via-[#0d1a14]/40 to-[#0d1a14]/10" />

      <div className="relative mx-auto flex min-h-[480px] max-w-7xl flex-col justify-center px-6 py-16">
        <p className="font-sans text-xs font-semibold tracking-[0.35em] text-[#ef8b69]">
          BOOKNOOK
        </p>

        <h1 className="mt-4 max-w-xl font-serif text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
          Borrow, read,
          <br />
          return. Repeat.
        </h1>

        <p className="mt-6 max-w-md text-sm text-white/75 sm:text-base">
          Seven days for every book. Return it with one click when you are
          done.
        </p>

        <a
          href="#all-books"
          className="mt-8 w-fit rounded-md bg-[#8fd0a0] px-5 py-2.5 text-sm font-medium text-[#122a1f] transition hover:bg-[#7cc290]"
        >
          Browse Books
        </a>
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {CAROUSEL_DOTS.map((dot) => (
          <span
            key={dot}
            className={`h-1.5 rounded-full transition-all ${
              dot === 0 ? "w-4 bg-[#ef8b69]" : "size-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
