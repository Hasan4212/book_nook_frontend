"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Book {
  _id: string;
  coverImage: string;
  category: string;
  title: string;
  author: string;
}

const CategoryBooks = ({ category }: { category: string }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`);

        if (!res.ok) {
          throw new Error("Failed to fetch books");
        }

        const data: Book[] = await res.json();

        // The API has no category filter yet, so we filter client-side.
        const filtered = data.filter(
          (book) =>
            book.category?.toLowerCase() === category.toLowerCase()
        );

        setBooks(filtered);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category]);

  if (loading) {
    return <p className="py-10 text-center text-white/60">Loading books...</p>;
  }

  if (error) {
    return (
      <p className="py-10 text-center text-white/60">
        Failed to fetch books. Is the backend running on port 8000?
      </p>
    );
  }

  if (books.length === 0) {
    return (
      <p className="py-10 text-center text-white/60">
        No books found in this category yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
      {books.map((book) => (
        <div
          key={book._id}
          className="flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-3 shadow-sm transition hover:-translate-y-1 hover:border-[#8fd0a0]/50 hover:shadow-md"
        >
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-56 w-full rounded-lg object-cover"
          />

          <p className="mt-3 text-sm text-white/50">
            {book.category}
          </p>

          <h3 className="mt-1 font-semibold text-white">
            {book.title}
          </h3>

          <p className="mt-1 text-sm text-white/60">
            {book.author}
          </p>

          {/* View Details Button */}
          <Link
            href={`/books/${book._id}`}
            className="mt-auto block rounded-lg bg-[#8fd0a0] px-4 py-2.5 text-center text-sm font-semibold text-[#122a1f] transition hover:bg-[#a5dfb3]"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CategoryBooks;
