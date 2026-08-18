"use client";

import { KeyboardEvent, useState } from "react";

type TagInputFieldProps = {
  label: string;
  name: string;
  defaultTags?: string[];
  placeholder?: string;
};

export function TagInputField({
  label,
  name,
  defaultTags = [],
  placeholder = "輸入後按 Enter 新增標籤"
}: TagInputFieldProps) {
  const [tags, setTags] = useState(defaultTags.filter(Boolean));
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const nextTag = draft.trim();
    if (!nextTag || tags.includes(nextTag)) {
      setDraft("");
      return;
    }
    setTags([...tags, nextTag]);
    setDraft("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addTag();
  };

  return (
    <label className="tag-input-field">
      {label}
      <input type="hidden" name={name} value={tags.join("\n")} />
      <div className="tag-input-list">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setTags(tags.filter((item) => item !== tag))}
            aria-label={`移除 ${tag}`}
          >
            {tag}
          </button>
        ))}
      </div>
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={addTag}
        placeholder={placeholder}
      />
      <small>按 Enter 新增標籤；點選已建立的標籤可移除。</small>
    </label>
  );
}
