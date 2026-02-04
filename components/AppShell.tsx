"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import MainNav from "./MainNav";
import Footer from "./Footer";
import SearchBar from "./SearchBar";
import { trackPageView } from "../lib/analytics";

type Props = {
  children: React.ReactNode;
};

export default function AppShell({ children }: Props) {
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith("/profiles/");

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

            <div className="header-ad">Header Advertisement</div>

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
