import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetAllNewsQuery } from "../store/newsApiSlice";
import { ArrowRight, Calendar, User, Megaphone, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";

const ITEMS_PER_PAGE = 8;

/**
 * Public Announcements page — shows news posts with category="Announcements"
 */
export default function Announcements() {
    const { t } = useTranslation();
    const { data: allNews, isLoading, isError } = useGetAllNewsQuery();
    const [currentPage, setCurrentPage] = useState(1);

    const announcements = allNews?.filter(
        (item) => item.category === "Announcements" && item.status === "Published"
    ) || [];

    // Pagination Logic
    const totalPages = Math.ceil(announcements.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = announcements.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500 min-h-[70vh]">

            {/* Page Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-primary">
                        <Megaphone size={22} />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground border-l-4 border-primary pl-3 padauk-bold uppercase tracking-wide">
                        {t("announcements.title")}
                    </h1>
                </div>
                <p className="text-slate-500 padauk-regular ml-14 sm:ml-16">
                    {t("announcements.subtitle")}
                </p>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6">
                            <Skeleton className="h-5 w-24 mb-3" />
                            <Skeleton className="h-7 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
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
            ) : announcements.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                    <div className="bg-slate-50 text-slate-500 p-8 rounded-2xl max-w-lg border border-slate-200">
                        <Megaphone size={40} className="mx-auto mb-4 text-slate-300" />
                        <h2 className="text-xl font-bold mb-2 padauk-bold text-slate-700">{t("announcements.noAnnouncements")}</h2>
                        <p className="padauk-regular text-sm">{t("announcements.noAnnouncementsDesc")}</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {paginatedItems.map((news) => (
                            <Link
                                key={news._id}
                                to={`/news/${news._id}`}
                                className="group flex flex-col sm:flex-row gap-5 bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all duration-300 hover:border-primary/30"
                            >
                                {/* Image (optional) */}
                                {news.bannerImage ? (
                                    <div className="sm:w-56 sm:h-36 rounded-xl overflow-hidden shrink-0 bg-slate-100 shadow-sm">
                                        <img src={news.bannerImage} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                ) : (
                                    <div className="sm:w-56 sm:h-36 rounded-xl shrink-0 bg-gradient-to-br from-slate-50 to-slate-50 flex items-center justify-center text-slate-300 shadow-sm border border-slate-100">
                                        <Megaphone size={40} />
                                    </div>
                                )}

                                <div className="flex-1 flex flex-col justify-center min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-md text-[10px] font-bold uppercase tracking-wider">
                                            {t("announcements.badge")}
                                        </span>
                                        <span className="text-[11px] text-slate-500 flex items-center gap-1.5 font-bold uppercase tracking-wide">
                                            <Calendar size={12} className="text-primary" />
                                            {new Date(news.createdAt).toLocaleDateString('en-GB')}
                                        </span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-foreground padauk-bold group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
                                        {news.title}
                                    </h3>
                                    <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                                        <User size={12} className="text-slate-300" />
                                        <span>{t("announcements.submittedBy")}</span>
                                        <span className="text-slate-500 font-bold">{news.author?.name || t("announcements.admin")}</span>
                                    </div>
                                    <div className="mt-4 flex items-center text-sm font-bold text-primary group-hover:underline">
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
                                            ? "bg-primary text-white shadow-md shadow-slate-200"
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

