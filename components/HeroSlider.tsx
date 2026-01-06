"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

/* -------------------- Types -------------------- */

type Article = {
  id: number;
  title: string;
  slug: string;
  coverImage?: {
    url: string;
  };
};

type Props = {
  articles: Article[];
};

/* -------------------- Helpers -------------------- */

function getImageUrl(url?: string) {
  if (!url) return "";
  return url.startsWith("http")
    ? url
    : STRAPI_URL + url;
}

/* -------------------- Component -------------------- */

export default function HeroSlider({ articles }: Props) {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const total = articles.length;

  /* -------------------- Auto slide -------------------- */
  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [index]);

  function startTimer() {
    stopTimer();
    timeoutRef.current = setTimeout(() => {
      next();
    }, 5000);
  }

  function stopTimer() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  /* -------------------- Controls -------------------- */

  function next() {
    setIndex((prev) => (prev + 1) % total);
  }

  function prev() {
    setIndex((prev) => (prev - 1 + total) % total);
  }

  return (
    <div className="hero-slider-wrapper">
      <div
        className="hero-slider-track"
        style={{
          transform: `translateX(-${index * 100}%)`,
        }}
      >
        {articles.map((a) => (
          <Link
            key={a.id}
            href={`/news/${a.slug}`}
            className="hero-slide"
            style={{
              backgroundImage: `url(${getImageUrl(a.coverImage?.url)})`,
            }}
          >
            <div className="hero-overlay" />
            <div className="hero-content">
              <h2>{a.title}</h2>
            </div>
          </Link>
        ))}
      </div>

      {/* ---------- Controls ---------- */}
      <button className="hero-btn left" onClick={prev}>
        ‹
      </button>

      <button className="hero-btn right" onClick={next}>
        ›
      </button>

      {/* ---------- Dots ---------- */}
      <div className="hero-dots">
        {articles.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
