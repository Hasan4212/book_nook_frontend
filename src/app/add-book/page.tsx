
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { authorizedFetch } from "@/lib/api";
import { useToast } from "@/components/Toast";

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
];

export default function AddBookPage() {
  const router = useRouter();
  const { toast } = useToast();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [copies, setCopies] = useState(1);
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect to sign in if a guest tries to open this page
  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/signin");
    }
  }, [isPending, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("You must be signed in to add a book.");
      toast.error("You must be signed in to add a book.");
      return;
    }

    try {
      setLoading(true);

      // Convert the chosen cover image to a base64 data URL
      const coverImage = image
        ? await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Failed to read image"));
            reader.readAsDataURL(image);
          })
        : "";

      const res = await authorizedFetch( `${process.env.NEXT_PUBLIC_API_URL}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          category,
          copies,
          description,
          coverImage,
          name: user.name,
          email: user.email,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add the book");
      }

      toast.success(`"${title.trim()}" was added to the library!`);

      router.push("/my-books");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error && err.message !== "Failed to fetch"
          ? err.message
          : "Something went wrong. Please try again."
      );
      toast.error("Failed to add the book. Please try again.");
    } finally {
      setLoading(false);
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
        <h1 className="font-serif text-3xl font-bold text-[#a7d7a8]">
          Add a Book
        </h1>
        <p className="mt-1.5 text-sm text-foreground/60">
          Put a book from your shelf into the library.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-md px-4 py-10"
      >
        {error && (
          <p className="mb-5 rounded-lg bg-[#ef8b69]/15 px-4 py-2.5 text-sm text-[#ef8b69]">
            {error}
          </p>
        )}

        <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
          {/* Book Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-1.5 block text-sm font-medium text-foreground/80"
            >
              Book Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-foreground focus:border-[#8fd0a0] focus:outline-none"
            />
          </div>

          {/* Author Name */}
          <div>
            <label
              htmlFor="author"
              className="mb-1.5 block text-sm font-medium text-foreground/80"
            >
              Author Name
            </label>
            <input
              id="author"
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-foreground focus:border-[#8fd0a0] focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="mb-1.5 block text-sm font-medium text-foreground/80"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full cursor-pointer rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-foreground focus:border-[#8fd0a0] focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#16251d]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Total Copies */}
          <div>
            <label
              htmlFor="copies"
              className="mb-1.5 block text-sm font-medium text-foreground/80"
            >
              Total Copies
            </label>
            <input
              id="copies"
              type="number"
              min={1}
              required
              value={copies}
              onChange={(e) => setCopies(Number(e.target.value))}
              className="w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-foreground focus:border-[#8fd0a0] focus:outline-none"
            />
          </div>

          {/* Book Image */}
          <div className="sm:col-span-2">
            <label
              htmlFor="image"
              className="mb-1.5 block text-sm font-medium text-foreground/80"
            >
              Book Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="block w-full cursor-pointer rounded-lg border border-white/15 bg-black/20 px-3 py-1.5 text-sm text-foreground file:cursor-pointer file:mr-3 file:rounded file:border-0 file:bg-black/30 file:px-3 file:py-1 file:text-sm file:text-foreground/80 hover:file:text-foreground focus:border-[#8fd0a0] focus:outline-none"
            />
          </div>

          {/* Short Description */}
          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-medium text-foreground/80"
            >
              Short Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-foreground focus:border-[#8fd0a0] focus:outline-none"
            />
          </div>

          {/* User Name (from session, read-only) */}
          <div>
            <label
              htmlFor="userName"
              className="mb-1.5 block text-sm font-medium text-foreground/80"
            >
              User Name
            </label>
            <input
              id="userName"
              type="text"
              readOnly
              value={user.name || ""}
              className="w-full cursor-not-allowed rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-foreground/90 focus:outline-none"
            />
          </div>

          {/* User Email (from session, read-only) */}
          <div>
            <label
              htmlFor="userEmail"
              className="mb-1.5 block text-sm font-medium text-foreground/80"
            >
              User Email
            </label>
            <input
              id="userEmail"
              type="email"
              readOnly
              value={user.email || ""}
              className="w-full cursor-not-allowed rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-foreground/90 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-[#8fd0a0] px-4 py-2.5 text-sm font-semibold text-[#122a1f] transition hover:bg-[#a5dfb3] disabled:opacity-50"
        >
          {loading ? "Adding Book..." : "Add Book"}
        </button>
      </form>
    </main>
  );
}
