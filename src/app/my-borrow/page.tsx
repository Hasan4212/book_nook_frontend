
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/Toast";
import type { Book } from "../my-books/types";
import type { Borrow } from "./types";

export default function MyBorrowPage() {
  const router = useRouter();
  const { toast } = useToast();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [removingId, setRemovingId] = useState<string | null>(null);

  // Redirect guests
  // useEffect(() => {
  //   if (!isPending && !user) {
  //     router.replace("/signin");
  //   }
  // }, [isPending, user, router]);

  // Load the logged user's borrowed books (those stored with their email)
  useEffect(() => {
    if (isPending || !user?.email) {
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("http://localhost:8000/borrows");

        if (!res.ok) {
          throw new Error("Failed to fetch borrowed books");
        }

        const data: Borrow[] = await res.json();

        if (!cancelled) {
          setBorrows(data.filter((b) => b.email === user.email));
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError("Failed to load your borrowed books. Please try again.");
          toast.error("Failed to load your borrowed books. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isPending, user?.email, toast]);

  const handleRemove = async (borrow: Borrow) => {
    if (!window.confirm(`Remove "${borrow.title ?? "this book"}" from your borrows?`)) {
      return;
    }

    try {
      setRemovingId(borrow._id);

      const res = await fetch(`http://localhost:8000/borrow/${borrow._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to remove the borrowed book");
      }

      setBorrows((prev) => prev.filter((b) => b._id !== borrow._id));

      // Give the returned copy back to the book so it becomes
      // available again on the book details page
      if (borrow.bookId) {
        try {
          const booksRes = await fetch("http://localhost:8000/books");

          if (booksRes.ok) {
            const books: Book[] = await booksRes.json();
            const book = books.find((b) => b._id === borrow.bookId);

            if (book) {
              const restoredCopies = (book.copies ?? 0) + 1;

              const putRes = await fetch(
                `http://localhost:8000/books/${book._id}`,
                {
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
                    copies: restoredCopies,
                  }),
                }
              );

              if (!putRes.ok) {
                console.error("Failed to restore the book copies");
              }
            }
          }
        } catch (restoreErr) {
          console.error(restoreErr);
        }
      }

      toast.success(
        `"${borrow.title ?? "The book"}" was removed from your borrows.`
      );
    } catch (err) {
      console.error(err);
      setError("Failed to remove the borrowed book. Please try again.");
      toast.error("Failed to remove the borrowed book. Please try again.");
    } finally {
      setRemovingId(null);
    }
  };

  if (isPending || !user) {
    return (
      <main className="py-24 text-center text-foreground/60">
        Loading...
      </main>
    );
  }

  return (
    <main>
      {/* Page Header */}
      <div className="border-b border-white/10 bg-[#16251d] px-4 py-6 text-center">
        <h1 className="font-serif text-3xl font-bold text-[#f4f6f5]">
          My Borrows
        </h1>
        <p className="mt-1.5 text-sm text-foreground/60">
          Books you have borrowed from the library.
        </p>
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        {error && (
          <p className="mb-5 rounded-lg bg-[#ef8b69]/15 px-4 py-2.5 text-sm text-[#ef8b69]">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-16 text-center text-foreground/60">
            Loading borrowed books...
          </p>
        ) : borrows.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-foreground/60">
              You haven&apos;t borrowed any books yet.
            </p>
            <Link
              href="/all-books"
              className="mt-4 inline-block rounded-lg bg-[#8fd0a0] px-4 py-2.5 text-sm font-semibold text-[#122a1f] transition hover:bg-[#a5dfb3]"
            >
              Browse the Library
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#131f19]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-black/20 text-xs font-medium text-foreground/60">
                  <th scope="col" className="px-6 py-3.5">Book</th>
                  <th scope="col" className="px-4 py-3.5 text-right">Category</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {borrows.map((borrow) => (
                  <tr key={borrow._id} className="transition hover:bg-white/5">
                    {/* Cover + Title + Author */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {borrow.coverImage ? (
                          <img
                            src={borrow.coverImage}
                            alt={borrow.title ?? "Book cover"}
                            className="h-14 w-10 shrink-0 rounded-md object-cover"
                          />
                        ) : (
                          <span className="grid h-14 w-10 shrink-0 place-items-center rounded-md bg-black/40 text-foreground/40">
                            <svg
                              className="size-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            </svg>
                          </span>
                        )}

                        <div className="min-w-0">
                          <Link
                            href={borrow.bookId ? `/books/${borrow.bookId}` : "/all-books"}
                            className="block truncate font-semibold text-white transition hover:text-[#8fd0a0]"
                          >
                            {borrow.title || "Unknown Book"}
                          </Link>
                          <p className="mt-0.5 truncate text-sm text-foreground/50">
                            {borrow.author}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="whitespace-nowrap px-4 py-4 text-right text-foreground/70">
                      {borrow.category}
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemove(borrow)}
                          disabled={removingId === borrow._id}
                          className="cursor-pointer rounded-md bg-[#b34646] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#9e3d3d] disabled:opacity-50"
                        >
                          {removingId === borrow._id ? "..." : "Remove"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
