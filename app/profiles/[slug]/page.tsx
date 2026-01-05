import { fetchFromStrapi } from "../../../lib/strapi";
import ProfileTabs from "./ProfileTabs";

/* -------------------- Types -------------------- */

type Article = {
  id: number;
  title: string;
  slug: string;
};

type Video = {
  id: number;
  title: string;
  embedUrl: string;
};

type Profile = {
  id: number;
  name: string;
  slug: string;
  profileType: "POLITICIAN" | "CELEBRITY";
  shortBio: string;
  articles?: Article[];
  videos?: Video[];
};

type Achievement = {
  id: number;
  title: string;
  description?: any;
  year?: number;
};

type Activity = {
  id: number;
  title: string;
  description?: any;
  date?: string;
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProfileDetailPage({ params }: Props) {
  const { slug } = await params;

  /* -------- Profile -------- */
  const profileRes = await fetchFromStrapi(
    `/profiles?filters[slug][$eq]=${slug}&populate[profileImage]=true&populate[articles][populate]=coverImage&populate[videos]=true`
  );

  const profile: Profile | undefined = profileRes.data?.[0];

  if (!profile) {
    return <h1>Profile not found</h1>;
  }

  /* -------- Achievements -------- */
  const achievementsRes = await fetchFromStrapi(
    `/profile-achievements?filters[profile][id][$eq]=${profile.id}&sort=order:asc`
  );

  /* -------- Activities -------- */
  const activitiesRes = await fetchFromStrapi(
    `/profile-activities?filters[profile][id][$eq]=${profile.id}&sort=order:asc`
  );

  return (
    <ProfileTabs
      profile={profile}
      achievements={achievementsRes.data}
      activities={activitiesRes.data}
    />
  );
}
