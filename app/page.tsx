import Link from "next/link";
import Image from "next/image";
import { fetchFromStrapi } from "../lib/strapi";
import HeroSlider from "../components/HeroSlider";
import FlashNews from "../components/FlashNews";
import {
  FaEnvelope,
  FaYoutube,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
} from "react-icons/fa6";

/* -------------------- Types -------------------- */

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

type FlashItem = {
  id: number;
  headline: string;
};

type Article = {
  id: number;
  title: string;
  slug: string;
  primaryCategory?: string;
  isFeatured?: boolean;
  coverImage?: {
    url: string;
    alternativeText?: string; // Added alternativeText property
  };
  publishedAt: string;
};

type Author = {
  whatsapp?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  mail?: string;
};

/* -------------------- Helpers -------------------- */

function getImageUrl(url?: string) {
  if (!url) return null;
  return url.startsWith("http")
    ? url
    : STRAPI_URL + url;
}

/* -------------------- Page -------------------- */

export default async function HomePage() {
  /* -------------------- Author -------------------- */
  const authorRes = await fetchFromStrapi("/authors?pagination[pageSize]=1");
  const author: Author = authorRes.data?.[0] || {};

  /* -------------------- Flash News -------------------- */
  const flashRes = await fetchFromStrapi(
    "/flash-news?filters[isActive][$eq]=true&sort=order:asc&populate=article"
  );
  const flashItems: FlashItem[] = flashRes.data;

  /* -------------------- Articles -------------------- */
  const articleRes = await fetchFromStrapi(
    "/articles?sort=publishedAt:desc&pagination[pageSize]=20&populate=coverImage"
  );

  const allArticles: Article[] = articleRes.data;

  /* -------------------- FEATURED LOGIC -------------------- */

  const featuredArticles = allArticles.filter(
    (a) => a.isFeatured
  );

  const normalArticles = allArticles.filter(
    (a) => !a.isFeatured
  );

  // Build home list (max 8)
  const homeArticles: Article[] = [
    ...featuredArticles,
    ...normalArticles,
  ].slice(0, 8);

  const heroArticles = homeArticles.slice(0, 3);

  const latestArticles = homeArticles.slice(3, 8);

  return (
    <>
      {/* ================= FLASH NEWS ================= */}
      {flashItems.length > 0 && <FlashNews flashItems={flashItems} />}

      {/* ================= HERO ================= */}
      {heroArticles.length > 0 && (
        <HeroSlider articles={heroArticles} />
      )}

      {/* ================= SMALL ADS ================= */}
      <section className="home-ads small-ads">
        <div className="ad-box small">Advertisement</div>
        <div className="ad-box small">Advertisement</div>
      </section>

      {/* ================= LATEST NEWS ================= */}
      {latestArticles.length > 0 && (
        <section className="article-latest-news">
          <h2 className="section-title-home">Latest News</h2>
          <div className="latest-news-list">
            {latestArticles.map((newsItem: Article) => (
              <Link
                key={newsItem.id}
                href={`/news/${newsItem.slug}`}
                className="latest-news-item"
              >
                {newsItem.coverImage && (
                  <img
                    src={getImageUrl(newsItem.coverImage.url) || ""}
                    alt={newsItem.coverImage.alternativeText || ""}
                    className="latest-news-thumb"
                  />
                )}
                <div className="latest-news-content">
                  <h3 className="latest-news-title">{newsItem.title}</h3>
                  <span className="latest-news-date">
                    {new Date(newsItem.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="view-all-wrap">
            <Link href="/news" className="view-all-link">
              More News
            </Link>
          </div>
        </section>
      )}


      {/* ================= SOCIAL MEDIA ROW ================= */}
      <section className="social-media-row">
        <div className="social-icons">
          <a href={author.mail || "mailto:"} aria-label="Email" className="social-btn email">
            <FaEnvelope />
          </a>
          <a href={author.whatsapp || "https://wa.me/"} target="_blank" aria-label="WhatsApp" className="social-btn whatsapp">
            <FaWhatsapp />
          </a>
          <a href={author.facebook || "https://facebook.com"} target="_blank" aria-label="Facebook" className="social-btn facebook">
            <FaFacebookF />
          </a>
          <a href={author.instagram || "https://instagram.com"} target="_blank" aria-label="Instagram" className="social-btn instagram">
            <FaInstagram />
          </a>
          <a href={author.twitter || "https://x.com"} target="_blank" aria-label="X" className="social-btn twitter">
            <FaXTwitter />
          </a>
          <a href={author.youtube || "https://youtube.com"} target="_blank" aria-label="YouTube" className="social-btn youtube">
            <FaYoutube />
          </a>
          <a href={author.linkedin || "https://linkedin.com"} target="_blank" aria-label="LinkedIn" className="social-btn linkedin">
            <FaLinkedinIn />
          </a>
        </div>
      </section>
    </>
  );
}
