import { motion, AnimatePresence } from "framer-motion";
import { Button, type ButtonProps } from "../ui/button";
import { cn } from "../../lib/utils";
import { Loader2, Check } from "lucide-react";

interface InteractiveButtonProps extends ButtonProps {
    isLoading?: boolean;
    isSuccess?: boolean;
    successText?: string;
}

/**
 * Standard button with added micro-interactions:
 * 1. Scale down on tap.
 * 2. Subtle pulse when loading.
 * 3. Animated success state with checkmark.
 */
export function InteractiveButton({
    children,
    className,
    isLoading,
    isSuccess,
    successText = "အောင်မြင်ပါသည်",
    disabled,
    ...props
}: InteractiveButtonProps) {
    return (
        <motion.div
            whileTap={disabled || isLoading || isSuccess ? {} : { scale: 0.97 }}
            whileHover={disabled || isLoading || isSuccess ? {} : { scale: 1.01 }}
            className="inline-flex w-fit h-fit"
        >
            <Button
                className={cn(
                    "relative min-h-[40px] px-6 transition-all duration-300 overflow-hidden",
                    isLoading && "text-transparent pointer-events-none",
                    isSuccess && "bg-emerald-600 hover:bg-emerald-600 border-emerald-600 text-white pointer-events-none",
                    className
                )}
                disabled={disabled || isLoading || isSuccess}
                {...props}
            >
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </motion.div>
                    ) : isSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                            className="flex items-center gap-2"
                        >
                            <Check className="h-4 w-4" strokeWidth={3} />
                            <span className="text-sm font-bold">{successText}</span>
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

/**
 * For small utility buttons (icon buttons, toggles, etc.)
 */
export function MiniActionButton({ children, className, ...props }: InteractiveButtonProps) {
    return (
        <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            className={cn("inline-flex", className)}
        >
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 hover:bg-accent/80 transition-colors"
                {...props}
            >
                {children}
            </Button>
        </motion.div>
    );
}
