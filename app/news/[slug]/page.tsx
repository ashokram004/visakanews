import { toEmbedUrl } from "@/lib/video";
import { fetchFromStrapi } from "../../../lib/strapi";
import ArticleShare from "@/components/ArticleShare";
import ArticleComments from "@/components/ArticleComments";
import ArticleCommentForm from "@/components/ArticleCommentForm";

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

      const imageUrl = rawUrl.startsWith("http")
        ? rawUrl
        : `http://localhost:1337${rawUrl}`;

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

      {/* SHARE ICONS */}
      <ArticleShare url={articleUrl} />

      {article.coverImage && (
        <img
          className="article-cover"
          src={`http://localhost:1337${article.coverImage.url}`}
          alt={article.coverImage.alternativeText || ""}
        />
      )}

      {/* CONTENT */}
      <div className="article-content">
        {renderContent(article.content)}
      </div>

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

      {/* COMMENTS (BOTTOM) */}
      <ArticleCommentForm articleId={article.id} />

      <ArticleComments comments={commentsRes.data || []} />

    </article>
  );
}
