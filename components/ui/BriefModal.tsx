"use client";

// BriefModal — opens from the third contact card. Renders the brief form,
// posts JSON to /api/brief (v11), and shows success/error states.
//
// Accessibility: dialog role, aria-modal, focus trap, ESC close, body
// scroll lock, return focus to trigger on close.
//
// No Resend key anywhere here — the form only knows about /api/brief.

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, Check, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT } from "@/lib/contact";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type Status = "idle" | "sending" | "success" | "error";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const REQUIRED_FIELDS = [
  "name",
  "company",
  "email",
  "phone",
  "hasWebsite",
  "needs",
] as const;

export function BriefModal({ isOpen, onClose }: Props) {
  const t = useTranslations("contact.modal");
  const locale = useLocale();
  const isAr = locale === "ar";
  const reduce = useReducedMotion();
  const titleId = useId();

  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Reset form state when the modal closes
  useEffect(() => {
    if (!isOpen) {
      // Small delay so the user briefly sees the success state before
      // the modal collapses (we don't auto-close though).
      const id = window.setTimeout(() => {
        setStatus("idle");
        setSubmitError("");
        setFieldErrors({});
      }, 200);
      return () => window.clearTimeout(id);
    }
  }, [isOpen]);

  // Body scroll lock + ESC close + focus management
  useEffect(() => {
    if (!isOpen) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      // Focus trap — keep tab cycling inside the panel
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    // Focus first interactive on next frame
    const focusFrame = requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(
        'input:not([type="hidden"]), button:not([disabled])',
      );
      first?.focus();
    });

    return () => {
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = "";
      // Return focus to the originating trigger
      lastFocusedRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;

    // Inline validation
    const errors: Record<string, string> = {};
    for (const field of REQUIRED_FIELDS) {
      const v = data[field];
      if (typeof v !== "string" || v.trim() === "") {
        errors[field] = t("errors.required");
      }
    }
    if (data.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
      errors.email = t("errors.invalidEmail");
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Move focus to the first field with an error
      const firstErrorName = Object.keys(errors)[0];
      const firstErrorEl = panelRef.current?.querySelector<HTMLElement>(
        `[name="${firstErrorName}"]`,
      );
      firstErrorEl?.focus();
      return;
    }

    setFieldErrors({});
    setStatus("sending");
    setSubmitError("");

    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(body.error || "Submission failed");
      }
      setStatus("success");
      formEl.reset();
    } catch (err) {
      setStatus("error");
      setSubmitError(err instanceof Error ? err.message : "Submission failed");
    }
  };

  const clearFieldError = (name: string) => {
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  const needsOptions = (t.raw("fields.needsOptions") as string[]) ?? [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop — click closes */}
          <div
            aria-hidden
            onClick={onClose}
            className="absolute inset-0"
            style={{
              background: "rgba(8, 9, 10, 0.8)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
            className="relative max-w-[560px] w-[calc(100%-32px)] max-h-[90vh] overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-8 md:p-12"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className="absolute top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              style={{ insetInlineEnd: "16px" }}
            >
              <X size={20} strokeWidth={1.75} aria-hidden />
            </button>

            {status === "success" ? (
              <SuccessState
                titleId={titleId}
                onClose={onClose}
              />
            ) : (
              <BriefForm
                titleId={titleId}
                isAr={isAr}
                status={status}
                submitError={submitError}
                fieldErrors={fieldErrors}
                needsOptions={needsOptions}
                onSubmit={handleSubmit}
                onClearFieldError={clearFieldError}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Success state ---------- */

function SuccessState({
  titleId,
  onClose,
}: {
  titleId: string;
  onClose: () => void;
}) {
  const t = useTranslations("contact.modal.success");
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          background: "rgba(199, 178, 122, 0.12)",
          color: "var(--gold-bright)",
        }}
      >
        <Check size={28} strokeWidth={2} aria-hidden />
      </div>
      <h2
        id={titleId}
        className="mt-6 text-[var(--fg)]"
        style={{
          fontFamily: "var(--font-sans), sans-serif",
          fontSize: "clamp(24px, 3vw, 32px)",
          fontWeight: 500,
          letterSpacing: "-0.02em",
        }}
      >
        {t("title")}
      </h2>
      <p
        className="mt-3 max-w-[420px] text-[var(--fg-secondary)]"
        style={{ fontSize: "15px", lineHeight: 1.6 }}
      >
        {t("body")}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-[var(--gold)] px-6 text-[14px] font-medium text-[#08090A] hover:bg-[var(--gold-bright)] transition-colors"
      >
        {t("close")}
      </button>
    </div>
  );
}

/* ---------- Form ---------- */

function BriefForm({
  titleId,
  isAr,
  status,
  submitError,
  fieldErrors,
  needsOptions,
  onSubmit,
  onClearFieldError,
}: {
  titleId: string;
  isAr: boolean;
  status: Status;
  submitError: string;
  fieldErrors: Record<string, string>;
  needsOptions: string[];
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onClearFieldError: (name: string) => void;
}) {
  const t = useTranslations("contact.modal");

  return (
    <>
      {/* Heading */}
      <h2
        id={titleId}
        className="text-[var(--fg)]"
        style={{
          fontFamily: "var(--font-sans), sans-serif",
          fontSize: isAr ? "clamp(22px, 3vw, 28px)" : "clamp(24px, 3vw, 32px)",
          fontWeight: 500,
          letterSpacing: isAr ? "0" : "-0.02em",
          lineHeight: 1.2,
        }}
      >
        {t("title")}
      </h2>
      <p
        className="mt-2 text-[var(--fg-secondary)]"
        style={{ fontSize: "14px", lineHeight: 1.5 }}
      >
        {t("sub")}
      </p>

      {/* Error banner (visible only on submit failure) */}
      {status === "error" && (
        <div
          role="alert"
          className="mt-6 rounded-md border p-3 text-[13px] leading-[1.5]"
          style={{
            borderColor: "rgba(248, 113, 113, 0.4)",
            background: "rgba(248, 113, 113, 0.06)",
            color: "#fca5a5",
          }}
        >
          {submitError || t("errors.submit")}{" "}
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline ms-1"
          >
            <MessageCircle size={12} aria-hidden /> {t("errors.whatsappFallback")}
          </a>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
        {/* Honeypot — bots fill, real users don't see */}
        <input
          type="text"
          name="_honeypot"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
        />

        <Field
          name="name"
          type="text"
          label={t("fields.name")}
          required
          autoComplete="name"
          error={fieldErrors.name}
          onClearError={onClearFieldError}
        />
        <Field
          name="company"
          type="text"
          label={t("fields.company")}
          required
          autoComplete="organization"
          error={fieldErrors.company}
          onClearError={onClearFieldError}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field
            name="email"
            type="email"
            label={t("fields.email")}
            required
            autoComplete="email"
            error={fieldErrors.email}
            onClearError={onClearFieldError}
          />
          <Field
            name="phone"
            type="tel"
            label={t("fields.phone")}
            required
            autoComplete="tel"
            inputMode="tel"
            error={fieldErrors.phone}
            onClearError={onClearFieldError}
          />
        </div>

        {/* hasWebsite — 2 pills */}
        <PillGroup
          name="hasWebsite"
          label={t("fields.hasWebsite")}
          options={[t("fields.hasWebsiteYes"), t("fields.hasWebsiteNo")]}
          error={fieldErrors.hasWebsite}
          onClearError={onClearFieldError}
        />

        {/* needs — multi pills */}
        <PillGroup
          name="needs"
          label={t("fields.needs")}
          options={needsOptions}
          error={fieldErrors.needs}
          onClearError={onClearFieldError}
        />

        <Field
          name="link"
          type="url"
          label={t("fields.link")}
          placeholder={t("fields.linkPlaceholder")}
          autoComplete="url"
          inputMode="url"
        />

        <TextareaField
          name="message"
          label={t("fields.message")}
          placeholder={t("fields.messagePlaceholder")}
          rows={4}
        />

        {/* Submit row — pushes to logical end */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end pt-2 gap-3">
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--gold)] px-6 text-[14px] font-medium text-[#08090A] hover:bg-[var(--gold-bright)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "sending" ? t("sending") : t("submit")}
          </button>
        </div>
      </form>
    </>
  );
}

/* ---------- Reusable field primitives ---------- */

function Label({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-mono uppercase t-mono-sm text-[var(--fg-faint)]"
    >
      {children}
      {required && (
        <span aria-hidden className="text-[var(--gold-bright)] ms-1">
          *
        </span>
      )}
    </label>
  );
}

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p
      className="mt-2 text-[13px]"
      style={{ color: "#fca5a5", lineHeight: 1.4 }}
    >
      {error}
    </p>
  );
}

function Field({
  name,
  type,
  label,
  required,
  placeholder,
  autoComplete,
  inputMode,
  error,
  onClearError,
}: {
  name: string;
  type: "text" | "email" | "tel" | "url";
  label: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "tel" | "url" | "email" | "text";
  error?: string;
  onClearError?: (name: string) => void;
}) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        onInput={() => onClearError?.(name)}
        className={cn(
          "block w-full rounded-md bg-[var(--bg-elevated)] px-4 py-3 text-[15px] text-[var(--fg)] placeholder:text-[var(--fg-faint)] outline-none transition-colors",
          "border",
          error
            ? "border-[#fca5a5]/60"
            : "border-[var(--border)] focus:border-[var(--gold-bright)]",
        )}
        style={{
          boxShadow: error
            ? "0 0 0 2px rgba(248, 113, 113, 0.15)"
            : undefined,
        }}
      />
      <span id={error ? `${id}-err` : undefined}>
        <FieldError error={error} />
      </span>
    </div>
  );
}

function TextareaField({
  name,
  label,
  placeholder,
  rows = 4,
}: {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
}) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder}
        className="block w-full resize-y rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-[15px] text-[var(--fg)] placeholder:text-[var(--fg-faint)] outline-none transition-colors focus:border-[var(--gold-bright)]"
      />
    </div>
  );
}

function PillGroup({
  name,
  label,
  options,
  error,
  onClearError,
}: {
  name: string;
  label: string;
  options: string[];
  error?: string;
  onClearError?: (name: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 font-mono uppercase t-mono-sm text-[var(--fg-faint)]">
        {label}
        <span aria-hidden className="text-[var(--gold-bright)] ms-1">
          *
        </span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt, i) => (
          <label
            key={i}
            className="cursor-pointer rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-[14px] text-[var(--fg-secondary)] transition-colors hover:border-[var(--gold)]/40 has-[:checked]:border-[var(--gold-bright)] has-[:checked]:bg-[rgba(199,178,122,0.10)] has-[:checked]:text-[var(--gold-bright)]"
          >
            <input
              type="radio"
              name={name}
              value={opt}
              onChange={() => onClearError?.(name)}
              className="sr-only"
            />
            {opt}
          </label>
        ))}
      </div>
      <FieldError error={error} />
    </fieldset>
  );
}
