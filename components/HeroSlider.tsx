"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Article = {
  id: number;
  title: string;
  slug: string;
  coverImage?: {
    url: string;
  };
};

function getImageUrl(url?: string) {
  if (!url) return "";
  return url.startsWith("http")
    ? url
    : `http://localhost:1337${url}`;
}

export default function HeroSlider({
  articles,
}: {
  articles: Article[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % articles.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [articles.length]);

  const article = articles[index];
  return (
    <div className="hero-slider-wrapper">
      <div
        className="hero-slider-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {articles.map((a) => (
          <Link
            key={a.id}
            href={`/news/${a.slug}`}
            className="hero-slide"
            style={{
              backgroundImage: `url(http://localhost:1337${a.coverImage?.url})`,
            }}
          >
            <div className="hero-overlay" />
            <div className="hero-content">
              <h2>{a.title}</h2>
            </div>
          </Link>
        ))}
      </div>

      {/* dots */}
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
