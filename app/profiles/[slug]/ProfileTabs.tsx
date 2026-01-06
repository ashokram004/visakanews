"use client";

import { useState } from "react";
import Link from "next/link";
import { toEmbedUrl } from "../../../lib/video";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

/* -------------------- Types -------------------- */

type Article = {
  id: number;
  title: string;
  slug: string;
  publishedAt?: string;
  coverImage?: {
    url: string;
  };
};

type Video = {
  id: number;
  title: string;
  embedUrl: string;
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

type Profile = {
  name: string;
  profileType: "POLITICIAN" | "CELEBRITY";
  shortBio: string;
  detailedBio?: string;
  profileImage?: {
    url: string;
  };
  articles?: Article[];
  videos?: Video[];
};

type Props = {
  profile: Profile;
  achievements: Achievement[];
  activities: Activity[];
};

/* -------------------- Helpers -------------------- */

function richTextToPlainText(blocks: any[]): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((b) => b.children?.map((c: any) => c.text).join(""))
    .join("\n");
}

function getImageUrl(url?: string) {
  if (!url) return null;
  return url.startsWith("http")
    ? url
    : STRAPI_URL + url;
}

/* -------------------- Component -------------------- */

export default function ProfileTabs({
  profile,
  achievements,
  activities,
}: Props) {
  const articles = profile.articles || [];
  const videos = profile.videos || [];

  const [activeTab, setActiveTab] = useState<
    "home" | "news" | "achievements" | "activities" | "videos"
  >("home");

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
          {["home", "news", "achievements", "activities", "videos"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={activeTab === tab ? "active" : ""}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
        </nav>
      </header>

      {/* ================= CONTENT ================= */}
      <div className="profile-content">
        {/* HOME */}
        {activeTab === "home" && (
          <section className="profile-home">
            {profile.shortBio && <p>{profile.shortBio}</p>}
            {profile.detailedBio && <p>{profile.detailedBio}</p>}
          </section>
        )}

        {/* NEWS – POLISHED, SAME AS MAIN NEWS */}
        {activeTab === "news" && (
          <section className="news-page">
            {articles.length === 0 ? null : (
              <ul className="news-list-page">
                {articles.map((a) => (
                  <li key={a.id} className="news-item">
                    {a.coverImage && (
                      <img
                        src={getImageUrl(a.coverImage.url)!}
                        alt={a.title}
                        className="news-thumb"
                      />
                    )}

                    <div className="news-info">
                      <Link href={`/news/${a.slug}`}>
                        <h3 className="news-title">{a.title}</h3>
                      </Link>

                      {a.publishedAt && (
                        <div className="news-date">
                          {new Date(a.publishedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* ACHIEVEMENTS */}
        {activeTab === "achievements" && (
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
        )}

        {/* ACTIVITIES */}
        {activeTab === "activities" && (
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
        )}

        {/* VIDEOS */}
        {activeTab === "videos" && (
          <section>
            {videos.map((v) => (
              <div key={v.id} className="profile-video">
                <h4>{v.title}</h4>
                <iframe
                  src={toEmbedUrl(v.embedUrl)}
                  title={v.title}
                  allowFullScreen
                />
              </div>
            ))}
          </section>
        )}
      </div>
    </section>
  );
}
