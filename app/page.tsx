import Link from "next/link";
import Image from "next/image";
import { fetchFromStrapi } from "../lib/strapi";
import HeroSlider from "../components/HeroSlider";
import FlashNews from "../components/FlashNews";
import {
  FacebookIcon,
  TwitterIcon,
  LinkedInIcon,
  YouTubeIcon,
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

      {/* ================= SOCIAL MEDIA ROW ================= */}
      <section className="social-media-row">
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a href="https://twitter.com" target="_blank" aria-label="Twitter">
            <TwitterIcon />
          </a>
          <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
          <a href="https://youtube.com" target="_blank" aria-label="YouTube">
            <YouTubeIcon />
          </a>
        </div>
      </section>
    </>
  );
}
