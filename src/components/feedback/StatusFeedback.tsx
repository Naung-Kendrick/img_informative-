import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

type Status = "idle" | "loading" | "success" | "error";

interface StatusFeedbackProps {
    status: Status;
    message?: string;
    className?: string;
    successMessage?: string;
    errorMessage?: string;
}

/**
 * Animated status feedback for form submissions or critical actions.
 * Switches between loading, success, and error with professional timing.
 */
export function StatusFeedback({
    status,
    message,
    className,
    successMessage = "အောင်မြင်ပါသည်",
    errorMessage = "မှားယွင်းမှု တစ်ခုခု ဖြစ်ပွားနေပါသည်"
}: StatusFeedbackProps) {
    return (
        <div className={cn("flex flex-col items-center gap-3 p-4 text-center min-h-[120px]", className)}>
            <AnimatePresence mode="wait">
                {status === "loading" && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center gap-3"
                    >
                        <div className="relative h-14 w-14 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                            <motion.div
                                className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent shadow-sm"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            />
                            <Loader2 className="h-6 w-6 text-primary animate-pulse" />
                        </div>
                        {message && (
                            <motion.p
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm font-medium text-muted-foreground"
                            >
                                {message}
                            </motion.p>
                        )}
                    </motion.div>
                )}

                {status === "success" && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ type: "spring", bounce: 0.6 }}
                        className="flex flex-col items-center gap-3"
                    >
                        <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shadow-inner border border-emerald-500/30">
                            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                            {successMessage}
                        </p>
                    </motion.div>
                )}

                {status === "error" && (
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
                            {errorMessage}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
