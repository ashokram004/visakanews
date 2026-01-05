import Link from "next/link";
import { fetchFromStrapi } from "../../../lib/strapi";

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

type Topic = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  articles: Article[];
};

type Props = {
  params: Promise<{ slug: string }>;
};

/* -------------------- Helpers -------------------- */

function getImageUrl(url?: string) {
  if (!url) return null;
  return url.startsWith("http")
    ? url
    : `http://localhost:1337${url}`;
}

/* -------------------- Page -------------------- */

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;

  /* -------------------- Fetch Topic -------------------- */
  const res = await fetchFromStrapi(
    `/dynamic-tabs?filters[slug][$eq]=${slug}&populate[articles][populate]=coverImage`
  );

  const topics: Topic[] = res.data;

  if (!topics || topics.length === 0) {
    return <h1 style={{ textAlign: "center" }}>Topic not found</h1>;
  }

  const topic = topics[0];
  const articles = topic.articles || [];

  return (
    <main className="news-page">
      {/* ================= HEADER ================= */}
      <header style={{ marginBottom: "24px" }}>
        <h1 className="page-title">{topic.name}</h1>
        {topic.description && (
          <p style={{ color: "#666", maxWidth: "700px" }}>
            {topic.description}
          </p>
        )}
      </header>

      {/* ================= ARTICLES ================= */}
      {articles.length === 0 ? (
        <p>No articles under this topic.</p>
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
    </main>
  );
}
