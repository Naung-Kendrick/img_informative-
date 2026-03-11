import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface SuccessStateProps {
    message?: string;
    className?: string;
}

/**
 * Animated success state for modern feedback.
 */
export function SuccessState({
    message = "အောင်မြင်ပါသည်",
    className
}: SuccessStateProps) {
    return (
        <div className={cn("flex flex-col items-center gap-3 p-4 text-center", className)}>
            <AnimatePresence mode="wait">
                <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="flex flex-col items-center gap-3"
                >
                    <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shadow-inner border border-emerald-500/30">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                        {message}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
