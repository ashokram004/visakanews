"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
    setSearchOpen(false);
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        type="button"
        className="search-toggle"
        onClick={() => setSearchOpen((v) => !v)}
        aria-label="Search"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      {/* Expanded Search Form */}
      {searchOpen && (
        <div className="mobile-search-expanded">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search news, videos, profiles…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>
      )}
    </>
  );
}
