import { fetchFromStrapi } from "../../../lib/strapi";
import ProfileTabs from "./ProfileTabs";

type Profile = {
  id: number;
  name: string;
  slug: string;
  profileType: "POLITICIAN" | "CELEBRITY";
  shortBio: string;
  detailedBio?: string;
  profileImage?: {
    url: string;
  };
};

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export default async function ProfileLayout({ params, children }: Props) {
  const { slug } = await params;

  const profileRes = await fetchFromStrapi(
    `/profiles?filters[slug][$eq]=${slug}&populate[profileImage]=true`
  );

  const profile: Profile | undefined = profileRes.data?.[0];

  if (!profile) {
    return <h1>Profile not found</h1>;
  }

  return (
    <ProfileTabs profile={profile}>
      {children}
    </ProfileTabs>
  );
}
