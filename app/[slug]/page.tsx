import { fetchFromStrapi } from "../../lib/strapi";
import { toEmbedUrl } from "../../lib/video";
import { incrementView } from "../../lib/actions";
import ViewIncrementor from "@/components/ViewIncrementor";

type Props = {
  params: Promise<{ slug: string }>;
};

type ContentBlock = {
  type: string;
  children?: any[];
  image?: {
    url: string;
    alternativeText?: string;
  };
};

type Profile = {
  id: number;
  documentId: string;
  slug: string;
  shortBio?: string;
  homeVideo?: string;
  detailedBio?: ContentBlock[];
  biography?: ContentBlock[];
  coverImage?: {
    url: string;
    alternativeText?: string;
  };
  profileImage?: {
    url: string;
  };
  views?: number;
  mobileNo?: string;
  address?: string;
  location?: string;
  mailId?: string;
};

/* -------------------- Helpers -------------------- */

function renderContent(blocks: ContentBlock[]) {
  return blocks.map((block, index) => {
    /* ---------- PARAGRAPH ---------- */
    if (block.type === "paragraph" && block.children) {
      return (
        <p key={index} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {block.children.map((c: any, i: number) => {
            return <span key={i}>{c.text}</span>;
          })}
        </p>
      );
    }

    /* ---------- IMAGE ---------- */
    if (block.type === "image" && block.image?.url) {
      return (
        <figure key={index} style={{ margin: "24px 0" }}>
          <img
            src={block.image.url}
            alt={block.image.alternativeText || ""}
            style={{
              maxWidth: "100%",
              width: "100%",
              height: "auto",
              display: "block",
              margin: "0 auto",
            }}
          />
        </figure>
      );
    }

    return null;
  });
}

function renderDetailedBioContent(blocks: ContentBlock[]) {
  return blocks.map((block, index) => {
    /* ---------- PARAGRAPH ---------- */
    if (block.type === "paragraph" && block.children) {
      // Combine all children texts, then split by newlines to process line-by-line
      const fullText = block.children.map((c: any) => c.text).join("");
      const lines = fullText.split("\n");

      return (
        <div key={index} style={{ marginBottom: "16px" }}>
          {lines.map((line, lineIndex) => {
            const trimmedLine = line.trim();
            // Ignore empty lines and the "Drag" text accidentally copied from Strapi
            if (!trimmedLine || trimmedLine === "Drag") return null;

            const dashIndex = trimmedLine.indexOf("-");
            if (dashIndex !== -1) {
              // We use the very first dash as the separator for Key & Value
              const key = trimmedLine.substring(0, dashIndex).trim();
              const value = trimmedLine.substring(dashIndex + 1).trim();

              return (
                <div key={lineIndex} style={{ display: "flex", gap: "16px", marginBottom: "12px", alignItems: "flex-start" }}>
                  <strong style={{ flex: "0 0 35%", wordBreak: "break-word" }}>{key}</strong>
                  <span style={{ flex: "1 1 auto", wordBreak: "break-word" }}>{value}</span>
                </div>
              );
            }

            // Normal text (no dashes found)
            return (
              <p key={lineIndex} style={{ marginBottom: "12px", wordBreak: "break-word" }}>
                {trimmedLine}
              </p>
            );
          })}
        </div>
      );
    }

    /* ---------- IMAGE ---------- */
    if (block.type === "image" && block.image?.url) {
      return (
        <figure key={index} style={{ margin: "24px 0" }}>
          <img
            src={block.image.url}
            alt={block.image.alternativeText || ""}
            style={{
              maxWidth: "100%",
              width: "100%",
              height: "auto",
              display: "block",
              margin: "0 auto",
            }}
          />
        </figure>
      );
    }

    return null;
  });
}

export default async function ProfileHomePage({ params }: Props) {
  const { slug } = await params;

  const profileRes = await fetchFromStrapi(
    `/profiles?filters[slug][$eq]=${slug}&populate=coverImage&populate=profileImage`
  );

  const profile = profileRes.data?.[0];

  if (!profile) {
    return <h1>Profile not found</h1>;
  }

  return (
    <>
      <ViewIncrementor id={profile.id} documentId={profile.documentId} currentViews={profile.views || 0} type="profile" />
      <section className="profile-home">
      {profile.shortBio && <p style={{ whiteSpace: "pre-wrap" }}>{profile.shortBio}</p>}
      {profile.homeVideo && (
        <div className="profile-home-video">
          <iframe
            src={toEmbedUrl(profile.homeVideo)}
            width="100%"
            height="420"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      {profile.detailedBio && (
        <div className="profile-detailed-bio">
          {renderDetailedBioContent(profile.detailedBio)}
        </div>
      )}
      {profile.biography && (
        <div className="profile-biography" style={{ marginTop: "24px" }}>
          <h2>Biography</h2>
          {renderContent(profile.biography)}
        </div>
      )}
    </section>
    </>
  );
}
