import { Skeleton } from "../ui/skeleton";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

interface NewsCardSkeletonProps {
    repeat?: number;
    className?: string;
    gridClassName?: string;
}

/**
 * Specialized News Card Skeleton
 * 🏗️ Mimics actual card structure: 
 *   - Aspect[16/10] image
 *   - Category badge
 *   - Title (2 lines)
 *   - Metadata (Date | Author)
 *   - Bottom Link
 */
export function NewsCardSkeleton({
    repeat = 1,
    className,
    gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
}: NewsCardSkeletonProps) {
    return (
        <div className={cn(gridClassName, className)}>
            {Array.from({ length: repeat }).map((_, i) => (
                <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex flex-col h-full bg-card rounded-[2rem] border border-border/50 overflow-hidden shadow-sm"
                >
                    {/* Image Placeholder */}
                    <div className="aspect-[16/10] relative bg-slate-50 overflow-hidden">
                        <Skeleton className="w-full h-full rounded-none" />
                        <div className="absolute top-6 left-6">
                            <Skeleton className="h-6 w-20 rounded-md" />
                        </div>
                    </div>

                    {/* Content Placeholder */}
                    <div className="p-8 flex flex-col flex-grow space-y-6">
                        {/* Metadata (Author/Date) Row */}
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-4 w-24 rounded" />
                            <div className="w-[1px] h-3 bg-border" />
                            <Skeleton className="h-4 w-16 rounded" />
                        </div>

                        {/* Title - 2 Lines */}
                        <div className="space-y-3">
                            <Skeleton className="h-7 w-full rounded" />
                            <Skeleton className="h-7 w-3/4 rounded" />
                        </div>

                        {/* Description/Bottom Row */}
                        <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between">
                            <Skeleton className="h-4 w-32 rounded" />
                            <Skeleton className="h-5 w-5 rounded-full" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

/**
 * Specialized Hero Skeleton for Front Page
 */
export function HeroSkeleton() {
    return (
        <section className="relative w-full bg-slate-900 border border-slate-800 overflow-hidden min-h-[600px] flex items-center">
            <Skeleton className="absolute inset-0 z-0 h-full w-full rounded-none opacity-20" />
            <div className="container-custom relative z-10 py-20 space-y-8 max-w-3xl">
                <div className="flex gap-4">
                    <Skeleton className="h-6 w-24 bg-slate-800 rounded" />
                    <Skeleton className="h-6 w-32 bg-slate-800 rounded" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-16 w-full bg-slate-800 rounded-xl" />
                    <Skeleton className="h-16 w-3/4 bg-slate-800 rounded-xl" />
                </div>
                <Skeleton className="h-24 w-full bg-slate-800 rounded-xl opacity-60" />
                <div className="flex gap-6 items-center">
                    <Skeleton className="h-14 w-48 bg-slate-800 rounded-xl" />
                    <div className="flex items-center gap-4 pl-6 border-l border-slate-800/50">
                        <Skeleton className="h-12 w-12 rounded-full bg-slate-800" />
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-16 bg-slate-800" />
                            <Skeleton className="h-4 w-24 bg-slate-800" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
