import { Suspense } from "react";
import Link from "next/link";
import CategoryBooks from "@/components/Body/CategoryBooks";

// Static fallback shown in the prerendered shell while the category
// name streams in (it comes from the URL, so it's request-time data).
function CategoryFallback() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
      <div className="mt-3 h-9 w-56 animate-pulse rounded bg-white/10" />
      <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-xl bg-white/5" />
        ))}
      </div>
    </main>
  );
}

async function CategoryContent({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const name = decodeURIComponent(category);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <p className="mb-2 text-sm text-white/60">Category</p>

      <h1 className="text-3xl font-bold text-white md:text-4xl">
        {name}
      </h1>

      <p className="mt-2 text-sm text-white/60">
        Books on this shelf, straight from the library.
      </p>

      <div className="mt-8">
        <CategoryBooks category={name} />
      </div>

      <div className="mt-10">
        <Link
          href="/all-books"
          className="text-sm text-[#8fd0a0] transition hover:text-[#a5dfb3]"
        >
          ← Back to All Books
        </Link>
      </div>
    </main>
  );
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return (
    <Suspense fallback={<CategoryFallback />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}
