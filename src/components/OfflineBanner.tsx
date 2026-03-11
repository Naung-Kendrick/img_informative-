import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Offline Banner Component
 * 🛰️ Uses navigator.onLine to detect and display network status.
 * 🏗️ Integrated with our PWA caching strategy to ensure user confidence.
 */
export default function OfflineBanner() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showStatus, setShowStatus] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowStatus(true);
            setTimeout(() => setShowStatus(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowStatus(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <AnimatePresence>
            {showStatus && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className={cn(
                        "fixed top-0 left-0 right-0 z-[10000] p-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest shadow-xl pointer-events-none",
                        isOnline ? "bg-emerald-500 text-white" : "bg-rose-600 text-white"
                    )}
                >
                    {isOnline ? (
                        <>
                            <Wifi className="h-4 w-4" />
                            Connection Restored
                        </>
                    ) : (
                        <>
                            <WifiOff className="h-4 w-4" />
                            You are currently offline. Accessing cached content.
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Utility to merge classes
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
