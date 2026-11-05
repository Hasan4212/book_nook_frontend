
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { authorizedFetch } from "@/lib/api";
import { useToast } from "@/components/Toast";
import type { Book, EditFormState } from "./types";

const CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Novel",
  "Romance",
  "Drama",
  "Comedy",
  "History",
  "Fantasy",
  "Mystery",
  "Science",
];

export default function MyBooksPage() {
  const router = useRouter();
  const { toast } = useToast();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Edit modal state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormState | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [SavingEdit, setSavingEdit] = useState(false);

  // Redirect guests
  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/signin");
    }
  }, [isPending, user, router]);

  // Load the logged user's books (those added with their email)
  useEffect(() => {
    if (isPending || !user?.email) {
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`);

        if (!res.ok) {
          throw new Error("Failed to fetch books");
        }

        const data: Book[] = await res.json();

        if (!cancelled) {
          setBooks(data.filter((book) => book.email === user.email));
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError("Failed to load your books. Please try again.");
          toast.error("Failed to load your books. Please try again.");
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

  const handleDelete = async (book: Book) => {
    if (!window.confirm(`Delete "${book.title}" from the library?`)) {
      return;
    }

    try {
      setDeletingId(book._id);

      const res = await authorizedFetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${book._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete the book");
      }

      // Remove it from the list without refetching everything
      setBooks((prev) => prev.filter((b) => b._id !== book._id));

      toast.success(`"${book.title}" was deleted from your books.`);
    } catch (err) {
      console.error(err);
      setError("Failed to delete the book. Please try again.");
      toast.error("Failed to delete the book. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (book: Book) => {
    setEditingId(book._id);
    setNewImage(null);
    setEditForm({
      title: book.title,
      author: book.author,
      category: book.category,
      copies: book.copies ?? 1,
      description: book.description ?? "",
    });
  };

  const closeEditModal = () => {
    setEditingId(null);
    setEditForm(null);
    setNewImage(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingId || !editForm || !user) {
      return;
    }

    try {
      setSavingEdit(true);

      // Replace the cover only if a new image was picked
      let coverImage: string | undefined;
      if (newImage) {
        coverImage = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Failed to read image"));
          reader.readAsDataURL(newImage);
        });
      }

      const res = await authorizedFetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editForm, coverImage }),
      });

      if (!res.ok) {
        throw new Error("Failed to update the book");
      }

      const updated: Book = await res.json();

      setBooks((prev) =>
        prev.map((b) => (b._id === editingId ? { ...b, ...updated } : b))
      );

      toast.success(`"${editForm.title}" was updated successfully.`);

      closeEditModal();
    } catch (err) {
      console.error(err);
      setError("Failed to update the book. Please try again.");
      toast.error("Failed to update the book. Please try again.");
    } finally {
      setSavingEdit(false);
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
          My Books
        </h1>
        <p className="mt-1.5 text-sm text-foreground/60">
          Books you added to the library.
        </p>

        <Link
          href="/add-book"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#8fd0a0] px-4 py-2 text-sm font-semibold text-[#122a1f] transition hover:bg-[#a5dfb3]"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Book
        </Link>
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        {error && (
          <p className="mb-5 rounded-lg bg-[#ef8b69]/15 px-4 py-2.5 text-sm text-[#ef8b69]">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-16 text-center text-foreground/60">Loading books...</p>
        ) : books.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-foreground/60">You haven&apos;t added any books yet.</p>
            <Link
              href="/add-book"
              className="mt-4 inline-block rounded-lg bg-[#8fd0a0] px-4 py-2.5 text-sm font-semibold text-[#122a1f] transition hover:bg-[#a5dfb3]"
            >
              Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#131f19]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-black/20 text-xs font-medium text-foreground/60">
                  <th scope="col" className="px-6 py-3.5">Book</th>
                  <th scope="col" className="px-4 py-3.5 text-right">Category</th>
                  <th scope="col" className="px-4 py-3.5 text-right">Copies</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {books.map((book) => (
                  <tr key={book._id} className="transition hover:bg-white/5">
                    {/* Cover + Title + Author */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.title}
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
                          <p className="truncate font-semibold text-white">
                            {book.title}
                          </p>
                          <p className="mt-0.5 truncate text-sm text-foreground/50">
                            {book.author}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="whitespace-nowrap px-4 py-4 text-right text-foreground/70">
                      {book.category}
                    </td>

                    {/* Copies */}
                    <td className="whitespace-nowrap px-4 py-4 text-right text-foreground/70">
                      {book.copies ?? "-"}
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(book)}
                          className="cursor-pointer rounded-md border border-white/20 px-3 py-1.5 text-sm text-white transition hover:bg-white/10"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(book)}
                          disabled={deletingId === book._id}
                          className="cursor-pointer rounded-md bg-[#b34646] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#9e3d3d] disabled:opacity-50"
                        >
                          {deletingId === book._id ? "..." : "Delete"}
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

      {/* Edit Modal */}
      {editingId && editForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={closeEditModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#16251d] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold">Edit Book</h2>
                <p className="mt-1 text-sm text-foreground/60">
                  Update the details of your book.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="cursor-pointer rounded-lg p-1.5 text-foreground/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <svg
                  className="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="edit-title"
                  className="mb-1.5 block text-sm font-medium text-foreground/80"
                >
                  Book Title
                </label>
                <input
                  id="edit-title"
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-foreground focus:border-[#8fd0a0] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-author"
                  className="mb-1.5 block text-sm font-medium text-foreground/80"
                >
                  Author Name
                </label>
                <input
                  id="edit-author"
                  type="text"
                  required
                  value={editForm.author}
                  onChange={(e) =>
                    setEditForm({ ...editForm, author: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-foreground focus:border-[#8fd0a0] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edit-category"
                    className="mb-1.5 block text-sm font-medium text-foreground/80"
                  >
                    Category
                  </label>
                  <select
                    id="edit-category"
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full cursor-pointer rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-foreground focus:border-[#8fd0a0] focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#16251d]">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="edit-copies"
                    className="mb-1.5 block text-sm font-medium text-foreground/80"
                  >
                    Total Copies
                  </label>
                  <input
                    id="edit-copies"
                    type="number"
                    min={1}
                    required
                    value={editForm.copies}
                    onChange={(e) =>
                      setEditForm({ ...editForm, copies: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-foreground focus:border-[#8fd0a0] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-image"
                  className="mb-1.5 block text-sm font-medium text-foreground/80"
                >
                  Book Image{" "}
                  <span className="font-normal text-foreground/50">
                    (leave empty to keep the current one)
                  </span>
                </label>
                <input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImage(e.target.files?.[0] ?? null)}
                  className="block w-full cursor-pointer rounded-lg border border-white/15 bg-black/20 px-3 py-1.5 text-sm text-foreground file:cursor-pointer file:mr-3 file:rounded file:border-0 file:bg-black/30 file:px-3 file:py-1 file:text-sm file:text-foreground/80 hover:file:text-foreground focus:border-[#8fd0a0] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-description"
                  className="mb-1.5 block text-sm font-medium text-foreground/80"
                >
                  Short Description
                </label>
                <textarea
                  id="edit-description"
                  rows={3}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full resize-none rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-foreground focus:border-[#8fd0a0] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="cursor-pointer rounded-lg border border-white/20 px-4 py-2.5 text-sm text-white transition hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={SavingEdit}
                  className="cursor-pointer rounded-lg bg-[#8fd0a0] px-4 py-2.5 text-sm font-semibold text-[#122a1f] transition hover:bg-[#a5dfb3] disabled:opacity-50"
                >
                  {SavingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
