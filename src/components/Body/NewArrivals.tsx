
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

const NewArrivals = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books?limit=10`);

        if (!res.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <p className="py-10 text-center">Loading books...</p>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="mb-8 text-3xl font-bold">
        New Arrivals
      </h2>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
        {books.map((book) => (
          <div
            key={book._id}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <img
              src={book.coverImage}
              alt={book.title}
              className="h-56 w-full rounded-lg object-cover"
            />

            <p className="mt-3 text-sm text-gray-500">
              {book.category}
            </p>

            <h3 className="mt-1 font-semibold text-gray-900">
              {book.title}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {book.author}
            </p>

            {/* View Details Button */}
            <Link
              href={`/books/${book._id}`}
              className="mt-auto mt-4 block rounded-lg bg-blue-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/all-books"
          className="inline-block rounded-lg bg-blue-900 px-8 py-3 font-semibold text-white transition hover:bg-blue-800"
        >
          View All Books
        </Link>
      </div>
    </section>
  );
};

export default NewArrivals;
