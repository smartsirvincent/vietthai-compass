"use client";

import { useFormStatus } from "react-dom";

type AdminSubmitButtonProps = {
  idleLabel: string;
  pendingLabel?: string;
};

export function AdminSubmitButton({ idleLabel, pendingLabel = "送出更新中" }: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button className={`primary-button admin-submit-button${pending ? " is-pending" : ""}`} type="submit" disabled={pending}>
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
