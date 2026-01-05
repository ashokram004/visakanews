import Link from "next/link";
import "./globals.css";
import MainNav from "../components/MainNav";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ position: "relative" }}>
        {/* ================= APP SHELL ================= */}
        <div className="app-shell">
          {/* ================= PAGE WRAPPER ================= */}
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
                  <Link href="/">VisakaNews</Link>
                </div>

                <div className="header-ad">Header Advertisement</div>

                <div className="search-box">
                  <input type="text" placeholder="Search news..." />
                </div>
              </header>

              {/* ================= NAV ================= */}
              <MainNav />

              {/* ================= MAIN ================= */}
              <main className="site-main">{children}</main>

              {/* ================= FOOTER ================= */}
              <footer className="site-footer">
                <div className="footer-top">
                  <div>
                    <strong>NewsSite</strong>
                    <p>
                      Trusted source for latest news, politics, movies and
                      updates.
                    </p>
                  </div>

                  <div>
                    <strong>Quick Links</strong>
                    <ul>
                      <li>
                        <Link href="/news">News</Link>
                      </li>
                      <li>
                        <Link href="/profiles">Profiles</Link>
                      </li>
                      <li>
                        <Link href="/videos">Videos</Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <strong>Follow Us</strong>
                    <p>Facebook · Twitter · YouTube</p>
                  </div>
                </div>

                <div className="footer-bottom">
                  © {new Date().getFullYear()} NewsSite. All rights reserved.
                </div>
              </footer>
            </div>

            {/* ========== RIGHT AD RAIL (DESKTOP ONLY) ========== */}
            <aside className="side-ad">
              <div className="ad-box">Google Ad</div>
            </aside>
          </div>
        </div>
      </body>
    </html>
  );
}
