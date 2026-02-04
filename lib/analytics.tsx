export async function trackPageView(data: {
  pageUrl: string;
  pageType: string;
  articleId?: number;
  profileId?: number;
}) {
  try {
    const sessionId =
      localStorage.getItem("session_id") ||
      crypto.randomUUID();

    localStorage.setItem("session_id", sessionId);

    const device =
      window.innerWidth < 768
        ? "mobile"
        : window.innerWidth < 1024
        ? "tablet"
        : "desktop";

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/analytics`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            pageUrl: data.pageUrl,
            pageType: data.pageType,
            article: data.articleId ? { id: data.articleId } : null,
            profile: data.profileId ? { id: data.profileId } : null,
            sessionId,
            device,
            referrer: document.referrer || "direct",
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          },
        }),
      }
    );
  } catch (err) {
    console.error("Analytics error", err);
  }
}
