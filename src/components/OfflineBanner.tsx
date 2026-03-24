import { useState, useEffect } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Offline Banner Component
 * 🛰️ Uses navigator.onLine to detect and display network status.
 * 🏗️ Integrated with our PWA caching strategy to ensure user confidence.
 */
export default function OfflineBanner() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showStatus, setShowStatus] = useState(false);
    const [userDismissed, setUserDismissed] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowStatus(true);
            setUserDismissed(false);
            setTimeout(() => {
                setShowStatus(false);
            }, 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowStatus(true);
            setUserDismissed(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial check to show status if starting offline
        if (!navigator.onLine) {
            handleOffline();
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const close = () => {
        setUserDismissed(true);
    };

    const isVisible = showStatus && !userDismissed;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-[99999]"
                >
                    <div className={cn(
                        "flex items-center gap-5 p-4 pr-5 rounded-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-colors duration-500 min-w-[320px] max-w-sm",
                        isOnline ? "bg-white border-emerald-100" : "bg-slate-900 border-slate-800"
                    )}>
                        <div className={cn(
                            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                            isOnline ? "bg-emerald-50 text-emerald-600" : "bg-slate-800 text-slate-300"
                        )}>
                            {isOnline ? <Wifi size={20} strokeWidth={2.5} /> : <WifiOff size={20} strokeWidth={2.5} />}
                        </div>

                        <div className="flex-1">
                            <h4 className={cn(
                                "text-[13px] font-bold tracking-tight",
                                isOnline ? "text-slate-900" : "text-white"
                            )}>
                                {isOnline ? "Back Online" : "System Offline"}
                            </h4>
                        </div>

                        {!isOnline ? (
                            <button
                                onClick={close}
                                className="flex-shrink-0 px-3 py-2 bg-white text-slate-950 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 active:scale-95 transition-all shadow-sm"
                            >
                                Dismiss
                            </button>
                        ) : (
                            <button
                                onClick={close}
                                className="text-slate-400 hover:text-slate-600 active:scale-90 transition-all p-1"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Utility to merge classes
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
