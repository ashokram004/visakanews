import { fetchFromStrapi } from "../../../../lib/strapi";

/* -------------------- Types -------------------- */

type Activity = {
  id: number;
  title: string;
  description?: any;
  date?: string;
  publishedAt: string;
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

export default async function ProfileActivitiesPage({ params }: Props) {
  const { slug } = await params;

  const profileRes = await fetchFromStrapi(
    `/profiles?filters[slug][$eq]=${slug}`
  );

  const profile = profileRes.data?.[0];

  if (!profile) {
    return <h1>Profile not found</h1>;
  }

  const activitiesRes = await fetchFromStrapi(
    `/profile-activities?filters[profile][id][$eq]=${profile.id}`
  );

  const activities: Activity[] = activitiesRes.data.sort((a: Activity, b: Activity) => {
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
              <p>{richTextToPlainText(a.description)}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
