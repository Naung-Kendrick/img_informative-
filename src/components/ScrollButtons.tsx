import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowUp } from "lucide-react";

export default function ScrollButtons() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show the scroll-to-top button after scrolling down 400px
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility, { passive: true });
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible) return null;

    // Use a React Portal to attach the button directly to the body.
    // This prevents any CSS transforms or animations on parent containers 
    // from breaking the "fixed" positioning context.
    const buttonElement = (
        <div className="fixed bottom-10 right-10 z-[9999] animate-in fade-in slide-in-from-bottom-8 duration-500">
            <button
                onClick={scrollToTop}
                className="h-14 w-14 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.25)] transition-all duration-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Scroll to top"
                title="Scroll to Top"
            >
                <ArrowUp size={24} strokeWidth={2.5} />
            </button>
        </div>
    );

    // Only render portal in browser environment
    if (typeof document === "undefined") return null;

    return createPortal(buttonElement, document.body);
}
