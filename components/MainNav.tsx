"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const [tabs, setTabs] = useState<DynamicTab[]>([]);

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

  /* -------------------- Static Links -------------------- */
  const staticLinks = [
    { href: "/", label: "Home" },
    { href: "/news", label: "News" },
    { href: "/videos", label: "Videos" },
    { href: "/profiles", label: "Profiles" },
  ];

  return (
    <nav className="main-nav">
      {/* -------- Static Links -------- */}
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

      {/* -------- Dynamic Tabs -------- */}
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
            ].join(" ").trim()}
          >
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}
