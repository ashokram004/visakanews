"use client";

import { useEffect } from "react";
import { trackPageView } from "../lib/analytics";

interface AnalyticsTrackerProps {
  pageType: string;
  articleId?: number;
  profileId?: number;
}

export default function AnalyticsTracker({ pageType, articleId, profileId }: AnalyticsTrackerProps) {
  useEffect(() => {
    trackPageView({
      pageUrl: window.location.href,
      pageType,
      articleId,
      profileId,
    });
  }, [pageType, articleId, profileId]);

  return null; // This component doesn't render anything
}
