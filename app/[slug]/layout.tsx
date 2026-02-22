import { fetchFromStrapi } from "../../lib/strapi";
import ProfileTabs from "./ProfileTabs";

type Profile = {
  id: number;
  name: string;
  slug: string;
  profileType: string;
  shortBio: string;
  detailedBio?: string;
  profileImage?: {
    url: string;
  };
  views?: number;
};

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export default async function ProfileLayout({ params, children }: Props) {
  const { slug } = await params;

  // First, check if this is a profile slug by fetching from profiles
  const profileRes = await fetchFromStrapi(
    `/profiles?filters[slug][$eq]=${slug}&populate=coverImage&populate=profileImage`
  );

  const profile: Profile | undefined = profileRes.data?.[0];

  if (!profile) {
    // If no profile found, return 404 - this allows other routes to work
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Page not found</h1>
      </div>
    );
  }

  return (
    <ProfileTabs profile={profile}>
      {children}
    </ProfileTabs>
  );
}
