import Link from "next/link";
import { fetchFromStrapi } from "../lib/strapi";
import HeroSlider from "../components/HeroSlider";

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
  const moreArticles = homeArticles.slice(3, 8);

  return (
    <>
      {/* ================= FLASH NEWS ================= */}
      {flashItems.length > 0 && (
        <section className="flash-news">
          <div className="flash-marquee">
            <div className="flash-track">
              {flashItems.map((f) => (
                <span key={`a-${f.id}`} className="flash-item">
                  <span className="flash-dot" />
                  {f.headline}
                </span>
              ))}
            </div>

            {/* duplicate track for seamless loop */}
            <div className="flash-track">
              {flashItems.map((f) => (
                <span key={`b-${f.id}`} className="flash-item">
                  <span className="flash-dot" />
                  {f.headline}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= HERO ================= */}
      {heroArticles.length > 0 && (
        <HeroSlider articles={heroArticles} />
      )}

      {/* ================= MORE NEWS ================= */}
      <section className="home-section">
        <div className="section-header">
          <h2 className="section-title">More News</h2>

          <Link href="/news" className="section-view-all">
            View all →
          </Link>
        </div>

        <ul className="news-list">
          {moreArticles.map((a) => (
            <li key={a.id}>
              <Link href={`/news/${a.slug}`} className="news-row">
                {a.coverImage && (
                  <img
                    className="news-thumb"
                    src={getImageUrl(a.coverImage.url)!}
                    alt={a.title}
                  />
                )}

                <div className="news-text">
                  <span className="news-title">{a.title}</span>
                  <span className="news-date">
                    {new Date(a.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ================= SMALL ADS ================= */}
      <section className="home-ads small-ads">
        <div className="ad-box small">Advertisement</div>
        <div className="ad-box small">Advertisement</div>
      </section>
    </>
  );
}
