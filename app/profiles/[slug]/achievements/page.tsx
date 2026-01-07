import { fetchFromStrapi } from "../../../../lib/strapi";

/* -------------------- Types -------------------- */

type Achievement = {
  id: number;
  title: string;
  description?: any;
  year?: number;
};

type Props = {
  params: Promise<{ slug: string }>;
};

/* -------------------- Helpers -------------------- */

function richTextToPlainText(blocks: any[]): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((b) => b.children?.map((c: any) => c.text).join(""))
    .join("\n");
}

export default async function ProfileAchievementsPage({ params }: Props) {
  const { slug } = await params;

  const profileRes = await fetchFromStrapi(
    `/profiles?filters[slug][$eq]=${slug}`
  );

  const profile = profileRes.data?.[0];

  if (!profile) {
    return <h1>Profile not found</h1>;
  }

  const achievementsRes = await fetchFromStrapi(
    `/profile-achievements?filters[profile][id][$eq]=${profile.id}&sort=order:asc`
  );

  const achievements: Achievement[] = achievementsRes.data || [];

  return (
    <section>
      <ul className="profile-list">
        {achievements.map((a) => (
          <li key={a.id}>
            <strong>
              {a.title}
              {a.year && ` (${a.year})`}
            </strong>
            {a.description && (
              <p>{richTextToPlainText(a.description)}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
