import Link from "next/link";
import { toEmbedUrl } from "@/lib/video";
import { fetchFromStrapi } from "../../../lib/strapi";
import ArticleShare from "@/components/ArticleShare";
import ArticleCommentsSection from "@/components/ArticleCommentsSection";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

/* -------------------- Types -------------------- */

type ContentBlock = {
  type: string;
  children?: any[];
  image?: {
    url: string;
    alternativeText?: string;
  };
};

type Author = {
  id: number;
  name: string;
};

type Video = {
  id: number;
  title: string;
  embedUrl: string;
};

type Comment = {
  id: number;
  name: string;
  message: string;
  createdAt: string;
};

type Article = {
  id: number;
  title: string;
  slug: string;
  content: ContentBlock[];
  publishedAt: string;
  primaryCategory?: string;
  coverImage?: {
    url: string;
    alternativeText?: string;
  };
  author?: Author;
  videos?: Video[];
};

/* -------------------- Helpers -------------------- */

function renderContent(blocks: ContentBlock[]) {
  return blocks.map((block, index) => {
    /* ---------- PARAGRAPH ---------- */
    if (block.type === "paragraph" && block.children) {
      const firstLink = block.children.find(
        (c: any) => c.type === "link" && c.url
      );

      // 👉 ONE embed per paragraph
      if (firstLink) {
        return (
          <div key={index} style={{ margin: "24px 0" }}>
            <iframe
              src={toEmbedUrl(firstLink.url)}
              width="100%"
              height="400"
              allowFullScreen
            />
          </div>
        );
      }

      return (
        <p key={index}>
          {block.children.map((c: any, i: number) => {
            if (!c.text) return null;
      
            return (
              <span key={i}>
                {c.text}
                {" "}
              </span>
            );
          })}
        </p>
      );
      
    }

    

    /* ---------- IMAGE ---------- */
    if (block.type === "image" && block.image?.url) {
      const rawUrl = block.image.url;

      const imageUrl = rawUrl;

      return (
        <figure key={index} style={{ margin: "24px 0" }}>
          <img
            src={imageUrl}
            alt={block.image.alternativeText || ""}
            style={{
              maxWidth: "100%",
              display: "block",
              margin: "0 auto",
            }}
          />

          {block.image.alternativeText && (
            <figcaption
              style={{
                textAlign: "center",
                fontSize: "14px",
                color: "#666",
                marginTop: "6px",
              }}
            >
              {block.image.alternativeText}
            </figcaption>
          )}
        </figure>
      );
    }

    return null;
  });
}

/* -------------------- Page -------------------- */

export default async function ArticleDetailPage({ params }: any) {
  const { slug } = await params;

  const res = await fetchFromStrapi(
    `/articles?filters[slug][$eq]=${slug}&populate[coverImage]=true&populate[videos]=true&populate[author]=true`
  );

  const article: Article = res.data?.[0];
  if (!article) return <h1>Article not found</h1>;

  const commentsRes = await fetchFromStrapi(
    `/comments?filters[article][id][$eq]=${article.id}&filters[isApproved][$eq]=true&sort=createdAt:desc`
  );

  const articleUrl = `https://visakanews.com/news/${article.slug}`;

  // Fetch latest 6 articles to account for potential exclusion of current article
  const latestRes = await fetchFromStrapi(
    "/articles?sort=publishedAt:desc&pagination[pageSize]=6&populate=coverImage"
  );
  const allLatest = latestRes.data || [];

  // Exclude current article if it's in the latest 5, otherwise take first 5
  let latestArticles = allLatest.filter((a: Article) => a.id !== article.id);
  if (latestArticles.length < 5) {
    latestArticles = allLatest.slice(0, 5);
  } else {
    latestArticles = latestArticles.slice(0, 5);
  }

  return (
    <article className="article-page">
      {article.primaryCategory && (
        <div className="article-category">{article.primaryCategory}</div>
      )}

      <h1 className="article-title">{article.title}</h1>

      <div className="article-meta">
        {article.author?.name && <span>By {article.author.name} • </span>}
        {new Date(article.publishedAt).toLocaleDateString()}
      </div>

      {article.coverImage && (
        <img
          className="article-cover"
          src={article.coverImage.url}
          alt={article.coverImage.alternativeText || ""}
        />
      )}

      {/* CONTENT */}
      <div className="article-content">
        {renderContent(article.content)}
      </div>

      {/* SHARE ICONS */}
      <ArticleShare url={articleUrl} />

      {/* INLINE AD */}
      <div className="article-ad">Advertisement</div>

      {/* LATEST NEWS SECTION */}
      <section className="article-latest-news">
        <h2 className="section-title">Latest News</h2>
        {latestArticles.length > 0 ? (
          <>
            <div className="latest-news-list">
              {latestArticles.map((newsItem: Article) => (
                <Link
                  key={newsItem.id}
                  href={`/news/${newsItem.slug}`}
                  className="latest-news-item"
                >
                  {newsItem.coverImage && (
                    <img
                      src={newsItem.coverImage.url}
                      alt={newsItem.coverImage.alternativeText || ""}
                      className="latest-news-thumb"
                    />
                  )}
                  <div className="latest-news-content">
                    <h3 className="latest-news-title">{newsItem.title}</h3>
                    <span className="latest-news-date">
                      {new Date(newsItem.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="view-all-wrap">
              <Link href="/news" className="view-all-link">
                More
              </Link>
            </div>
          </>
        ) : (
          <p>No latest news available.</p>
        )}
      </section>

      {/* GALLERY / VIDEOS (KEPT) */}
      {article.videos && article.videos.length > 0 && (
        <section className="article-videos">
          {article.videos.map((v) => (
            <iframe
              key={v.id}
              src={toEmbedUrl(v.embedUrl)}
              title={v.title}
              width="100%"
              height="400"
              allowFullScreen
            />
          ))}
        </section>
      )}

      {/* COMMENTS (BOTTOM) */}
      <ArticleCommentsSection initialComments={commentsRes.data || []} articleId={article.id} />

    </article>
  );
}
