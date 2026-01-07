import { fetchFromStrapi } from "../../../lib/strapi";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProfileHomePage({ params }: Props) {
  const { slug } = await params;

  const profileRes = await fetchFromStrapi(
    `/profiles?filters[slug][$eq]=${slug}`
  );

  const profile = profileRes.data?.[0];

  if (!profile) {
    return <h1>Profile not found</h1>;
  }

  return (
    <section className="profile-home">
      {profile.shortBio && <p>{profile.shortBio}</p>}
      {profile.detailedBio && <p>{profile.detailedBio}</p>}
    </section>
  );
}
