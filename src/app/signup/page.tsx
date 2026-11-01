
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { error: signUpError } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (signUpError) {
        setError("Could not create your account. Maybe this email is already registered.");
        return;
      }

      router.push("/signin");
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
        <h1 className="font-serif text-3xl font-bold">Create Account</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Join BookNook — borrow, read, return. Repeat.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-[#ef8b69]/15 px-4 py-2.5 text-sm text-[#ef8b69]">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-foreground/80"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Austen"
              className="w-full rounded-lg border border-white/15 bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-[#8fd0a0] focus:outline-none"
            />
          </div>

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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-lg border border-white/15 bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-[#8fd0a0] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-foreground/80"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              className="w-full rounded-lg border border-white/15 bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-[#8fd0a0] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#8fd0a0] px-4 py-2.5 text-sm font-semibold text-[#122a1f] transition hover:bg-[#a5dfb3] disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground/60">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-[#8fd0a0] hover:text-[#a5dfb3]"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
