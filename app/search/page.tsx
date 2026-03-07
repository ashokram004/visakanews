import Link from "next/link";
import { fetchFromStrapi } from "../../lib/strapi";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

/* -------------------- Types -------------------- */

type Article = {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
  publishedAt: string;
  coverImage?: {
    url: string;
  };
};

type Profile = {
  id: number;
  name: string;
  slug: string;
  profileType: string;
  profileImage?: {
    url: string;
  };
};

/* -------------------- Helpers -------------------- */

function getImageUrl(url?: string) {
  if (!url) return null;
  return url.startsWith("http")
    ? url
    : STRAPI_URL + url;
}

/**
 * Display date helper - uses createdAt for display
 * If publishedAt (updated date) differs from createdAt, show "Updated" label
 */
function formatArticleDate(article: { createdAt: string; publishedAt: string }): string {
  const createdDate = new Date(article.createdAt);
  const updatedDate = new Date(article.publishedAt);
  
  // Check if updated date is different from created date (by more than 1 minute)
  const timeDiff = Math.abs(updatedDate.getTime() - createdDate.getTime());
  const isUpdated = timeDiff > 60000; // More than 1 minute difference
  
  const dateStr = createdDate.toLocaleDateString();
  
  if (isUpdated) {
    return `${dateStr} (Updated ${updatedDate.toLocaleDateString()})`;
  }
  
  return dateStr;
}

/* -------------------- Page -------------------- */

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // ✅ Next.js App Router fix
  const { q } = await searchParams;
  const query = q?.trim();

  if (!query) {
    return (
      <main className="news-page">
        <h1 className="page-title">Search</h1>
        <p>Please enter a search term.</p>
      </main>
    );
  }

  /* -------------------- FETCH (SAFE QUERIES ONLY) -------------------- */

  const [articlesRes, profilesRes] = await Promise.all([
    fetchFromStrapi(
      `/articles?filters[title][$containsi]=${query}&populate=coverImage&sort=createdAt:desc`
    ),
    fetchFromStrapi(
      `/profiles?filters[$or][0][name][$containsi]=${query}&filters[$or][1][shortBio][$containsi]=${query}&populate=profileImage`
    ),
  ]);

  const articles: Article[] = articlesRes.data;
  const profiles: Profile[] = profilesRes.data;

  /* -------------------- UI -------------------- */

  return (
    <main className="news-page">
      <h1 className="page-title-search">
        Search results for “{query}”
      </h1>

      {/* ================= ARTICLES ================= */}
      {articles.length > 0 && (
        <>
          <h2 className="section-title">News</h2>
          <ul className="news-list">
            {articles.map((a) => (
              <li key={a.id}>
                <Link href={`/news/${a.slug}`} className="news-row">
                  {a.coverImage && (
                    <img
                      src={getImageUrl(a.coverImage.url)!}
                      alt={a.title}
                      className="news-thumb"
                    />
                  )}
                  <div className="news-text">
                    <span className="news-title">{a.title}</span>
                    <span className="news-date">
                      {formatArticleDate(a)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* ================= PROFILES ================= */}
      {profiles.length > 0 && (
        <> <br/>
          <h2 className="section-title">Profiles</h2>
          <ul className="news-list">
            {profiles.map((p) => (
              <li key={p.id}>
                <Link href={`/profiles/${p.slug}`} className="news-row">
                  {p.profileImage && (
                    <img
                      src={getImageUrl(p.profileImage.url)!}
                      alt={p.name}
                      className="news-thumb"
                    />
                  )}
                  <div className="news-text">
                    <span className="news-title">{p.name}</span>
                    {p.profileType ? p.profileType.split(',').map((type, index) => (
                      <span key={index} className="profile-type">{type.trim().toUpperCase()}</span>
                    )) : ""}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* ================= EMPTY ================= */}
      {articles.length === 0 && profiles.length === 0 && (
        <p>No results found.</p>
      )}
    </main>
  );
}
