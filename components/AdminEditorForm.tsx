"use client";

import { createContext, ReactNode, startTransition, useActionState, useEffect, useRef, useState } from "react";

export type EditorResult = { error: string } | undefined;
export const AdminFormPendingContext = createContext(false);

export function AdminEditorForm({ action, children, className }: {
  action: (formData: FormData) => Promise<EditorResult>;
  children: ReactNode;
  className?: string;
}) {
  const [result, submit, pending] = useActionState(async (_previous: EditorResult, data: FormData) => action(data), undefined);
  const [uploadError, setUploadError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (uploadError || result?.error) errorRef.current?.focus();
  }, [uploadError, result]);
  // Keep the opened version intact until navigation or a successful save remounts it.
  const [editorFields] = useState(children);

  return (
    <form ref={formRef} action={submit} className={className} onSubmit={(event) => {
      // Manual dispatch prevents React from clearing inputs after a failed action.
      event.preventDefault();
      if (pending) return;
      if (formRef.current?.querySelector('[data-upload-pending="true"]')) {
        setUploadError("請先完成圖片上傳，再儲存內容。");
      } else {
        setUploadError("");
        const data = new FormData(event.currentTarget);
        startTransition(() => submit(data));
      }
    }}>
      {(uploadError || result?.error) ? <div ref={errorRef} tabIndex={-1} role="alert" className="admin-error">{uploadError || result?.error}</div> : null}
      <AdminFormPendingContext.Provider value={pending}>
        <fieldset disabled={!ready || pending} style={{ border: 0, padding: 0, margin: 0, minWidth: 0, display: "contents" }}>
          {editorFields}
        </fieldset>
      </AdminFormPendingContext.Provider>
    </form>
  );
}
