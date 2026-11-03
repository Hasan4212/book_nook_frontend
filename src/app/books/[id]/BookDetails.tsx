
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { use } from "react";
import { authClient } from "@/lib/auth-client";
import { authorizedFetch } from "@/lib/api";
import { useToast } from "@/components/Toast";
import type { Borrow } from "@/app/my-borrow/types";

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

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const { toast } = useToast();

  const [alreadyBorrowed, setAlreadyBorrowed] = useState(false);
  const [borrowing, setBorrowing] = useState(false);
  const [borrowError, setBorrowError] = useState<string | null>(null);

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

        // Check whether the current user already borrowed this book
        if (found && user?.email) {
          const borrowsRes = await authorizedFetch("http://localhost:8000/borrows");

          if (borrowsRes.ok) {
            const borrowsData: Borrow[] = await borrowsRes.json();
            const mine = borrowsData.some(
              (b) => b.email === user.email && b.bookId === id
            );

            setAlreadyBorrowed(mine);
          }
        }
      } catch (error) {
        console.error(error);
        setNotFound(true);
        toast.error("Failed to load the book. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, isPending, user?.email, toast]);

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
          className="inline-block rounded-lg bg-[#8fd0a0] px-6 py-2.5 font-semibold text-[#122a1f] transition hover:bg-[#a5dfb3]"
        >
          Back to all books
        </Link>
      </main>
    );
  }

  const handleBorrow = async () => {
    if (!user || !book) {
      return;
    }

    try {
      setBorrowing(true);
      setBorrowError(null);

      const res = await authorizedFetch("http://localhost:8000/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book._id,
          title: book.title,
          author: book.author,
          category: book.category,
          coverImage: book.coverImage,
          name: user.name,
          email: user.email,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to borrow this book");
      }

      setAlreadyBorrowed(true);

      toast.success(`You borrowed "${book.title}". Happy reading!`);

      // Decrease the available copies of the borrowed book
      if (book.copies !== undefined) {
        const newCopies = Math.max(0, book.copies - 1);

        try {
          const putRes = await authorizedFetch(`http://localhost:8000/books/${book._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: book.title,
              author: book.author,
              category: book.category,
              description: book.description,
              coverImage: book.coverImage,
              name: book.name,
              email: book.email,
              copies: newCopies,
            }),
          });

          if (putRes.ok) {
            setBook({ ...book, copies: newCopies });
          }
        } catch (putErr) {
          console.error(putErr);
        }
      }
    } catch (err) {
      console.error(err);
      setBorrowError("Failed to borrow this book. Please try again.");
      toast.error("Failed to borrow this book. Please try again.");
    } finally {
      setBorrowing(false);
    }
  };

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

          <h1 className="mt-3 font-serif text-4xl font-bold md:text-[2.75rem]">
            {book.title}
          </h1>

          <p className="mt-3 text-foreground/70">by {book.author}</p>

          {book.description && (
            <p className="mt-6 text-[15px] leading-relaxed text-foreground">
              {book.description}
            </p>
          )}

          {(hasAddedBy || book.copies !== undefined) && (
            <div className="mt-6 flex flex-wrap items-start gap-x-14 gap-y-4 rounded-lg bg-white/[0.04] px-5 py-4">
              {hasAddedBy && (
                <div className="min-w-0">
                  <p className="text-xs text-foreground/60">Added by</p>
                  <p className="mt-1.5 truncate text-sm font-medium text-white">
                    {book.name}
                  </p>
                  {book.email && (
                    <p className="mt-0.5 truncate text-xs text-foreground/60">
                      {book.email}
                    </p>
                  )}
                </div>
              )}

              {book.copies !== undefined && (
                <div>
                  <p className="text-xs text-foreground/60">Copies left</p>
                  <p className="mt-1.5 text-sm font-medium text-white">
                    {book.copies}
                  </p>
                </div>
              )}
            </div>
          )}

          {borrowError && (
            <p className="mt-6 rounded-lg bg-[#ef8b69]/15 px-4 py-2.5 text-sm text-[#ef8b69]">
              {borrowError}
            </p>
          )}

          <div className="mt-6 flex items-center gap-4">
            {user ? (
              <button
                onClick={handleBorrow}
                disabled={book.copies === 0 || alreadyBorrowed || borrowing}
                className="cursor-pointer rounded-md bg-[#8fd0a0] px-4 py-2 text-sm font-semibold text-[#122a1f] transition hover:bg-[#a5dfb3] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {book.copies === 0
                  ? "No Copies Available"
                  : alreadyBorrowed
                    ? "Already Borrowed"
                    : borrowing
                      ? "Borrowing..."
                      : "Borrow This Book"}
              </button>
            ) : (
              <Link
                href="/signin"
                className="rounded-md bg-[#8fd0a0] px-4 py-2 text-sm font-semibold text-[#122a1f] transition hover:bg-[#a5dfb3]"
              >
                Sign In to Borrow
              </Link>
            )}

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
