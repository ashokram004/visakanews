"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import MainNav from "./MainNav";
import Footer from "./Footer";
import SearchBar from "./SearchBar";

type Props = {
  children: React.ReactNode;
};

export default function AppShell({ children }: Props) {
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith("/profiles/");

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
