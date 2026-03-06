import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetAllNewsQuery } from "../store/newsApiSlice";
import { ArrowRight, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";

const ITEMS_PER_PAGE = 6;

export default function Home() {
    const { t } = useTranslation();
    const { data: news, isLoading, isError } = useGetAllNewsQuery();
    const [currentPage, setCurrentPage] = useState(1);

    // 1. Filter out only Published articles
    const publishedNews = news?.filter((item) => item.status === "Published") || [];

    // 2. Separate Hero vs feed
    const heroNews = publishedNews.slice(0, 1)[0]; // Latest 1 item is Hero
    const allFeedNews = publishedNews.slice(1); // All remaining news

    // 3. Pagination Logic
    const totalPages = Math.ceil(allFeedNews.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedFeed = allFeedNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const scrollToContent = () => {
        window.scrollTo({ top: 500, behavior: 'smooth' });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setTimeout(scrollToContent, 10);
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500 min-h-[70vh]">

            {isLoading ? (
                <div className="space-y-12">
                    {/* Hero Skeleton */}
                    <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200">
                        <Skeleton className="w-full aspect-[21/9]" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <Skeleton className="h-6 w-24 mb-4" />
                            <Skeleton className="h-10 w-3/4 mb-4" />
                            <Skeleton className="h-6 w-48" />
                        </div>
                    </div>
                    {/* Grid Skeleton */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <Skeleton className="h-8 w-48" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                    <Skeleton className="w-full aspect-[16/10]" />
                                    <div className="p-6 flex flex-col flex-grow">
                                        <Skeleton className="h-4 w-1/2 mb-4" />
                                        <Skeleton className="h-6 w-full mb-2" />
                                        <Skeleton className="h-4 w-full mb-4" />
                                        <div className="mt-auto pt-4 flex items-center">
                                            <Skeleton className="h-5 w-32" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-lg mx-auto">
                    <div className="bg-red-50 text-red-500 p-6 rounded-2xl w-full">
                        <h2 className="text-xl font-bold mb-2 padauk-bold">ကွန်ရက်ချို့ယွင်းချက်</h2>
                        <p className="padauk-regular text-sm">ဆာဗာနှင့် ချိတ်ဆက်ရာတွင် အဆင်မပြေမှု ဖြစ်ပေါ်နေပါသည်။ ခေတ္တစောင့်ဆိုင်းပြီး ပြန်လည်ကြိုးစားကြည့်ပါ။</p>
                    </div>
                </div>
            ) : publishedNews.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-lg mx-auto">
                    <div className="bg-slate-50 text-slate-500 p-8 rounded-2xl w-full border border-slate-200">
                        <h2 className="text-xl font-bold mb-2 padauk-bold text-slate-700">သတင်းအချက်အလက်များ မရှိသေးပါ</h2>
                        <p className="padauk-regular text-sm">လတ်တလော လွှင့်တင်ထားသော သတင်းများ မရှိသေးပါ။ နောက်မှ ပြန်လည်ဝင်ရောက်ကြည့်ရှုပါ။</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-12">

                    {/* Hero Section */}
                    {heroNews && (
                        <Link to={`/news/${heroNews._id}`} className="block group">
                            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 group-hover:shadow-2xl transition-all duration-500">
                                <div className="aspect-[21/9] w-full relative">
                                    {heroNews.bannerImage ? (
                                        <img
                                            src={heroNews.bannerImage}
                                            alt={heroNews.title}
                                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-slate-800 to-slate-700 opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-14">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3.5 py-1.5 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md">
                                            {heroNews.category}
                                        </span>
                                        <span className="text-slate-200 text-sm flex items-center gap-1.5 font-medium">
                                            <Calendar size={14} />
                                            {new Date(heroNews.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>

                                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight padauk-bold group-hover:text-blue-50 transition-colors drop-shadow-md">
                                        {heroNews.title}
                                    </h1>

                                    <div className="flex items-center gap-2 text-slate-300">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center shrink-0">
                                            <User size={14} className="text-slate-400" />
                                        </div>
                                        <span className="text-sm font-medium">{heroNews.author?.name || "System Admin"}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Regular Feed Grid */}
                    {allFeedNews.length > 0 && (
                        <div id="news-feed">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-foreground border-l-4 border-primary pl-3 padauk-bold uppercase tracking-wide">
                                    {t("hero.latestNews")}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {paginatedFeed.map((news) => (
                                    <Link key={news._id} to={`/news/${news._id}`} className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                        <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden shrink-0">
                                            {news.bannerImage ? (
                                                <img
                                                    src={news.bannerImage}
                                                    alt={news.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                                    <span className="padauk-bold text-lg">ပုံမရှိပါ</span>
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-sm text-white rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                                    {news.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-grow">
                                            <div className="text-[11px] text-slate-500 flex items-center gap-4 mb-3 font-bold uppercase tracking-wide">
                                                <span className="flex items-center gap-1.5"><Calendar size={12} className="text-primary" />{new Date(news.createdAt).toLocaleDateString('en-GB')}</span>
                                                <span className="flex items-center gap-1.5"><User size={12} className="text-primary" />{news.author?.name || "Admin"}</span>
                                            </div>

                                            <h3 className="text-lg font-bold text-foreground mb-3 padauk-bold group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                                {news.title}
                                            </h3>

                                            <div className="mt-auto pt-4 flex items-center text-sm font-bold text-primary">
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
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}

