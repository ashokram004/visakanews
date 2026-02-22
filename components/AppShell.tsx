"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import MainNav from "./MainNav";
import Footer from "./Footer";
import SearchBar from "./SearchBar";
import Advertisement from "./Advertisement";
import { trackPageView } from "../lib/analytics";
import { fetchAdvertisements } from "../lib/strapi";

type Ad = {
  id: number;
  title: string;
  image: {
    url: string;
    alternativeText?: string;
  };
  link?: string;
};

type Props = {
  children: React.ReactNode;
  headerAds?: Ad[];
};

// Top-level routes that should NOT be treated as profile pages
const TOP_LEVEL_ROUTES = ['/', '/news', '/videos', '/search', '/topics', '/profiles'];

export default function AppShell({ children, headerAds = [] }: Props) {
  const pathname = usePathname();
  
  // Check if this is a profile page at root level (e.g., /name or /name/achievements)
  // It's a profile page if:
  // 1. It starts with /profiles/ (old route) OR
  // 2. It's a root-level slug path (e.g., /name or /name/tab) but NOT a top-level route
  const isOldProfilePage = pathname.startsWith("/profiles/");
  
  // Get the first segment after "/" (e.g., "name" from "/name/achievements")
  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];
  
  // It's a profile page if the first segment is NOT in our top-level routes list
  const isRootLevelProfilePage = firstSegment && !TOP_LEVEL_ROUTES.includes("/" + firstSegment) && !TOP_LEVEL_ROUTES.includes(firstSegment);
  
  const isProfilePage = isOldProfilePage || isRootLevelProfilePage;

  useEffect(() => {
    let pageType = 'other';
    if (pathname === '/') {
      pageType = 'home';
    } else if (pathname.startsWith('/news')) {
      pageType = 'news';
    } else if (pathname.startsWith('/news/')) {
      pageType = 'article';
    } else if (pathname.startsWith('/profiles')) {
      pageType = 'profiles';
    } else if (pathname.startsWith('/profiles/')) {
      pageType = 'profile';
    } else if (pathname.startsWith('/videos')) {
      pageType = 'videos';
    } else if (pathname.startsWith('/search')) {
      pageType = 'search';
    } else if (pathname.startsWith('/topics/')) {
      pageType = 'dynamicTabs';
    }

    trackPageView({
      pageUrl: window.location.href,
      pageType
    });
  }, [pathname]);

  if (isProfilePage) {
    return (
      <div className="app-shell">
        <div className="page-wrapper">
          {/* Left side images - Desktop only */}
          <aside className="side-ad profile-side desktop-only">
            <div className="ad-box profile-image-placeholder">Profile Image Left</div>
          </aside>

          {/* Center content */}
          <div className="center-column">
            <main className="site-main">{children}</main>

            {/* Bottom images - Mobile only */}
            <div className="profile-bottom-images mobile-only">
              <div className="profile-image-placeholder bottom">Profile Image Left</div>
              <div className="profile-image-placeholder bottom">Profile Image Right</div>
            </div>

            {/* ================= FOOTER ================= */}
            <Footer />
          </div>

          {/* Right side images - Desktop only */}
          <aside className="side-ad profile-side desktop-only">
            <div className="ad-box profile-image-placeholder">Profile Image Right</div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="page-wrapper">
        {/* ========== LEFT AD RAIL (DESKTOP ONLY) ========== */}
        <aside className="side-ad">
          <div className="ad-box">Google Ad</div>
        </aside>

        {/* ========== CENTER CONTENT ========== */}
        <div className="center-column">
          {/* ================= HEADER ================= */}
          <header className="site-header">
            <div className="logo">
              <Link href="/">
                <img
                  src="/logoJPG.jpg"
                  alt="Visaka News"
                  className="site-logo"
                />
              </Link>
            </div>

            <Advertisement ads={headerAds} className="header-ad" />

            {/* Mobile Search Bar */}
            <div className="mobile-search mobile-only">
              <SearchBar />
            </div>
          </header>

          {/* ================= NAV ================= */}
          <MainNav />

          {/* ================= MAIN ================= */}
          <main className="site-main">{children}</main>

          {/* ================= FOOTER ================= */}
          <Footer />
        </div>

        {/* ========== RIGHT AD RAIL (DESKTOP ONLY) ========== */}
        <aside className="side-ad">
          <div className="ad-box">Google Ad</div>
        </aside>
      </div>
    </div>
  );
}
