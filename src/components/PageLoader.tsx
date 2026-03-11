import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

/**
 * A clean, professional Page Loader for Suspense fallbacks.
 * Combines a subtle spinner with skeleton placeholders to prevent layout shift.
 */
export default function PageLoader() {
    return (
        <div className="min-h-[60vh] w-full flex flex-col items-center justify-center p-8 space-y-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center space-y-4 w-full max-w-4xl"
            >
                {/* Animated Spinner with Logo-like feel */}
                <div className="relative flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                    </div>
                </div>

                {/* Skeleton content to simulate page structure */}
                <div className="w-full space-y-4">
                    <Skeleton className="h-8 w-1/3 mx-auto" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                        <Skeleton className="h-48 rounded-2xl" />
                        <Skeleton className="h-48 rounded-2xl" />
                        <Skeleton className="h-48 rounded-2xl" />
                    </div>
                    <div className="space-y-2 pt-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </div>
                </div>

                <p className="text-sm font-medium text-slate-400 animate-pulse pt-4">
                    Loading resources...
                </p>
            </motion.div>
        </div>
    );
}
