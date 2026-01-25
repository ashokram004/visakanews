import "./globals.css";
import AppShell from "../components/AppShell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body style={{ position: "relative" }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
