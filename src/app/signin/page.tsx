
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
      });

      if (signInError) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#16251d] p-8 shadow-lg">
        <h1 className="font-serif text-3xl font-bold">Welcome Back</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Sign in to borrow and manage your books.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-[#ef8b69]/15 px-4 py-2.5 text-sm text-[#ef8b69]">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-foreground/80"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-white/15 bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-[#8fd0a0] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-foreground/80"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/15 bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-[#8fd0a0] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#8fd0a0] px-4 py-2.5 text-sm font-semibold text-[#122a1f] transition hover:bg-[#a5dfb3] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground/60">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#8fd0a0] hover:text-[#a5dfb3]"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
