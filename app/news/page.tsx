import Link from "next/link";
import Image from "next/image";
import { fetchFromStrapi } from "../../lib/strapi";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

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

export default async function NewsPage() {
  // Fetch ALL articles sorted by createdAt (newest first)
  // No filtering by dynamicTabs - show all articles
  const res = await fetchFromStrapi(
    "/articles?sort=createdAt:desc&populate=coverImage&pagination[pageSize]=20"
  );

  const articles: Article[] = res.data;

  return (
    <section className="news-page">
      <h1 className="page-title">Latest News</h1>

      <ul className="news-list-page">
        {articles.map((a) => {
          const imgUrl = a.coverImage?.url
            ? a.coverImage.url.startsWith("http")
              ? a.coverImage.url
              : STRAPI_URL + a.coverImage.url
            : null;

          return (
            <li key={a.id} className="news-item">
              {imgUrl && (
                <img
                  src={imgUrl}
                  alt={a.title}
                  className="news-thumb"
                />
              )}

              <div className="news-info">
                <Link href={`/news/${a.slug}`}>
                  <h3>{a.title}</h3>
                </Link>
                <span className="news-date">
                  {formatArticleDate(a)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
