import Link from "next/link";
import Image from "next/image";
import { fetchFromStrapi } from "../lib/strapi";
import HeroSlider from "../components/HeroSlider";
import FlashNews from "../components/FlashNews";
import {
  GmailIcon,
  YouTubeIcon,
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  XIcon,
  LinkedInIcon,
} from "../components/FooterIcons";

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

/* -------------------- Helpers -------------------- */

function getImageUrl(url?: string) {
  if (!url) return null;
  return url.startsWith("http")
    ? url
    : STRAPI_URL + url;
}

/* -------------------- Page -------------------- */

export default async function HomePage() {
  /* -------------------- Flash News -------------------- */
  const flashRes = await fetchFromStrapi(
    "/flash-news?filters[isActive][$eq]=true&sort=order:asc"
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

      {/* ================= LATEST NEWS ================= */}
      {latestArticles.length > 0 && (
        <section className="article-latest-news">
          <h2 className="section-title">Latest News</h2>
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

      {/* ================= SMALL ADS ================= */}
      <section className="home-ads small-ads">
        <div className="ad-box small">Advertisement</div>
        <div className="ad-box small">Advertisement</div>
      </section>

      {/* ================= SOCIAL MEDIA ROW ================= */}
      <section className="social-media-row">
        <div className="social-icons">
          <a href="mailto:visakanews@gmail.com" aria-label="Email">
            <GmailIcon />
          </a>
          <a href="https://wa.me/918247829025" target="_blank" aria-label="WhatsApp">
            <WhatsAppIcon />
          </a>
          <a href="https://facebook.com" target="_blank" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a href="https://youtube.com" target="_blank" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href="https://x.com" target="_blank" aria-label="X">
            <XIcon />
          </a>
          <a href="https://youtube.com" target="_blank" aria-label="YouTube">
            <YouTubeIcon />
          </a>
          <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
        </div>
      </section>
    </>
  );
}
