import { motion } from "framer-motion";

/**
 * A premium centered Page Loader that uses the project logo
 * and a themed spinning animation.
 */
export default function PageLoader() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md">
            <div className="relative flex flex-col items-center gap-10">
                {/* ── Spinning Animation Container ─────────────────────────────────── */}
                <div className="relative flex items-center justify-center">
                    {/* Outer Glow Effect */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-primary/10 blur-3xl"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* The Running Circle (Themed Ring) */}
                    <div className="relative">
                        <motion.div
                            className="w-32 h-32 rounded-full border-[3px] border-slate-100"
                        />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                            className="absolute inset-0 w-32 h-32 rounded-full border-t-[3px] border-r-[3px] border-primary shadow-[0_0_15px_rgba(30,58,138,0.3)]"
                        />
                    </div>

                    {/* Centered Photo (Phone/Image) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: [1, 1.05, 1], opacity: 1 }}
                            transition={{
                                scale: { repeat: Infinity, duration: 8, ease: "easeInOut" },
                                opacity: { duration: 1 }
                            }}
                            className="w-20 h-20 flex items-center justify-center"
                        >
                            <img
                                src="/image.png"
                                alt="Loading..."
                                className="w-full h-full object-contain filter drop-shadow-sm"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                        </motion.div>
                    </div>
                </div>

                {/* ── Loading Text with Theme Matching ──────────────────────────────── */}
                <div className="flex flex-col items-center space-y-3">
                    <motion.p 
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="text-xl font-bold tracking-[0.2em] text-primary padauk-bold"
                    >
                        Loading...
                    </motion.p>
                    <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-2.5 h-2.5 bg-primary/40 rounded-full"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    backgroundColor: ["#1e3a8a20", "#1e3a8a", "#1e3a8a20"]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 3,
                                    delay: i * 0.5,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
