import Link from "next/link";
import Image from "next/image";
import { fetchFromStrapi } from "../../lib/strapi";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

type Profile = {
  id: number;
  name: string;
  slug: string;
  profileType: string;
  isActive: boolean;
  profileImage?: {
    url: string;
  };
};

export default async function ProfilesPage() {
  const data = await fetchFromStrapi(
    "/profiles?filters[isActive][$eq]=true&sort=name:asc&populate=coverImage&&populate=profileImage&pagination[pageSize]=50"
  );
  
  const profiles: Profile[] = data.data.sort((a: { name: string; }, b: { name: any; }) =>
    a.name.localeCompare(b.name)
  );


  return (
    <div className="profiles-page">
      <div className="profiles-grid compact">
        {profiles.map((profile) => (
          <Link
            key={profile.id}
            href={`/${profile.slug}`}
            className="profile-card compact"
          >
            <div className="profile-card-row">
              {profile.profileImage && (
                <img
                  src={
                    profile.profileImage.url.startsWith("http")
                      ? profile.profileImage.url
                      : STRAPI_URL + profile.profileImage.url
                  }
                  alt={profile.name}
                  className="profile-card-avatar"
                />
              )}

              <div className="profile-card-info">
                <div className="profile-card-name">{profile.name}</div>
                {profile.profileType ? (
                  <div className="profile-badges-wrapper">
                    {profile.profileType.split(',').map((type, index) => (
                      <span key={index} className="profile-badge">{type.trim().toUpperCase()}</span>
                    ))}
                  </div>
                ) : ""}
                <div className="profile-read-more">read more...</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
