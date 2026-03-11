import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";

interface InteractiveCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
}

/**
 * Premium card with micro-interactions:
 * 1. Subtle scale on hover/tap.
 * 2. Border glow/highlight effect.
 * 3. Consistent shadow transitions.
 */
export function InteractiveCard({ children, className, ...props }: InteractiveCardProps) {
    return (
        <motion.div
            whileHover={{
                y: -4,
                scale: 1.005,
                transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileTap={{
                scale: 0.99,
                transition: { duration: 0.1 }
            }}
            className={cn(
                "group relative overflow-hidden rounded-xl border bg-card p-6 text-card-foreground shadow-sm transition-all duration-300",
                "hover:shadow-md hover:border-primary/50",
                "dark:hover:bg-accent/40 dark:hover:border-primary/30",
                className
            )}
            {...props}
        >
            {/* Subtle background glow on hover */}
            <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}

/**
 * Smaller version for item listing or utility cards
 */
export function MiniInteractiveCard({ children, className, ...props }: InteractiveCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "rounded-lg border p-3 bg-background/50 backdrop-blur-sm transition-colors",
                "hover:bg-accent/50 hover:border-primary/20",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
