import { cn } from "../../lib/utils"

/**
 * Premium Skeleton Loader
 * 🎨 Goal: Stripe-like subtle pulse with soft rounded corners.
 */
function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-slate-100 dark:bg-slate-800/50",
                className
            )}
            {...props}
        />
    )
}

export { Skeleton }
