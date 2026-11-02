
"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sync profile data when the actual user data changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImage(user.image || "");
    }
  }, [user?.id, user?.name, user?.image]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/signin");
    }
  }, [isPending, user, router]);

  // Cleanup image preview URL
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Convert image to Base64
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Image conversion failed."));
        }
      };

      reader.onerror = () => {
        reject(new Error("Unable to read image."));
      };
    });
  };

  // Select image from computer
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG or WEBP image.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Remove profile image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview("");
    setImage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setName(user?.name || "");
    setImage(user?.image || "");
    setSelectedFile(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setEditing(false);
    setError("");
    setSuccess("");
  };

  // Update profile
  const handleUpdateProfile = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Name cannot be empty.");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    try {
      setSaving(true);

      let finalImage = image;

      // Convert selected image to Base64
      if (selectedFile) {
        finalImage = await convertImageToBase64(selectedFile);
      }

      // Update Better Auth user
      const { error: updateError } = await authClient.updateUser({
        name: trimmedName,
        image: finalImage || null,
      });

      if (updateError) {
        throw new Error(
          updateError.message || "Profile update failed."
        );
      }

      // Update local state
      setName(trimmedName);
      setImage(finalImage);
      setSelectedFile(null);
      setPreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setEditing(false);
      setSuccess("Your profile has been updated successfully!");

      // Refresh session and page
      await authClient.getSession();
      router.refresh();

    } catch (err) {
      console.error("Profile update error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      setError("");

      const { error: logoutError } = await authClient.signOut();

      if (logoutError) {
        throw new Error(
          logoutError.message || "Logout failed."
        );
      }

      router.replace("/");
      router.refresh();

    } catch (err) {
      console.error("Logout error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to logout. Please try again."
      );
    } finally {
      setLoggingOut(false);
    }
  };

  // Loading screen
  if (isPending) {
    return (
      <main className="grid min-h-[70vh] place-items-center">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-[#8fd0a0]/20 border-t-[#8fd0a0]" />

          <p className="mt-4 text-sm text-foreground/60">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  const displayImage = preview || image;

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8fd0a0]">
            Account Settings
          </p>

          <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-foreground/60">
            Manage your personal information and account settings.
          </p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#16251d] shadow-xl">

          {/* Cover */}
          <div className="relative h-32 overflow-hidden bg-gradient-to-r from-[#193b2b] via-[#28563d] to-[#16251d] sm:h-40">
            <div className="absolute -right-10 -top-20 size-64 rounded-full border-[30px] border-[#8fd0a0]/20" />

            <div className="absolute bottom-4 left-6">
              <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-medium text-white">
                BookNook Member
              </span>
            </div>
          </div>

          <div className="px-6 pb-8 sm:px-8">

            {/* Avatar and Name */}
            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div className="flex items-end gap-4">

                {displayImage ? (
                  <img
                    src={displayImage}
                    alt="Profile"
                    className="size-28 shrink-0 rounded-2xl border-4 border-[#16251d] bg-[#243a2c] object-cover shadow-lg"
                  />
                ) : (
                  <div className="grid size-28 shrink-0 place-items-center rounded-2xl border-4 border-[#16251d] bg-[#8fd0a0] font-serif text-4xl font-bold text-[#122a1f] shadow-lg">
                    {name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                <div className="mb-2 min-w-0">
                  <h2 className="truncate font-serif text-2xl font-bold">
                    {user.name || "User"}
                  </h2>

                  <p className="mt-1 truncate text-sm text-foreground/60">
                    {user.email}
                  </p>
                </div>
              </div>

              {!editing && (
                <button
                  type="button"
                  onClick={() => {
                    setName(user.name || "");
                    setImage(user.image || "");
                    setEditing(true);
                    setError("");
                    setSuccess("");
                  }}
                  className="rounded-lg bg-[#8fd0a0] px-5 py-2.5 text-sm font-semibold text-[#122a1f] transition hover:bg-[#a5dfb3]"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-6 rounded-lg border border-[#8fd0a0]/20 bg-[#8fd0a0]/10 px-4 py-3 text-sm text-[#8fd0a0]">
                {success}
              </div>
            )}

            {/* Edit Form */}
            {editing ? (
              <form
                onSubmit={handleUpdateProfile}
                className="mt-8 space-y-6"
              >
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold">
                    Edit Your Profile
                  </h3>

                  <p className="mt-1 text-sm text-foreground/50">
                    Update your personal information.
                  </p>
                </div>

                {/* Profile Image */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-foreground/80">
                    Profile Picture
                  </label>

                  <div className="flex flex-col gap-5 rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center">

                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt="Image preview"
                        className="size-24 rounded-xl border border-white/10 object-cover"
                      />
                    ) : (
                      <div className="grid size-24 place-items-center rounded-xl bg-[#8fd0a0]/10 text-3xl text-[#8fd0a0]">
                        {name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Upload your photo
                      </p>

                      <p className="mt-1 text-xs text-foreground/50">
                        JPG, PNG, WEBP. Maximum file size 5MB.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={saving}
                          className="rounded-lg bg-[#8fd0a0] px-4 py-2 text-sm font-semibold text-[#122a1f] transition hover:bg-[#a5dfb3] disabled:opacity-50"
                        >
                          {selectedFile ? "Choose Another" : "Choose Image"}
                        </button>

                        {displayImage && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            disabled={saving}
                            className="rounded-lg border border-red-400/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-400/10 disabled:opacity-50"
                          >
                            Remove
                          </button>
                        )}

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>

                      {selectedFile && (
                        <p className="mt-3 break-all text-xs text-[#8fd0a0]">
                          Selected: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-foreground/80"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={50}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-white/15 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-[#8fd0a0]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground/80">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full cursor-not-allowed rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/50 outline-none"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-[#8fd0a0] px-6 py-2.5 text-sm font-semibold text-[#122a1f] transition hover:bg-[#a5dfb3] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "Saving Profile..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleCancel}
                    className="rounded-lg border border-white/20 px-6 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Account Information */}
                <div className="mt-9 border-t border-white/10 pt-6">
                  <h3 className="mb-5 text-lg font-semibold">
                    Account Information
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-wider text-foreground/50">
                        Full Name
                      </p>

                      <p className="mt-2 break-words font-medium">
                        {user.name || "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-wider text-foreground/50">
                        Email Address
                      </p>

                      <p className="mt-2 break-all font-medium">
                        {user.email}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-wider text-foreground/50">
                        Member Since
                      </p>

                      <p className="mt-2 font-medium">
                        {memberSince}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-wider text-foreground/50">
                        Email Status
                      </p>

                      <p
                        className={`mt-2 font-medium ${
                          user.emailVerified
                            ? "text-[#8fd0a0]"
                            : "text-[#ef8b69]"
                        }`}
                      >
                        {user.emailVerified
                          ? "● Verified"
                          : "● Not Verified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="mt-8 border-t border-white/10 pt-6">
                  <h3 className="mb-4 text-lg font-semibold">
                    Account Actions
                  </h3>

                  <div className="flex flex-wrap gap-3">
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
              </>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-foreground/40">
          Thank you for being a part of BookNook.
        </p>
      </div>
    </main>
  );
}
