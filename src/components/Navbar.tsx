
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";
import { useToast } from "./Toast";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/all-books" },
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrow" },
];

function BookLogo() {
  return (
    <span className="grid size-8 place-items-center rounded-lg bg-[#8fd0a0]">
      <svg
        className="size-5 text-[#122a1f]"
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
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await authClient.signOut();

      setMenuOpen(false);

      toast.success("You have been logged out. See you soon!");

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);

      toast.error("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const user = session?.user;

  return (
    <header className="relative z-50 w-full bg-[#16251d]">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center gap-8 px-6">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <BookLogo />
          <span className="font-serif text-xl font-semibold text-white">
            BookNook
          </span>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-3">

          {!isPending && !user && (
            <>
              <Link
                href="/signin"
                className="rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-[#8fd0a0] px-4 py-2 text-sm font-semibold text-[#122a1f] transition hover:bg-[#a5dfb3]"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Logged In User */}
          {!isPending && user && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-white/20 py-1 pl-1 pr-3 transition hover:bg-white/10"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    className="size-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid size-9 place-items-center rounded-full bg-[#8fd0a0] font-semibold text-[#122a1f]">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}

                <span className="max-w-28 truncate text-sm text-white">
                  {user.name || "User"}
                </span>

                <svg
                  className="size-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-56 rounded-lg bg-white py-2 text-[#122a1f] shadow-xl">

                  <div className="border-b border-gray-100 px-4 pb-3">
                    <p className="truncate text-sm font-semibold">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm transition hover:bg-gray-100"
                  >
                    My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="mx-2 mt-1 w-[calc(100%-1rem)] rounded-md bg-[#ef8b69] px-4 py-2 text-sm text-white transition hover:bg-[#e87c58] disabled:opacity-50"
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          )}

          {isPending && (
            <span className="text-sm text-white/60">
              Loading...
            </span>
          )}

        </div>
      </nav>
    </header>
  );
}


