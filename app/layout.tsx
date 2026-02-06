import "./globals.css";
import AppShell from "../components/AppShell";
import { fetchAdvertisements } from "../lib/strapi";

type Ad = {
  id: number;
  title: string;
  image: {
    url: string;
    alternativeText?: string;
  };
  link?: string;
  position: string;
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsRes = await fetchAdvertisements();
  const allAds: Ad[] = adsRes.data || [];

  const headerAds = allAds.filter(ad => ad.position === 'headerAd');

  return (
    <html lang="en">
      <body style={{ position: "relative" }}>
        <AppShell headerAds={headerAds}>{children}</AppShell>
      </body>
    </html>
  );
}
