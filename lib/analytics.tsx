export async function trackPageView(data: {
  pageUrl: string;
  pageType: string;
}) {
  try {
    // ---- IP FILTER ----
    // Note: It is usually more performant to handle IP filtering on the backend.
    const blockedIPs = ["219.91.202.110", "103.170.50.13"]; // Replace with the IPs you want to block
    try {
      const ipRes = await fetch("https://api.ipify.org?format=json");
      if (ipRes.ok) {
        const { ip } = await ipRes.json();
        if (blockedIPs.includes(ip)) {
          return; // Skip analytics for blocked IPs
        }
      }
    } catch (e) {
      // Silently ignore IP fetch errors and proceed to the rest of the script
    }

    // ---- BOT FILTER ----
    const userAgent = navigator.userAgent.toLowerCase();

    const botPatterns = [
      "bot",
      "crawler",
      "spider",
      "googlebot",
      "googleother",
      "bingbot",
      "duckduckbot",
      "yandex",
      "baiduspider",
      "semrush",
      "ahrefs",
      "mj12bot",
      "dotbot",
      "bytespider",
      "gptbot",
      "claudebot",
      "localhost"
    ];

    const isBot = botPatterns.some(pattern => userAgent.includes(pattern));

    if (isBot || data.pageUrl.includes("localhost")) {
      // Skip analytics for bots
      return;
    }
    // --------------------

    // Check if this page has already been tracked in this session
    const trackedPages = sessionStorage.getItem("tracked_pages");
    const trackedPagesSet = trackedPages ? new Set(JSON.parse(trackedPages)) : new Set();

    if (trackedPagesSet.has(data.pageUrl)) {
      return;
    }

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