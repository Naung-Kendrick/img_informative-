import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useModal } from '../context/ModalContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PWA Updater Component
 * 🛰️ Listens for Service Worker events to handle updates and installation prompts.
 * 🚀 Goal: Immediate user feedback when new content/features are available.
 */
export default function PwaUpdater() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallBtn, setShowInstallBtn] = useState(false);
    const { showSuccess } = useModal();

    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r: ServiceWorkerRegistration | undefined) {
            console.log('SW Registered:', r);
        },
        onRegisterError(error: any) {
            console.error('SW Registration Error:', error);
        },
    });

    useEffect(() => {
        // 1. Handle Install Prompt
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBtn(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // 2. Handle Feedback (Disabled as per user request to remove notice box)
        /*
        if (offlineReady) {
            showSuccess('ဗားရှင်းအသစ်', 'အော့ဖ်လိုင်း အသုံးပြုရန် အဆင်သင့်ဖြစ်ပါပြီ။');
            setOfflineReady(false);
        }
        */

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, [offlineReady, setOfflineReady]);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowInstallBtn(false);
        }
        setDeferredPrompt(null);
    };

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    return (
        <>
            <AnimatePresence>
                {(needRefresh || showInstallBtn) && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-96 z-[9999]"
                    >
                        <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-black text-slate-800 tracking-tight">
                                        {needRefresh ? 'Update Available' : 'Install App'}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                        {needRefresh
                                            ? 'A new version of NOH Portal is ready. Refresh now to get the latest features.'
                                            : 'Install NOH Portal on your device for a faster, offline-capable experience.'}
                                    </p>
                                </div>
                                <button
                                    onClick={close}
                                    className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="h-4 w-4 text-slate-400" />
                                </button>
                            </div>

                            <div className="flex gap-2">
                                {needRefresh && (
                                    <button
                                        onClick={() => updateServiceWorker(true)}
                                        className="flex-1 bg-primary text-white py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                    >
                                        <RefreshCw className="h-3.5 w-3.5" />
                                        Refresh Now
                                    </button>
                                )}

                                {showInstallBtn && !needRefresh && (
                                    <button
                                        onClick={handleInstall}
                                        className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-black/10"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        Install Portal
                                    </button>
                                )}

                                <button
                                    onClick={close}
                                    className="px-6 py-3 border border-slate-200 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all"
                                >
                                    Later
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
