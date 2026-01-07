"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

/* -------------------- Types -------------------- */

type Profile = {
  name: string;
  profileType: "POLITICIAN" | "CELEBRITY";
  shortBio: string;
  detailedBio?: string;
  profileImage?: {
    url: string;
  };
};

type Props = {
  profile: Profile;
  children: React.ReactNode;
};

/* -------------------- Helpers -------------------- */

function getImageUrl(url?: string) {
  if (!url) return null;
  return url.startsWith("http")
    ? url
    : STRAPI_URL + url;
}

/* -------------------- Component -------------------- */

export default function ProfileTabs({ profile, children }: Props) {
  const pathname = usePathname();
  const params = useParams();
  const slug = params.slug as string;

  const tabs = ["home", "news", "achievements", "activities", "videos"];
  const activeTab = pathname === `/profiles/${slug}` ? "home" : tabs.find(tab => pathname.endsWith(`/${tab}`)) || null;

  return (
    <section className="profile-detail-page">
      {/* ================= HEADER ================= */}
      <header className="profile-header">
        <div className="profile-header-left">
          {profile.profileImage && (
            <img
              src={getImageUrl(profile.profileImage.url)!}
              alt={profile.name}
              className="profile-avatar"
            />
          )}

          <div>
            <h1 className="profile-name">{profile.name}</h1>
            <span className="profile-type">{profile.profileType}</span>
          </div>
        </div>

        {/* Tabs */}
        <nav className="profile-tabs">
          {tabs.map((tab) => (
            <Link
              key={tab}
              href={tab === "home" ? `/profiles/${slug}` : `/profiles/${slug}/${tab}`}
              className={activeTab === tab ? "active" : ""}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Link>
          ))}
        </nav>
      </header>

      {/* ================= CONTENT ================= */}
      <div className="profile-content">
        {children}
      </div>
    </section>
  );
}
