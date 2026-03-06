import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetAllNewsQuery } from "../store/newsApiSlice";
import { ArrowRight, Calendar, User, Zap, ChevronLeft, ChevronRight } from "lucide-react";
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
        <div className="bg-[#f8fafc] min-h-screen py-16 animate-in fade-in duration-500">
            <div className="container-custom">
                {/* Page Header: Official Identity */}
                <div className="mb-16 border-b border-slate-200 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-primary"></span>
                            Engagement & Operations
                        </div>
                        <h1 className="mb-0 leading-none">
                            {t("activities.title")}
                        </h1>
                    </div>
                    <div className="text-muted-foreground text-sm font-medium max-w-md md:text-right">
                        {t("activities.subtitle")}
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-sm border border-slate-200 overflow-hidden">
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
                        <div className="bg-red-50 text-red-500 p-8 rounded-sm border border-red-100 max-w-lg">
                            <h2 className="text-xl font-bold mb-3 uppercase tracking-tight">Access Error</h2>
                            <p className="text-sm opacity-80">Unable to retrieve activity logs from the secure server. Please try again later.</p>
                        </div>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                        <div className="bg-white text-slate-400 p-12 rounded-sm max-w-lg border border-slate-200 shadow-sm">
                            <Zap size={40} className="mx-auto mb-6 text-slate-200" />
                            <h2 className="text-xl font-bold mb-3 text-slate-800 uppercase tracking-tight">{t("activities.noActivities")}</h2>
                            <p className="text-sm leading-relaxed">{t("activities.noActivitiesDesc")}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            {paginatedItems.map((news) => (
                                <Link
                                    key={news._id}
                                    to={`/news/${news._id}`}
                                    className="group flex flex-col h-full bg-white rounded-sm border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500"
                                >
                                    <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden shrink-0">
                                        {news.bannerImage ? (
                                            <img src={news.bannerImage} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50 italic text-xs font-bold uppercase tracking-widest">
                                                Archive Image
                                            </div>
                                        )}
                                        <div className="absolute top-6 left-6">
                                            <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-primary border border-primary/20 rounded-sm text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                                {t("activities.badge")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                <Calendar size={12} className="text-primary/70" />
                                                {new Date(news.createdAt).toLocaleDateString('en-GB')}
                                            </div>
                                            <div className="w-[1px] h-3 bg-slate-200" />
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                <User size={12} className="text-primary/70" />
                                                {news.author?.name || "Admin"}
                                            </div>
                                        </div>

                                        <h3 className="mb-6 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                            {news.title}
                                        </h3>

                                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center text-[11px] font-bold text-primary uppercase tracking-[0.2em] group-hover:gap-3 transition-all">
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
                                        className={`w-12 h-12 rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${currentPage === idx + 1
                                            ? "bg-primary text-white shadow-xl shadow-primary/20 scale-110 z-10"
                                            : "bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-primary"
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

