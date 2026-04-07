import { useEffect, useState } from "react";

const MIN_DISPLAY_MS = 4000; // always visible for at least 4 seconds

/**
 * Premium Page Loader with the Ta'ang Land emblem.
 * Shows for a minimum of 4 seconds (Suspense lazy-load fallback).
 * The page refresh case is covered by the native HTML splash in index.html.
 */
export default function PageLoader() {
    const [visible, setVisible] = useState(true);
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Tiny delay so the fade-in feels deliberate
        const showTimer = setTimeout(() => setShow(true), 80);

        // Keep visible for at least MIN_DISPLAY_MS
        const hideTimer = setTimeout(() => setVisible(false), MIN_DISPLAY_MS);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{
                background: "#ffffff",
                opacity: show ? 1 : 0,
                transition: "opacity 0.4s ease-in",
            }}
        >
            {/* Orbital ring container */}
            <div className="relative" style={{ width: 160, height: 160 }}>

                {/* Outer rotating ring */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 160 160"
                    style={{ animation: "loader-ring-spin 3s linear infinite" }}
                >
                    <defs>
                        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%"   stopColor="#D4AF37" stopOpacity="1" />
                            <stop offset="50%"  stopColor="#228B22" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                    <circle
                        cx="80" cy="80" r="72"
                        fill="none"
                        stroke="url(#ring-grad)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="340 120"
                    />
                </svg>

                {/* Counter-spin inner ring */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 160 160"
                    style={{ animation: "loader-ring-spin 5s linear infinite reverse" }}
                >
                    <circle
                        cx="80" cy="80" r="66"
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeDasharray="60 350"
                        opacity="0.35"
                    />
                </svg>

                {/* Orbiting dot */}
                <div
                    className="absolute inset-0"
                    style={{ animation: "loader-ring-spin 3s linear infinite" }}
                >
                    <div
                        className="absolute rounded-full"
                        style={{
                            width: 8, height: 8,
                            background: "linear-gradient(135deg, #D4AF37, #c9a02e)",
                            boxShadow: "0 0 12px rgba(212,175,55,0.6)",
                            top: 2, left: "50%",
                            transform: "translateX(-50%)",
                        }}
                    />
                </div>

                {/* Center emblem with breathing animation */}
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ animation: "loader-breathe 2.5s ease-in-out infinite" }}
                >
                    <img
                        src="/image.png"
                        alt="Ta'ang Land Emblem"
                        className="rounded-full"
                        style={{
                            width: 100, height: 100,
                            objectFit: "contain",
                            filter: "drop-shadow(0 2px 12px rgba(212,175,55,0.3))",
                        }}
                    />
                </div>
            </div>

            {/* Loading text + bouncing dots */}
            <div className="mt-8 flex flex-col items-center gap-2">
                <p
                    className="text-sm font-semibold tracking-[0.2em] uppercase padauk-bold"
                    style={{
                        color: "#6b5c3e",
                        animation: "loader-text-fade 2s ease-in-out infinite",
                    }}
                >
                    Loading
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="rounded-full"
                            style={{
                                width: 5, height: 5,
                                backgroundColor: "#D4AF37",
                                animation: `loader-dot-bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                            }}
                        />
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes loader-ring-spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes loader-breathe {
                    0%, 100% { transform: scale(1);    opacity: 1;   }
                    50%      { transform: scale(1.06); opacity: 0.85; }
                }
                @keyframes loader-text-fade {
                    0%, 100% { opacity: 0.5; }
                    50%      { opacity: 1;   }
                }
                @keyframes loader-dot-bounce {
                    0%, 80%, 100% { transform: translateY(0);    opacity: 0.4; }
                    40%           { transform: translateY(-6px); opacity: 1;   }
                }
            `}</style>
        </div>
    );
}
