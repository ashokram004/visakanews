import { toEmbedUrl } from "@/lib/video";
import { fetchFromStrapi } from "../../../lib/strapi";

/* -------------------- Types -------------------- */

type ContentBlock = {
  type: string;
  children?: { text: string }[];
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
  videos?: string[];
};

type Props = {
  params: Promise<{ slug: string }>;
};

/* -------------------- Helpers -------------------- */

function renderContent(blocks: any[]) {
  return blocks.map((block, index) => {
    /* -------- Paragraph -------- */
    if (block.type === "paragraph") {
      return (
        <p key={index}>
          {block.children?.map((c: any, i: number) => (
            <span key={i}>{c.text}</span>
          ))}
        </p>
      );
    }

    /* -------- Inline Image -------- */
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


function getEmbedUrl(url: string) {
  if (url.includes("youtube.com/watch")) {
    const id = url.split("v=")[1];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1];
    return `https://www.youtube.com/embed/${id}`;
  }

  return url;
}

/* -------------------- Page -------------------- */

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;

  const res = await fetchFromStrapi(
    `/articles?filters[slug][$eq]=${slug}&populate[coverImage]=true&populate[videos]=true`
  );

  const articles: Article[] = res.data;

  if (!articles || articles.length === 0) {
    return <h1>Article not found</h1>;
  }

  const article = articles[0];

  return (
    <article className="article-page">
      {/* Category */}
      {article.primaryCategory && (
        <div className="article-category">
          {article.primaryCategory}
        </div>
      )}

      {/* Title */}
      <h1 className="article-title">{article.title}</h1>

      {/* Meta */}
      <div className="article-meta">
        {new Date(article.publishedAt).toLocaleDateString()}
      </div>

      {/* Cover Image */}
      {article.coverImage && (
        <img
          className="article-cover"
          src={`http://localhost:1337${article.coverImage.url}`}
          alt={article.coverImage.alternativeText || ""}
        />
      )}

      {/* Content */}
      <div className="article-content">
        {renderContent(article.content)}
      </div>

      {/* Inline Ad */}
      <div className="article-ad">Advertisement</div>

      {/* Videos */}
      {/* ================= ARTICLE VIDEOS ================= */}
      {article.videos && article.videos.length > 0 && (
        <section className="article-videos">
          {article.videos.map((video: any) => (
            <iframe
              key={video.id}
              src={toEmbedUrl(video.embedUrl)}
              title={video.title}
              width="100%"
              height="400"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ))}
        </section>
      )}
    </article>
  );
}
