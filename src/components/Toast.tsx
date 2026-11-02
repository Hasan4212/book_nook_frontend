
"use client";

import { createContext, useContext, useState } from "react";

// ---------- Types ----------

type ToastKind = "success" | "error";

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

type ToastFn = (message: string) => void;

interface ToastContextValue {
  toast: {
    success: ToastFn;
    error: ToastFn;
  };
}

// ---------- Context ----------

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }

  return ctx;
}

// ---------- Icons ----------

function SuccessIcon() {
  return (
    <svg
      className="size-5 shrink-0 text-[#8fd0a0]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m8.5 12.5 2.5 2.5 5-5" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      className="size-5 shrink-0 text-[#ef8b69]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

// ---------- Provider ----------

const TOAST_DURATION_MS = 4000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = (kind: ToastKind, message: string) => {
    const id = Date.now() + Math.random();

    setToasts((prev) => [...prev, { id, kind, message }]);

    // Auto-dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION_MS);
  };

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toast = {
    success: (message: string) => push("success", message),
    error: (message: string) => push("error", message),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Top-right toast stack */}
      <div
        className="fixed top-4 right-4 z-[100] flex w-80 flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="animate-toast-in flex items-start gap-3 rounded-xl border border-white/10 bg-[#16251d] px-4 py-3 shadow-2xl"
          >
            {t.kind === "success" ? <SuccessIcon /> : <ErrorIcon />}

            <p className="flex-1 pt-0.5 text-sm text-foreground">{t.message}</p>

            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="cursor-pointer rounded-md p-1 text-foreground/50 transition hover:bg-white/10 hover:text-white"
            >
              <svg
                className="size-4"
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
        ))}
      </div>
    </ToastContext.Provider>
  );
}
