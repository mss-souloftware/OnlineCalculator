"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/**
 * Accessible modal dialog rendered in a portal on document.body. Closes on
 * Escape or backdrop click, locks body scroll, and restores focus on close.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (typeof document === "undefined" || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cn(
          "relative z-10 flex max-h-[88vh] w-full max-w-xl flex-col rounded-2xl border border-border bg-card shadow-2xl",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <h2
            id={titleId}
            className="font-display text-lg font-semibold text-foreground"
          >
            {title}
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-card-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon name="fa-xmark" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
