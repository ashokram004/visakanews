import Link from "next/link";
import { fetchFromStrapi } from "../../../lib/strapi";

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
  // Sort articles by createdAt (newest first)
  const articles = (topic.articles || []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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
                  {formatArticleDate(a)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
