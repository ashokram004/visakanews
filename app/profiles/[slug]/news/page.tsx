import { fetchFromStrapi } from "../../../../lib/strapi";
import Link from "next/link";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

/* -------------------- Types -------------------- */

type Article = {
  id: number;
  title: string;
  slug: string;
  publishedAt?: string;
  coverImage?: {
    url: string;
  };
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

export default async function ProfileNewsPage({ params }: Props) {
  const { slug } = await params;

  const profileRes = await fetchFromStrapi(
    `/profiles?filters[slug][$eq]=${slug}&populate[articles][populate]=coverImage`
  );

  const profile = profileRes.data?.[0];
  const articles: Article[] = profile?.articles || [];

  return (
    <section className="news-page">
      {articles.length === 0 ? null : (
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
                  <h3 className="news-title">{a.title}</h3>
                </Link>

                {a.publishedAt && (
                  <div className="news-date">
                    {new Date(a.publishedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
