export async function trackPageView(data: {
  pageUrl: string;
  pageType: string;
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

    const response = await fetch(
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
            sessionId,
            device,
            referrer: document.referrer || "direct",
            userAgent: navigator.userAgent,
            timeStamp: new Date().toISOString(),
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Analytics error response:", error);
    }
  } catch (err) {
    console.error("Analytics error", err);
  }
}
