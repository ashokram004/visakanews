import Link from "next/link";
import "./globals.css";
import MainNav from "../components/MainNav";
import Footer from "../components/Footer";
import SearchBox from "@/components/SearchBox";


export default function RootLayout({
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
              <Footer />
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
