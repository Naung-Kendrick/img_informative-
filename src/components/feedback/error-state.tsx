import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

interface ErrorStateProps {
    message?: string;
    className?: string;
}

/**
 * Animated error state for modern feedback.
 */
export function ErrorState({
    message = "တစ်ခုခု မှားယွင်းသွားပါသည်။ ပြန်လည် ကြိုးစားကြည့်ပါ။",
    className
}: ErrorStateProps) {
    return (
        <div className={cn("flex flex-col items-center gap-3 p-4 text-center", className)}>
            <AnimatePresence mode="wait">
                <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.5, x: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="flex flex-col items-center gap-3"
                >
                    <div className="h-14 w-14 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center shadow-inner border border-rose-500/30">
                        <AlertCircle className="h-8 w-8 text-rose-600 dark:text-rose-400" />
                    </div>
                    <p className="text-sm font-bold text-rose-700 dark:text-rose-400">
                        {message}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
