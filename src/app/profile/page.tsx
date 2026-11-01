
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user;

  // Keep the page out of logged-out state
  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/signin");
    }
  }, [isPending, user, router]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await authClient.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  if (isPending) {
    return <p className="py-10 text-center">Loading profile...</p>;
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 text-center">
        <h1 className="mb-4 font-serif text-3xl font-bold">Profile</h1>
        <p className="mb-6 text-foreground/70">
          Please sign in to view your profile.
        </p>
        <Link
          href="/signin"
          className="inline-block rounded-lg bg-[#8fd0a0] px-6 py-2.5 font-semibold text-[#122a1f] transition hover:bg-[#a5dfb3]"
        >
          Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-2xl border border-white/10 bg-[#16251d] p-8 shadow-lg">
        <div className="flex items-center gap-5">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "Profile"}
              className="size-20 rounded-full object-cover"
            />
          ) : (
            <span className="grid size-20 place-items-center rounded-full bg-[#8fd0a0] font-serif text-3xl font-bold text-[#122a1f]">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </span>
          )}

          <div className="min-w-0">
            <h1 className="truncate font-serif text-3xl font-bold">
              {user.name || "User"}
            </h1>
            <p className="mt-1 truncate text-sm text-foreground/60">
              {user.email}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-3 text-sm">
          <div className="flex justify-between rounded-lg bg-foreground/5 px-4 py-3">
            <span className="text-foreground/60">Name</span>
            <span className="font-medium">{user.name || "—"}</span>
          </div>

          <div className="flex justify-between rounded-lg bg-foreground/5 px-4 py-3">
            <span className="text-foreground/60">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>

          {"createdAt" in user && user.createdAt && (
            <div className="flex justify-between rounded-lg bg-foreground/5 px-4 py-3">
              <span className="text-foreground/60">Member Since</span>
              <span className="font-medium">
                {new Date(
                  user.createdAt as string | number | Date
                ).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-lg bg-[#ef8b69] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e87c58] disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>

          <Link
            href="/"
            className="rounded-lg border border-white/20 px-6 py-2.5 text-sm font-semibold text-foreground/80 transition hover:bg-white/10"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
