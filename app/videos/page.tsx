import Link from "next/link";
import { fetchFromStrapi } from "../../lib/strapi";
import { toEmbedUrl } from "../../lib/video";

/* -------------------- Types -------------------- */

type Video = {
  id: number;
  title: string;
  embedUrl: string;
  articles?: {
    id: number;
    title: string;
    slug: string;
  }[];
};

/* -------------------- Page -------------------- */

export default async function VideosPage() {
  const data = await fetchFromStrapi(
    "/videos?populate[articles]=true&sort=publishedAt:desc"
  );

  const videos: Video[] = data.data;

  return (
    <section className="videos-page">
      <h1 className="page-title">Videos</h1>

      {videos.length === 0 ? (
        <p>No videos available.</p>
      ) : (
        <div className="video-list">
          {videos.map((video) => {
            const article = video.articles?.[0];

            return (
              <article key={video.id} className="video-row">
                <h2 className="video-title">{video.title}</h2>

                <iframe
                  src={toEmbedUrl(video.embedUrl)}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

                {article && (
                  <p className="video-article-link">
                    Related article:{" "}
                    <Link href={`/news/${article.slug}`}>
                      {article.title}
                    </Link>
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
