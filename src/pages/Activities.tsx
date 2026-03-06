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
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500 min-h-[70vh]">

            {/* Page Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 text-[#808080]">
                        <Zap size={22} />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 border-l-4 border-[#808080] pl-3 padauk-bold">
                        {t("activities.title")}
                    </h1>
                </div>
                <p className="text-slate-500 padauk-regular ml-14 sm:ml-16">
                    {t("activities.subtitle")}
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <Skeleton className="w-full aspect-[16/10]" />
                            <div className="p-6">
                                <Skeleton className="h-6 w-3/4 mb-3" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                    <div className="bg-red-50 text-red-500 p-6 rounded-2xl max-w-lg">
                        <h2 className="text-xl font-bold mb-2 padauk-bold">ကွန်ရက်ချို့ယွင်းချက်</h2>
                        <p className="padauk-regular text-sm">ဆာဗာနှင့် ချိတ်ဆက်ရာတွင် အဆင်မပြေမှု ဖြစ်ပေါ်နေပါသည်။</p>
                    </div>
                </div>
            ) : activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                    <div className="bg-slate-50 text-slate-500 p-8 rounded-2xl max-w-lg border border-slate-200">
                        <Zap size={40} className="mx-auto mb-4 text-slate-300" />
                        <h2 className="text-xl font-bold mb-2 padauk-bold text-slate-700">{t("activities.noActivities")}</h2>
                        <p className="padauk-regular text-sm">{t("activities.noActivitiesDesc")}</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {paginatedItems.map((news) => (
                            <Link
                                key={news._id}
                                to={`/news/${news._id}`}
                                className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden shrink-0">
                                    {news.bannerImage ? (
                                        <img src={news.bannerImage} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                            <Zap size={40} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-[#808080]/90 backdrop-blur-sm text-white rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                            {t("activities.badge")}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="text-[11px] text-slate-400 flex items-center gap-4 mb-3 font-bold uppercase tracking-wide">
                                        <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[#808080]" />{new Date(news.createdAt).toLocaleDateString('en-GB')}</span>
                                        <span className="flex items-center gap-1.5"><User size={12} className="text-[#808080]" />{news.author?.name || t("activities.admin")}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-3 padauk-bold group-hover:text-[#808080] transition-colors line-clamp-2 leading-snug">
                                        {news.title}
                                    </h3>
                                    <div className="mt-auto pt-4 flex items-center text-sm font-bold text-[#808080]">
                                        {t("common.readMore")} <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-16 flex items-center justify-center gap-2">
                            <button
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handlePageChange(idx + 1)}
                                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage === idx + 1
                                            ? "bg-[#808080] text-white shadow-md shadow-slate-200"
                                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

