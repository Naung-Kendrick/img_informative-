import { motion, AnimatePresence } from "framer-motion";
import { Button, type ButtonProps } from "../ui/button";
import { cn } from "../../lib/utils";
import { Loader2, Check } from "lucide-react";

interface LoadingButtonProps extends ButtonProps {
    isLoading?: boolean;
    isSuccess?: boolean;
    successText?: string;
}

/**
 * Reusable Loading Button Component (as requested by specific architecture)
 * Focus: Stripe/Vercel-like micro-animations, Accessibility, and clear state transitions.
 * 
 * Includes:
 * - aria-busy for screen readers
 * - disabled state during loading/success
 * - fluid transitions using AnimatePresence
 */
export function LoadingButton({
    children,
    className,
    isLoading,
    isSuccess,
    successText = "Success",
    disabled,
    "aria-label": ariaLabel,
    ...props
}: LoadingButtonProps) {
    return (
        <motion.div
            whileTap={disabled || isLoading || isSuccess ? {} : { scale: 0.98 }}
            whileHover={disabled || isLoading || isSuccess ? {} : { scale: 1.01 }}
            className="inline-flex w-fit h-fit"
        >
            <Button
                className={cn(
                    "relative min-h-[44px] min-w-[120px] px-8 transition-all duration-300 overflow-hidden",
                    isLoading && "text-transparent pointer-events-none select-none",
                    isSuccess && "bg-emerald-600 hover:bg-emerald-600 border-emerald-600 text-white pointer-events-none",
                    className
                )}
                disabled={disabled || isLoading || isSuccess}
                aria-busy={isLoading}
                aria-live="polite"
                aria-label={isLoading ? "Processing..." : isSuccess ? successText : ariaLabel}
                {...props}
            >
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <Loader2 className="h-5 w-5 animate-spin text-current" />
                        </motion.div>
                    ) : isSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 10, scale: 0.5 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                            className="flex items-center gap-2"
                        >
                            <Check className="h-4 w-4" strokeWidth={3} />
                            <span className="text-sm font-bold tracking-tight">
                                {successText}
                            </span>
                        </motion.div>
                    ) : (
                        <motion.span
                            key="default"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            {children}
                        </motion.span>
                    )}
                </AnimatePresence>
            </Button>
        </motion.div>
    );
}

// Keep the previous InteractiveButton export for backward compatibility if needed, 
// but LoadingButton is now the primary name for this architecture.
export { LoadingButton as InteractiveButton };
