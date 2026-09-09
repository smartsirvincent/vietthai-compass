"use client";

import { useFormStatus } from "react-dom";
import { useContext } from "react";
import { AdminFormPendingContext } from "@/components/AdminEditorForm";

type AdminSubmitButtonProps = {
  idleLabel: string;
  pendingLabel?: string;
};

export function AdminSubmitButton({ idleLabel, pendingLabel = "送出更新中" }: AdminSubmitButtonProps) {
  const status = useFormStatus();
  const editorPending = useContext(AdminFormPendingContext);
  const pending = status.pending || editorPending;

  return (
    <button className={`primary-button admin-submit-button${pending ? " is-pending" : ""}`} type="submit" disabled={pending}>
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
