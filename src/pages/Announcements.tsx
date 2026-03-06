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
        <div className="bg-background min-h-screen py-16 animate-in fade-in duration-500">
            <div className="container-custom">
                {/* Page Header: Official Identity */}
                <div className="mb-16 border-b border-slate-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-primary"></span>
                            Official Repository
                        </div>
                        <h1 className="mb-0 leading-none">
                            {t("announcements.title")}
                        </h1>
                    </div>
                </div>
                <p className="text-slate-500 padauk-regular ml-14 sm:ml-16">
                    {t("announcements.subtitle")}
                </p>
            </div>

            <div className="container-custom">
                {isError ? (
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
                ) : isLoading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-40 bg-white rounded-sm border border-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {paginatedItems.map((news) => (
                            <Link
                                key={news._id}
                                to={`/news/${news._id}`}
                                className="group flex flex-col sm:flex-row gap-8 bg-white rounded-sm border border-border p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="flex-1 flex flex-col justify-center min-w-0">
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="px-3 py-1 bg-primary/5 text-primary border border-primary/20 rounded-sm text-[10px] font-bold uppercase tracking-widest">
                                            {t("announcements.badge")}
                                        </span>
                                        <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                                            <Calendar size={12} className="text-primary/70" />
                                            {new Date(news.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>

                                    <h3 className="mb-4 group-hover:text-primary transition-colors line-clamp-2">
                                        {news.title}
                                    </h3>

                                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Issued By</span>
                                        <span className="text-slate-600">{news.author?.name || t("announcements.admin")}</span>
                                    </div>

                                    <div className="mt-8 flex items-center text-xs font-bold uppercase tracking-[0.15em] text-primary group-hover:gap-4 transition-all">
                                        {t("common.readMore")} <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                                {/* Decorative Emblem Backdrop */}
                                <div className="absolute right-0 top-0 bottom-0 w-24 bg-slate-50 flex items-center justify-center opacity-[0.03] grayscale pointer-events-none select-none">
                                    <img src="/logo1-removebg-preview.png" alt="" className="scale-150" />
                                </div>
                            </Link>
                        ))}

                        {totalPages > 1 && (
                            <div className="mt-16 flex items-center justify-center gap-2">
                                {Array.from({ length: totalPages }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handlePageChange(idx + 1)}
                                        className={`w-10 h-10 rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${currentPage === idx + 1
                                            ? "bg-primary text-white shadow-xl shadow-primary/20 scale-110 z-10"
                                            : "bg-white border border-border text-slate-500 hover:bg-slate-50"
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

