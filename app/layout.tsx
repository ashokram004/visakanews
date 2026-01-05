import Link from "next/link";
import "./globals.css";
import MainNav from "../components/MainNav";
import { fetchFromStrapi } from "@/lib/strapi";
import {
  FacebookIcon,
  TwitterIcon,
  LinkedInIcon,
  YouTubeIcon,
} from "../components/FooterIcons";
import SearchBox from "@/components/SearchBox";


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const authorRes = await fetchFromStrapi(
    "/authors?pagination[pageSize]=1"
  );
  
  const author = authorRes?.data?.[0];
  
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
                  <Link href="/">
                    <img
                      src="/logoJPG.jpg"
                      alt="Visaka News"
                      className="site-logo"
                    />
                  </Link>
                </div>

                <div className="header-ad">Header Advertisement</div>
              </header>


              {/* ================= NAV ================= */}
              <MainNav />

              {/* ================= MAIN ================= */}
              <main className="site-main">{children}</main>

              {/* ================= FOOTER ================= */}
              <footer className="site-footer">
                <div className="footer-top">

                  {/* About */}
                  <div className="footer-brand">
                    <img
                      src="/logoJPG.jpg"
                      alt="Visaka News"
                      className="footer-logo"
                    />
                    <p>
                      Trusted source for latest news, politics, movies and regional updates.
                    </p>
                  </div>


                  {/* Quick Links */}
                  <div>
                    <strong>Quick Links</strong>
                    <ul>
                      <li><Link href="/news">News</Link></li>
                      <li><Link href="/profiles">Profiles</Link></li>
                      <li><Link href="/videos">Videos</Link></li>
                    </ul>
                  </div>

                  {/* Contact */}
                  <div className="footer-contact">
                    <strong>Contact</strong>

                    {author?.name && <p>{author.name}</p>}
                    {author?.contact && <p>📞 +91 {author.contact}</p>}
                    {author?.mail && <p>✉️ {author.mail}</p>}

                    {/* Social Icons */}
                    <div className="footer-social">
                      {author?.facebook && (
                        <a href={author.facebook} target="_blank" aria-label="Facebook">
                          <FacebookIcon />
                        </a>
                      )}

                      {author?.twitter && (
                        <a href={author.twitter} target="_blank" aria-label="Twitter">
                          <TwitterIcon />
                        </a>
                      )}

                      {author?.linkedin && (
                        <a href={author.linkedin} target="_blank" aria-label="LinkedIn">
                          <LinkedInIcon />
                        </a>
                      )}

                      {author?.youtube && (
                        <a href={author.youtube} target="_blank" aria-label="YouTube">
                          <YouTubeIcon />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="footer-bottom">
                  © {new Date().getFullYear()} VisakaNews. All rights reserved.
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
