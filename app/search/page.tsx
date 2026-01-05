import { fetchFromStrapi } from "../../lib/strapi";
import Link from "next/link";

/* -------------------- Types -------------------- */

type Props = {
  searchParams: Promise<{ q?: string }>;
};

type Article = {
  id: number;
  title: string;
  slug: string;
  publishedAt: string;
  coverImage?: { url: string };
};

type Profile = {
  id: number;
  name: string;
  slug: string;
  profileType: "POLITICIAN" | "CELEBRITY";
  profileImage?: { url: string };
};

type Video = {
  id: number;
  title: string;
};

/* -------------------- Helpers -------------------- */

function getImageUrl(url?: string) {
  if (!url) return null;
  return url.startsWith("http")
    ? url
    : `http://localhost:1337${url}`;
}

/* -------------------- Page -------------------- */

export default async function SearchPage({ searchParams }: Props) {
  // ✅ REQUIRED IN NEXT 15
  const { q } = await searchParams;
  const query = q?.trim();

  if (!query) {
    return <p>Please enter a search term.</p>;
  }

  /* -------------------- Fetch Data -------------------- */

  const [articlesRes, profilesRes, videosRes] = await Promise.all([
    fetchFromStrapi(
      `/articles?filters[title][$containsi]=${query}&sort=publishedAt:desc&populate=coverImage`
    ),
    fetchFromStrapi(
      `/profiles?filters[name][$containsi]=${query}&populate=profileImage`
    ),
    fetchFromStrapi(
      `/videos?filters[title][$containsi]=${query}`
    ),
  ]);

  const articles: Article[] = articlesRes.data;
  const profiles: Profile[] = profilesRes.data;
  const videos: Video[] = videosRes.data;

  return (
    <section className="news-page">
      <h1 className="page-title">
        Search results for “{query}”
      </h1>

      {/* ================= NEWS ================= */}
      <h2 className="section-title">News</h2>

      {articles.length === 0 ? (
        <p>No news found.</p>
      ) : (
        <ul className="news-list-page">
          {articles.map((a) => (
            <li key={a.id} className="news-item">
              {a.coverImage && (
                <img
                  src={getImageUrl(a.coverImage.url)!}
                  alt={a.title}
                  className="news-thumb"
                />
              )}

              <div className="news-info">
                <Link href={`/news/${a.slug}`}>
                  <h3>{a.title}</h3>
                </Link>

                <div className="news-date">
                  {new Date(a.publishedAt).toLocaleDateString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ================= PROFILES ================= */}
      <h2 className="section-title">Profiles</h2>

      {profiles.length === 0 ? (
        <p>No profiles found.</p>
      ) : (
        <ul className="profile-news-list">
          {profiles.map((p) => (
            <li key={p.id} className="news-row">
              {p.profileImage && (
                <img
                  src={getImageUrl(p.profileImage.url)!}
                  alt={p.name}
                  className="news-thumb"
                />
              )}

              <div className="news-text">
                <Link href={`/profiles/${p.slug}`}>
                  <span className="news-title">{p.name}</span>
                </Link>
                <span className="news-date">{p.profileType}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ================= VIDEOS ================= */}
      <h2 className="section-title">Videos</h2>

      {videos.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <ul className="profile-news-list">
          {videos.map((v) => (
            <li key={v.id}>
              <Link href="/videos">
                <strong>{v.title}</strong>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
