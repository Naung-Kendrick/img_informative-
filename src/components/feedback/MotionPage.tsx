import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";

interface MotionPageProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
}

/**
 * Standardized page transition wrapper for a polished high-end SaaS feel.
 * Uses Framer Motion for subtle fade-in and slide-up effects.
 */
export function MotionPage({ children, className, ...props }: MotionPageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
                duration: 0.3,
                ease: [0.23, 1, 0.32, 1], // Custom cubic-bezier for "premium" feel
            }}
            className={cn("w-full h-full", className)}
            {...props}
        >
            {children}
        </motion.div>
    );
}

/**
 * For staggered list items.
 */
export function MotionStaggerItem({ children, className, index = 0, ...props }: MotionPageProps & { index?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.23, 1, 0.32, 1]
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}
