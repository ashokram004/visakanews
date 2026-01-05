import Link from "next/link";
import { fetchFromStrapi } from "../../lib/strapi";

type Article = {
  id: number;
  title: string;
  slug: string;
  coverImage?: {
    url: string;
  };
  publishedAt: string;
};

export default async function NewsPage() {
  const res = await fetchFromStrapi(
    "/articles?sort=publishedAt:desc&populate=coverImage"
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
              : `http://localhost:1337${a.coverImage.url}`
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
                  {new Date(a.publishedAt).toLocaleDateString()}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
