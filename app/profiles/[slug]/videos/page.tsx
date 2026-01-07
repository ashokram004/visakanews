import { fetchFromStrapi } from "../../../../lib/strapi";
import { toEmbedUrl } from "../../../../lib/video";

/* -------------------- Types -------------------- */

type Video = {
  id: number;
  title: string;
  embedUrl: string;
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProfileVideosPage({ params }: Props) {
  const { slug } = await params;

  const profileRes = await fetchFromStrapi(
    `/profiles?filters[slug][$eq]=${slug}&populate[videos]=true`
  );

  const profile = profileRes.data?.[0];
  const videos: Video[] = profile?.videos || [];

  return (
    <section>
      {videos.map((v) => (
        <div key={v.id} className="profile-video">
          <h4>{v.title}</h4>
          <iframe
            src={toEmbedUrl(v.embedUrl)}
            title={v.title}
            allowFullScreen
          />
        </div>
      ))}
    </section>
  );
}
