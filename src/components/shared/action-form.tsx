"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

type ActionResult = { success: boolean; message: string } | null;

interface ActionFormProps {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  className?: string;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * A form wrapper that shows toast feedback on server action completion.
 * Uses `useActionState` to track the action result.
 */
export function ActionForm({
  action,
  children,
  className,
  successMessage,
  errorMessage,
}: ActionFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(successMessage ?? state.message);
    } else {
      toast.error(errorMessage ?? state.message);
    }
  }, [state, successMessage, errorMessage]);

  return (
    <form action={formAction} className={className}>
      <fieldset disabled={isPending} className="contents">
        {children}
      </fieldset>
    </form>
  );
}
