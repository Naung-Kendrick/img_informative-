import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetAllNewsQuery } from "../store/newsApiSlice";
import { ArrowRight, Calendar, User, Zap } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";

const ITEMS_PER_PAGE = 6;

/**
 * Public Activities page — shows news posts with category="Activities"
 */
export default function Activities() {
    const { t } = useTranslation();
    const { data: allNews, isLoading, isError } = useGetAllNewsQuery();
    const [currentPage, setCurrentPage] = useState(1);

    const activities = allNews?.filter(
        (item) => item.category === "Activities" && item.status === "Published"
    ) || [];

    // Pagination Logic
    const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = activities.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="page-container bg-background animate-in fade-in duration-500">
            <div className="container-custom section-padding">
                {/* Page Header */}
                <div className="mb-16 text-center max-w-2xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/20">
                        <Zap size={14} />
                        Engagement & Operations
                    </div>
                    <h1 className="h1 mb-8 relative inline-block pb-4">
                        {t("activities.title")}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-primary/30 rounded-full"></div>
                    </h1>
                    <p className="p-lead mt-6">
                        {t("activities.subtitle")}
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
                                <Skeleton className="w-full aspect-[16/10]" />
                                <div className="p-8">
                                    <Skeleton className="h-6 w-3/4 mb-4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                        <div className="bg-destructive/10 text-destructive p-8 rounded-xl border border-destructive/20 max-w-lg">
                            <h2 className="h4 mb-3">Access Error</h2>
                            <p className="p-muted text-destructive/80">Unable to retrieve activity logs from the secure server. Please try again later.</p>
                        </div>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                        <div className="bg-muted/50 text-muted-foreground p-12 rounded-xl max-w-lg border border-border">
                            <Zap size={40} className="mx-auto mb-6 text-muted-foreground/40" />
                            <h2 className="h4 mb-3">{t("activities.noActivities")}</h2>
                            <p className="p-muted">{t("activities.noActivitiesDesc")}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            {paginatedItems.map((news) => (
                                <Link
                                    key={news._id}
                                    to={`/news/${news._id}`}
                                    className="group flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
                                >
                                    <div className="aspect-[16/10] bg-secondary/20 relative overflow-hidden shrink-0">
                                        {news.images && news.images.length > 0 ? (
                                            <img src={news.images[0]} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 font-bold uppercase tracking-widest text-[10px]">
                                                Archive Image
                                            </div>
                                        )}
                                        <div className="absolute top-6 left-6">
                                            <span className="px-3 py-1 bg-background/95 backdrop-blur-sm text-primary border border-primary/20 rounded-sm p-small shadow-sm">
                                                {t("activities.badge")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="flex items-center gap-2 p-small text-muted-foreground">
                                                <Calendar size={12} className="text-primary/70" />
                                                {new Date(news.createdAt).toLocaleDateString('en-GB')}
                                            </div>
                                            <div className="w-[1px] h-3 bg-border" />
                                            <div className="flex items-center gap-2 p-small text-muted-foreground">
                                                <User size={12} className="text-primary/70" />
                                                {news.author?.name || "Admin"}
                                            </div>
                                        </div>

                                        <h3 className="h4 mb-6 group-hover:text-primary transition-colors line-clamp-2">
                                            {news.title}
                                        </h3>

                                        <div className="mt-auto pt-6 border-t border-border flex items-center p-small text-primary group-hover:gap-3 transition-all">
                                            {t("common.readMore")} <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Professional Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-20 flex items-center justify-center gap-2">
                                {Array.from({ length: totalPages }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handlePageChange(idx + 1)}
                                        className={`w-12 h-12 rounded-lg p-small transition-all ${currentPage === idx + 1
                                            ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-110 z-10"
                                            : "bg-card border border-border text-muted-foreground hover:bg-muted/50 hover:text-primary"
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

