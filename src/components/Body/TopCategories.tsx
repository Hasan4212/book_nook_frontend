"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Book {
  _id: string;
  category: string;
}

// Icons for the most common categories, in lucide-style path data.
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  fiction: <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />,
  science: <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />,
  history: (
    <>
      <line x1="3" x2="21" y1="21" y2="21" />
      <line x1="6" x2="6" y1="18" y2="11" />
      <line x1="10" x2="10" y1="18" y2="11" />
      <line x1="14" x2="14" y1="18" y2="11" />
      <line x1="18" x2="18" y1="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </>
  ),
  kids: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </>
  ),
  romance: <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />,
  fantasy: (
    <>
      <path d="M15 4V2" />
      <path d="M15 16v-2" />
      <path d="M8 9h2" />
      <path d="M20 9h2" />
      <path d="M17.8 11.8 19 13" />
      <path d="M15 9h.01" />
      <path d="M17.8 6.2 19 5" />
      <path d="m3 21 9-9" />
      <path d="M12.2 6.2 11 5" />
    </>
  ),
  biography: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  poetry: <path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.741a2 2 0 0 0-2.912-2.752l-6.779 6.163a2.09 2.09 0 0 0 2.121 3.918Z" />,
};

// Fallback icon for categories that don't have a dedicated one.
const FALLBACK_ICON = (
  <>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </>
);

// Show every category that appears on the shelves.

const TopCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8000/books");

        if (!res.ok) {
          throw new Error("Failed to fetch books");
        }

        const books: Book[] = await res.json();

        const unique = Array.from(
          new Set(books.map((book) => book.category).filter(Boolean))
        );

        setCategories(unique);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="w-full py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="font-serif text-4xl font-bold text-white">
            Top Categories
          </h2>
          <p className="mt-3 text-sm text-white/60">
            Pick a shelf and start reading.
          </p>
        </div>

        {/* Categories from the API */}
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {loading && (
            <p className="col-span-full text-center text-white/60">
              Loading categories...
            </p>
          )}

          {!loading && categories.length === 0 && (
            <p className="col-span-full text-center text-white/60">
              No categories found.
            </p>
          )}

          {!loading &&
            categories.map((category) => (
              <Link
                key={category}
                href={`/category/${encodeURIComponent(category)}`}
                className="group rounded-lg border border-white/10 bg-white/[0.03] px-6 py-8 text-center transition hover:-translate-y-1 hover:border-[#8fd0a0]/60 hover:bg-white/[0.06]"
              >
                <div className="mx-auto grid size-10 place-items-center text-[#8fd0a0] transition group-hover:scale-110">
                  <svg
                    className="size-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {CATEGORY_ICONS[category.toLowerCase()] ?? FALLBACK_ICON}
                  </svg>
                </div>

                <h3 className="mt-3 font-serif text-lg font-semibold text-white">
                  {category}
                </h3>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
};

export default TopCategories;
