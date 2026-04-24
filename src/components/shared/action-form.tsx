"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

type ActionResult = { success: boolean; message: string } | null;

interface ActionFormProps {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  className?: string;
  successMessage?: string;
  errorMessage?: string;
  /**
   * When true, the form auto-submits:
   *   - selects, checkboxes, color pickers → on change
   *   - text-like inputs → on blur (or after a long idle as a fallback)
   */
  autoSubmit?: boolean;
}

const TEXT_INPUT_TYPES = new Set([
  "text",
  "email",
  "search",
  "url",
  "password",
  "tel",
  "number",
]);

const IDLE_FALLBACK_MS = 1500;

const isTextInput = (target: EventTarget | null): target is HTMLInputElement =>
  target instanceof HTMLInputElement && TEXT_INPUT_TYPES.has(target.type);

export function ActionForm({
  action,
  children,
  className,
  successMessage,
  errorMessage,
  autoSubmit = false,
}: ActionFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirtyRef = useRef(false);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(successMessage ?? state.message);
    } else {
      toast.error(errorMessage ?? state.message);
    }
  }, [state, successMessage, errorMessage]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const submitNow = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    dirtyRef.current = false;
    formRef.current?.requestSubmit();
  };

  const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    if (!autoSubmit) return;
    if (isTextInput(e.target)) {
      dirtyRef.current = true;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(submitNow, IDLE_FALLBACK_MS);
    } else {
      submitNow();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLFormElement>) => {
    if (!autoSubmit) return;
    if (isTextInput(e.target) && dirtyRef.current) {
      submitNow();
    }
  };

  return (
    <form
      ref={formRef}
      action={formAction}
      className={className}
      onChange={autoSubmit ? handleChange : undefined}
      onBlur={autoSubmit ? handleBlur : undefined}
      // React 19 auto-resets forms after a server action (recursivelyResetForms).
      // That would wipe every field back to its HTML default (e.g. `<option selected>`)
      // after every save, which defeats an auto-submitting settings form.
      onReset={(e) => e.preventDefault()}
    >
      <fieldset disabled={isPending && !autoSubmit} className="contents">
        {children}
      </fieldset>
    </form>
  );
}
