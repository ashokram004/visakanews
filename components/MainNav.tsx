"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/* -------------------- Types -------------------- */

type DynamicTab = {
  id: number;
  name: string;
  slug: string;
  highlighted?: boolean;
};

/* -------------------- Component -------------------- */

export default function MainNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [tabs, setTabs] = useState<DynamicTab[]>([]);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  /* -------------------- Fetch Dynamic Tabs -------------------- */
  useEffect(() => {
    async function loadTabs() {
      try {
        const res = await fetch(
          "http://localhost:1337/api/dynamic-tabs?filters[isActive][$eq]=true&sort=order:asc"
        );
        const json = await res.json();
        setTabs(json.data || []);
      } catch (err) {
        console.error("Failed to load dynamic tabs", err);
      }
    }

    loadTabs();
  }, []);

  /* -------------------- Search Submit -------------------- */
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
    setSearchOpen(false);
  }

  /* -------------------- Static Links -------------------- */
  const staticLinks = [
    { href: "/", label: "Home" },
    { href: "/news", label: "News" },
    { href: "/videos", label: "Videos" },
    { href: "/profiles", label: "Profiles" },
  ];

  return (
    <nav className="main-nav">
      {/* ========== LEFT: TABS ========== */}
      <div className="nav-links">
        {staticLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            pathname.startsWith(link.href + "/");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={isActive ? "active" : ""}
            >
              {link.label}
            </Link>
          );
        })}

        {tabs.map((tab) => {
          const href = `/topics/${tab.slug}`;
          const isActive =
            pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={tab.id}
              href={href}
              className={[
                isActive ? "active" : "",
                tab.highlighted ? "nav-highlight" : "",
              ]
                .join(" ")
                .trim()}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* ========== RIGHT: SEARCH ========== */}
      <div className={`nav-search ${searchOpen ? "open" : ""}`}>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search news, videos, profiles…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

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

        </form>
      </div>
    </nav>
  );
}
