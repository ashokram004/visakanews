"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <form className="search-box" onSubmit={onSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search news…"
      />
    </form>
  );
}
