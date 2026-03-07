"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

/* -------------------- Types -------------------- */

type Profile = {
  name: string;
  profileType: string;
  shortBio: string;
  detailedBio?: string;
  profileImage?: {
    url: string;
  };
  coverImage?: {
    url: string;
  };
  views?: number;
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

  const tabs = ["home", "achievements", "videos", "activities", "contact"];
  
  // For root-level paths like /slug, /slug/achievements, etc.
  const activeTab = pathname === `/${slug}` ? "home" : tabs.find(tab => pathname.endsWith(`/${tab}`)) || null;

  return (
    <section className="profile-detail-page">
      {/* ================= COVER PICTURE ================= */}
      <div className="profile-cover" style={{ position: 'relative' }}>
        <img
          src={getImageUrl(profile.coverImage?.url) || "/placeholder-cover.jpg"}
          alt="Cover"
          className="cover-image"
        />
        <div className="profile-views-overlay" style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: 'clamp(12px, 2vw, 14px)', color: '#fff', background: 'rgba(0,0,0,0.6)', padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)', borderRadius: '6px', fontWeight: '500' }}>👁 {profile.views || 0} views</div>
      </div>

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
            {profile.profileType ? profile.profileType.split(',').map((type, index) => (
              <span key={index} className="profile-type">{type.trim().toUpperCase()}</span>
            )) : ""}
          </div>
        </div>

        {/* Tabs - Updated to use root-level paths */}
        <nav className="profile-tabs">
          {tabs.map((tab) => (
            <Link
              key={tab}
              href={tab === "home" ? `/${slug}` : `/${slug}/${tab}`}
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
