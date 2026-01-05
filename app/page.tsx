import Link from "next/link";
import { fetchFromStrapi } from "../lib/strapi";
import HeroSlider from "../components/HeroSlider";


/* -------------------- Types -------------------- */

type FlashItem = {
  id: number;
  headline: string;
};

type Article = {
  id: number;
  title: string;
  slug: string;
  primaryCategory?: string;
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
    : `http://localhost:1337${url}`;
}

/* -------------------- Page -------------------- */

export default async function HomePage() {
  /* Flash News */
  const flashRes = await fetchFromStrapi(
    "/flash-news?filters[isActive][$eq]=true&sort=order:asc"
  );
  const flashItems: FlashItem[] = flashRes.data;

  /* Articles (WITH cover images) */
  const articleRes = await fetchFromStrapi(
    "/articles?sort=publishedAt:desc&pagination[pageSize]=10&populate=coverImage"
  );
  const articles: Article[] = articleRes.data;

  const heroArticles = articles.slice(0, 3);
  const moreArticles = articles.slice(3, 8);

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
