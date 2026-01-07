import { fetchFromStrapi } from "../../../../lib/strapi";

/* -------------------- Types -------------------- */

type Activity = {
  id: number;
  title: string;
  description?: any;
  date?: string;
};

type Props = {
  params: Promise<{ slug: string }>;
};

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
    `/profile-activities?filters[profile][id][$eq]=${profile.id}&sort=order:asc`
  );

  const activities: Activity[] = activitiesRes.data || [];

  return (
    <section>
      <ul className="profile-list">
        {activities.map((a) => (
          <li key={a.id}>
            <strong>{a.title}</strong>
            {a.date && <span> ({a.date})</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
