import { useEffect, useState } from "react";

// Lazy load Analytics to avoid React 19 compatibility issues
export function AnalyticsWrapper() {
  const [AnalyticsComponent, setAnalyticsComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    // Dynamically import Analytics only in production
    if (typeof window !== "undefined" && import.meta.env.PROD) {
      import("@vercel/analytics/react").then((mod) => {
        setAnalyticsComponent(() => mod.Analytics);
      }).catch(() => {
        // Silently fail if analytics fails to load
        console.warn("Analytics failed to load");
      });
    }
  }, []);

  if (!AnalyticsComponent) {
    return null;
  }

  return <AnalyticsComponent />;
}

export default AnalyticsWrapper;
