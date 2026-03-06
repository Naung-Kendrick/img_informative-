import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetAllNewsQuery } from "../store/newsApiSlice";
import { ArrowRight, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";

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
        <div className="bg-background animate-in fade-in duration-500 min-h-screen">
            <div className="container-custom py-12">

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

                        {/* Hero: Official Banner Section */}
                        {heroNews && (
                            <div className="mb-24">
                                <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-sm shadow-2xl flex flex-col lg:flex-row items-stretch min-h-[500px]">
                                    <div className="lg:w-1/2 relative min-h-[300px]">
                                        {heroNews.bannerImage ? (
                                            <img
                                                src={heroNews.bannerImage}
                                                alt={heroNews.title}
                                                className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-700 hover:opacity-100"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 w-full h-full bg-slate-800 flex items-center justify-center p-12">
                                                <div className="border border-slate-700 p-8 text-center text-slate-500 font-bold uppercase tracking-widest">Official Image Placeholder</div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent lg:hidden" />
                                    </div>

                                    <div className="lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-slate-900 overflow-hidden relative">
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-4 mb-6">
                                                <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-lg">
                                                    {heroNews.category}
                                                </span>
                                                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                                    <Calendar size={14} className="text-primary" />
                                                    {new Date(heroNews.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </div>
                                            </div>

                                            <h1 className="text-white mb-6 leading-[1.15] tracking-tight group-hover:text-primary transition-colors">
                                                {heroNews.title}
                                            </h1>

                                            <p className="text-slate-400 text-lg leading-relaxed mb-8 line-clamp-3">
                                                {/* Assuming summary exists or slicing content if available, here we mock a professional summary feel */}
                                                {t("hero.subtitle") || "Providing transparent, efficient, and secure immigration services for all residents and visitors. Stay updated with our official policy enhancements and legal frameworks."}
                                            </p>

                                            <div className="flex flex-wrap gap-4 items-center">
                                                <Button asChild className="bg-primary text-white hover:bg-primary/90 px-8 py-6 h-auto text-sm font-bold uppercase tracking-widest rounded-sm transition-all transform active:scale-95 shadow-xl">
                                                    <Link to={`/news/${heroNews._id}`}>Read Full News</Link>
                                                </Button>
                                                <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                                        <User size={16} className="text-primary" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Released By</span>
                                                        <span className="text-slate-300 text-xs font-bold">{heroNews.author?.name || "Dept. Media Office"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Subtle Departmental Watermark */}
                                        <div className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12 scale-150 pointer-events-none grayscale invert select-none">
                                            <img src="/logo1-removebg-preview.png" alt="watermark" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Section: Official Press & Feed */}
                        {allFeedNews.length > 0 && (
                            <div id="news-feed" className="pt-8 pt-16 border-t border-slate-200">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                                    <div>
                                        <div className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-2 leading-none">Press Center</div>
                                        <h2 className="mb-0 leading-none">Latest Official News</h2>
                                    </div>
                                    <div className="text-muted-foreground text-sm font-medium max-w-md">
                                        Access the most recent updates, policy changes, and official statements from the department.
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                                    {paginatedFeed.map((news) => (
                                        <Link key={news._id} to={`/news/${news._id}`} className="group flex flex-col h-full overflow-hidden transition-all duration-300">
                                            <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden mb-6 rounded-sm">
                                                {news.bannerImage ? (
                                                    <img
                                                        src={news.bannerImage}
                                                        alt={news.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-50 border border-slate-100 italic text-slate-300 text-sm font-bold uppercase tracking-widest">
                                                        Department Archive
                                                    </div>
                                                )}
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-widest shadow-sm rounded-sm">
                                                        {news.category}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col flex-grow group">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                                        <Calendar size={12} className="text-primary/70" />
                                                        {new Date(news.createdAt).toLocaleDateString('en-GB')}
                                                    </div>
                                                    <div className="h-3 w-[1px] bg-slate-200" />
                                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                                        <User size={12} className="text-primary/70" />
                                                        {news.author?.name || "Admin"}
                                                    </div>
                                                </div>

                                                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                    {news.title}
                                                </h3>

                                                <div className="mt-auto pt-6 flex items-center text-xs font-bold uppercase tracking-[0.15em] text-primary group-hover:gap-3 transition-all">
                                                    <span>{t("common.readMore")}</span>
                                                    <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
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
        </div>
    );
};

