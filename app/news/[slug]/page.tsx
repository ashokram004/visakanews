import Link from "next/link";
import { toEmbedUrl } from "@/lib/video";
import { fetchFromStrapi } from "../../../lib/strapi";
import ArticleShare from "@/components/ArticleShare";
import ArticleCommentsSection from "@/components/ArticleCommentsSection";
import ViewIncrementor from "@/components/ViewIncrementor";

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
  documentId: string;
  title: string;
  slug: string;
  content: ContentBlock[];
  publishedAt: string;
  primaryCategory?: string;
  dynamicTabs?: { slug: string }[];
  coverImage?: {
    url: string;
    alternativeText?: string;
  };
  author?: Author;
  videos?: Video[];
  views?: number;
};

function getImageUrl(url?: string) {
  if (!url) return null;
  return url.startsWith("http")
    ? url
    : STRAPI_URL + url;
}

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
          {block.children && block.children.length > 0 ? block.children.map((c: any, i: number) => {
            if (!c.text) return null;

            return (
              <span key={i}>
                {c.text}
                {" "}
              </span>
            );
          }) : <br />}
        </p>
      );
      
    }

    

    /* ---------- IMAGE ---------- */
    if (block.type === "image" && block.image?.url) {
      const imageUrl = getImageUrl(block.image.url);

      return (
        <figure key={index} style={{ margin: "24px 0" }}>
          <img
            src={imageUrl || ""}
            alt={block.image.alternativeText || ""}
            style={{
              maxWidth: "100%",
              width: "100%",
              height: "420px",
              display: "block",
              margin: "0 auto",
              objectFit: "fill",
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
    `/articles?filters[slug][$eq]=${slug}&populate[coverImage]=true&populate[videos]=true&populate[author]=true&populate[dynamicTabs]=true`
  );

  const article: Article = res.data?.[0];
  if (!article) return <h1>Article not found</h1>;

  const commentsRes = await fetchFromStrapi(
    `/comments?filters[article][id][$eq]=${article.id}&filters[isApproved][$eq]=true&sort=createdAt:desc`
  );

  const articleUrl = `https://visakanews.com/news/${article.slug}`;

  // Fetch latest articles based on the dynamicTabs of the current article
  const dynamicTab = article.dynamicTabs?.[0];
  let latestRes;
  if (dynamicTab) {
    latestRes = await fetchFromStrapi(
      `/articles?sort=publishedAt:desc&pagination[pageSize]=6&populate=coverImage&filters[dynamicTabs][slug][$eq]=${dynamicTab.slug}`
    );
  } else {
    latestRes = await fetchFromStrapi(
      "/articles?sort=publishedAt:desc&pagination[pageSize]=6&populate=coverImage&filters[dynamicTabs][$null]=true"
    );
  }
  const allLatest = latestRes.data || [];

  // Exclude current article and take the top 5 latest
  let latestArticles = allLatest.filter((a: Article) => a.id !== article.id).slice(0, 5);

  return (
    <>
      <ViewIncrementor id={article.id} documentId={article.documentId} currentViews={article.views || 0} type="article" />
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
          src={getImageUrl(article.coverImage.url) || ""}
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
                      src={getImageUrl(newsItem.coverImage.url) || ""}
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
                More News
              </Link>
            </div>
          </>
        ) : (
          <p>No latest news available.</p>
        )}
      </section>

      {/* COMMENTS (BOTTOM) */}
      <ArticleCommentsSection initialComments={commentsRes.data || []} articleId={article.id} />

    </article>
    </>
  );
}
