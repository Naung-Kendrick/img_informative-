import { useState, type HTMLAttributes } from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ImageWithSkeletonProps extends HTMLAttributes<HTMLImageElement> {
    src?: string;
    alt?: string;
    className?: string;
    imageClassName?: string;
    skeletonClassName?: string;
    containerClassName?: string;
}

/**
 * Advanced Image Loader Strategy
 * 🎯 Goal: Zero Layout Shift & Professional Loading UI.
 * 🏗️ Keeps the skeleton visible until the browser triggers the 'onLoad' event.
 */
export function ImageWithSkeleton({
    src,
    alt = "",
    className,
    imageClassName,
    skeletonClassName,
    containerClassName,
    ...props
}: ImageWithSkeletonProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={cn("relative overflow-hidden w-full h-full", containerClassName)}>
            {/* 1. Image Component */}
            {src && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setIsLoaded(true)}
                    className={cn(
                        "w-full h-full object-cover transition-opacity duration-700",
                        isLoaded ? "opacity-100" : "opacity-0",
                        imageClassName
                    )}
                    {...(props as any)}
                />
            )}

            {/* 2. Overlaid Skeleton - Fades out once image is ready */}
            <AnimatePresence>
                {!isLoaded && (
                    <motion.div
                        key="skeleton"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute inset-0 z-10"
                    >
                        <Skeleton className={cn("w-full h-full rounded-none", skeletonClassName)} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
