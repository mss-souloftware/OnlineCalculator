"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Fields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const empty: Fields = { name: "", email: "", subject: "Feedback", message: "" };
const subjects = ["Feedback", "Feature request", "Bug report", "Other"];

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f: Fields): Partial<Record<keyof Fields, string>> {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!emailRe.test(f.email)) e.email = "Please enter a valid email address.";
  if (f.message.trim().length < 10)
    e.message = "Please write at least a sentence (10+ characters).";
  return e;
}

const fieldClass =
  "w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-faint transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30";

export function ContactForm() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>(
    {},
  );
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(fields);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      setFields(empty);
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Icon name="fa-circle-check" className="text-2xl" />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
          Message sent
        </h3>
        <p className="mt-2 text-sm text-muted">
          Thanks for reaching out — we read every message and will get back to
          you if a reply is needed.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-primary hover:text-primary-to"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Name
          </label>
          <input
            id="name"
            value={fields.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={!!errors.name}
            className={cn(fieldClass, errors.name && "border-red-500/60")}
            placeholder="Jane Doe"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={fields.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={!!errors.email}
            className={cn(fieldClass, errors.email && "border-red-500/60")}
            placeholder="jane@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Subject
        </label>
        <select
          id="subject"
          value={fields.subject}
          onChange={(e) => update("subject", e.target.value)}
          className={fieldClass}
        >
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          value={fields.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={!!errors.message}
          className={cn(fieldClass, "resize-y", errors.message && "border-red-500/60")}
          placeholder="How can we help?"
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-500">{errors.message}</p>
        )}
      </div>

      {status === "error" && (
        <p className="flex items-center gap-2 text-sm text-red-500">
          <Icon name="fa-triangle-exclamation" />
          Something went wrong. Please try again in a moment.
        </p>
      )}

      <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto">
        {status === "sending" ? (
          <>
            <Icon name="fa-spinner" className="animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Icon name="fa-paper-plane" />
            Send message
          </>
        )}
      </Button>
    </form>
  );
}
