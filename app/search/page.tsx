import Link from "next/link";
import { fetchFromStrapi } from "../../lib/strapi";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

/* -------------------- Types -------------------- */

type Article = {
  id: number;
  title: string;
  slug: string;
  publishedAt: string;
  coverImage?: {
    url: string;
  };
};

type Profile = {
  id: number;
  name: string;
  slug: string;
  profileType: "POLITICIAN" | "CELEBRITY";
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
      `/articles?filters[title][$containsi]=${query}&populate=coverImage&sort=publishedAt:desc`
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
      <h1 className="page-title">
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
                      {new Date(a.publishedAt).toLocaleDateString()}
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
                    <span className="news-date">{p.profileType}</span>
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
