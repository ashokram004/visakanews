export async function trackPageView(data: {
  pageUrl: string;
  pageType: string;
}) {
  try {
    // Check if this page has already been tracked in this session
    const trackedPages = sessionStorage.getItem("tracked_pages");
    const trackedPagesSet = trackedPages ? new Set(JSON.parse(trackedPages)) : new Set();
    
    // Skip if this page URL was already tracked in this session
    if (trackedPagesSet.has(data.pageUrl)) {
      return;
    }
    
    // Add this page to the tracked set and persist in sessionStorage
    trackedPagesSet.add(data.pageUrl);
    sessionStorage.setItem("tracked_pages", JSON.stringify([...trackedPagesSet]));

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
