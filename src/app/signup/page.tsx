
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/Toast";

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  // Google & GitHub Signup
  const handleSocialSignUp = async (provider: "google" | "github") => {
    try {
      setError(null);
      setSocialLoading(provider);

      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Social login failed. Please try again.");
        setError(error.message || "Social login failed. Please try again.");
        setSocialLoading(null);
      } else {
        toast.success("Account created. Welcome to BookNook!");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
      setSocialLoading(null);
    }
  };

  // Email & Password Signup
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const { error: signUpError } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        callbackURL: "/",
      });

      if (signUpError) {
        const message =
          signUpError.message ||
          "Could not create your account. Maybe this email is already registered.";

        setError(message);
        toast.error(message);
        return;
      }

      toast.success("Account created. Please sign in!");

      router.push("/signin");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#16251d] p-8 shadow-xl">

        {/* Heading */}
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-white">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-white/60">
            Join BookNook — borrow, read, return. Repeat.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-5 rounded-lg border border-[#ef8b69]/20 bg-[#ef8b69]/10 px-4 py-3 text-sm text-[#ef8b69]">
            {error}
          </p>
        )}

        {/* Social Signup */}
        <div className="mt-7 space-y-3">

          {/* Google */}
          <button
            type="button"
            onClick={() => handleSocialSignUp("google")}
            disabled={!!socialLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg viewBox="0 0 48 48" className="h-5 w-5">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.96 46.98 31.84 46.98 24.55Z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.9 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
              />
            </svg>

            {socialLoading === "google"
              ? "Connecting..."
              : "Continue with Google"}
          </button>

          {/* GitHub */}
          <button
            type="button"
            onClick={() => handleSocialSignUp("github")}
            disabled={!!socialLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-[#24292f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#32383f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.62-2.8 5.65-5.48 5.95.43.37.81 1.1.81 2.22v3.32c0 .32.22.69.82.57A12 12 0 0 0 12 .5Z"
              />
            </svg>

            {socialLoading === "github"
              ? "Connecting..."
              : "Continue with GitHub"}
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/15" />
          <span className="text-xs text-white/40">
            OR SIGN UP WITH EMAIL
          </span>
          <div className="h-px flex-1 bg-white/15" />
        </div>

        {/* Email Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-white/80"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Austen"
              className="w-full rounded-lg border border-white/15 bg-black/20 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#8fd0a0] focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-white/80"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-white/15 bg-black/20 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#8fd0a0] focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-white/80"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-lg border border-white/15 bg-black/20 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#8fd0a0] focus:outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-white/80"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              className="w-full rounded-lg border border-white/15 bg-black/20 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#8fd0a0] focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !!socialLoading}
            className="w-full rounded-lg bg-[#8fd0a0] px-4 py-3 text-sm font-bold text-[#122a1f] transition hover:bg-[#a5dfb3] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="mt-6 text-center text-sm text-white/60">
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
