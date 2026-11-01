
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { use } from "react";

interface Book {
  _id: string;
  coverImage: string;
  category: string;
  title: string;
  author: string;
  description?: string;
  name?: string;
  email?: string;
  copies?: number;
}

const BookDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const hasAddedBy = book?.name || book?.email;

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch("http://localhost:8000/books");

        if (!res.ok) {
          throw new Error("Failed to fetch books");
        }

        const data: Book[] = await res.json();
        const found = data.find((b) => b._id === id);

        if (!found) {
          setNotFound(true);
        } else {
          setBook(found);
        }
      } catch (error) {
        console.error(error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return <p className="py-10 text-center">Loading book...</p>;
  }

  if (notFound || !book) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 text-center">
        <h1 className="mb-4 font-serif text-3xl font-bold">
          Book Not Found
        </h1>
        <p className="mb-6 text-foreground/70">
          The book you are looking for does not exist.
        </p>
        <Link
          href="/all-books"
          className="inline-block rounded-lg bg-green-400 px-6 py-2.5 font-semibold text-background transition hover:bg-green-300"
        >
          Back to all books
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid items-start gap-10 md:grid-cols-2">
        {/* Cover */}
        <div className="mx-auto w-full max-w-md">
          <img
            src={book.coverImage}
            alt={book.title}
            className="aspect-[2/3] w-full rounded-lg object-cover shadow-lg"
          />
        </div>

        {/* Info */}
        <div>
          <span className="inline-block rounded-full bg-foreground/10 px-3 py-1 text-xs font-semibold text-foreground/90">
            {book.category}
          </span>

          <h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">
            {book.title}
          </h1>

          <p className="mt-3 text-foreground/70">by {book.author}</p>

          {book.description && (
            <p className="mt-6 text-[15px] leading-relaxed text-foreground">
              {book.description}
            </p>
          )}

          {(hasAddedBy || book.copies !== undefined) && (
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-foreground/5 p-4">
              {hasAddedBy && (
                <div>
                  <p className="text-xs text-foreground/60">Added by</p>
                  <p className="mt-1 text-sm font-semibold">{book.name}</p>
                  {book.email && (
                    <p className="mt-1 text-xs text-foreground/60">
                      {book.email}
                    </p>
                  )}
                </div>
              )}

              {book.copies !== undefined && (
                <div>
                  <p className="text-xs text-foreground/60">Copies left</p>
                  <p className="mt-1 text-sm font-semibold">{book.copies}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <button className="rounded-lg bg-green-400 px-4 py-2 text-sm font-semibold text-background transition hover:bg-green-300">
              Borrow This Book
            </button>

            <Link
              href="/all-books"
              className="text-sm text-foreground/80 transition hover:text-foreground"
            >
              Back to all books
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookDetails;
