import { fetchFromStrapi } from "../../../lib/strapi";

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

type Activity = {
  id: number;
  title: string;
  description?: ContentBlock[];
  date?: string;
  publishedAt: string;
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
              src={firstLink.url}
              width="100%"
              height="400"
              allowFullScreen
            />
          </div>
        );
      }

      return (
        <p key={index} style={{ whiteSpace: "pre-wrap", textAlign: "justify", textJustify: "inter-word" }}>
          {block.children && block.children.length > 0 ? block.children.map((c: any, i: number) => {
            return <span key={i}>{c.text}</span>;
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
            className="activity-image"
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

export default async function ProfileActivitiesPage({ params }: Props) {
  const { slug } = await params;

  const profileRes = await fetchFromStrapi(
    `/profiles?filters[slug][$eq]=${slug}&populate[profile_activities]=true`
  );

  const profile = profileRes.data?.[0];

  if (!profile) {
    return <h1>Profile not found</h1>;
  }

  const activities: Activity[] = (profile?.profile_activities || []).sort((a: Activity, b: Activity) => {
    // Items with date come first, sorted by date descending
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (a.date) return -1;
    if (b.date) return 1;
    // Items without date, sorted by publishedAt descending (latest first)
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  }) || [];

  return (
    <section>
      <ul className="profile-list">
        {activities.map((a) => (
          <li key={a.id}>
            <strong>
              {a.title}
              {a.date && ` (${new Date(a.date).toLocaleDateString()})`}
            </strong>
            {a.description && (
              <div>{renderContent(a.description)}</div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
