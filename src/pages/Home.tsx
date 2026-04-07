import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetAllNewsQuery } from "../store/newsApiSlice";
import { useGetAllAnnouncementsQuery } from "../store/announcementApiSlice";
import { useGetAllDistrictsQuery } from "../store/districtApiSlice";
import { useGetPagesBySectionQuery } from "../store/pageApiSlice";
import { useGetLayoutQuery } from "../store/layoutApiSlice";
import {
    ArrowRight,
    Calendar,
    User,
    FileText,
    IdCard,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { getEffectiveDate } from "../lib/dateUtils";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import { NewsCardSkeleton, HeroSkeleton } from "../components/feedback/NewsCardSkeleton";
import { ImageWithSkeleton } from "../components/feedback/ImageWithSkeleton";
import StatisticsSection from "../components/StatisticsSection";
import WeatherWidget from "../components/WeatherWidget";
import NetworkErrorState from "../components/ui/NetworkErrorState";

const Home = () => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const newsPerPage = 6;

    const { data: layout = [], isLoading: isLayoutLoading } = useGetLayoutQuery();

    // 🎯 Use isLoading (Initial Load) and isFetching (Background Refresh)
    // for comprehensive state management.
    const {
        data: allNews = [],
        isLoading,
        isFetching,
        isError
    } = useGetAllNewsQuery();
    const { data: announcements = [], isLoading: isAnnouncementsLoading } = useGetAllAnnouncementsQuery();
    const { data: districts = [], isLoading: isDistrictsLoading } = useGetAllDistrictsQuery();
    const { data: services = [], isLoading: isServicesLoading } = useGetPagesBySectionQuery("services");

    // Filter for Published services
    const publishedServices = useMemo(() =>
        services.filter(s => s.status === "Published").slice(0, 2),
        [services]);

    // Filter for Published news
    const publishedNews = useMemo(() =>
        allNews.filter(n => n.status === "Published"),
        [allNews]);

    // Latest news for Hero and Feed
    const sortedNews = useMemo(() =>
        [...publishedNews].sort(
            (a, b) => new Date(getEffectiveDate(b)).getTime() - new Date(getEffectiveDate(a)).getTime()
        ),
        [publishedNews]);

    const heroNews = sortedNews[0];
    const allFeedNews = sortedNews.slice(1);

    // Latest 5 Announcements
    const latestAnnouncements = useMemo(() =>
        [...announcements]
            .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
            .slice(0, 5),
        [announcements]);

    // Districts (Top 3 for home)
    const displayDistricts = useMemo(() =>
        districts.slice(0, 3),
        [districts]);

    // Pagination for News Feed
    const totalPages = Math.ceil(allFeedNews.length / newsPerPage);
    const paginatedFeed = useMemo(() =>
        allFeedNews.slice(
            (currentPage - 1) * newsPerPage,
            currentPage * newsPerPage
        ),
        [allFeedNews, currentPage, newsPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        document.getElementById("news-feed")?.scrollIntoView({ behavior: "smooth" });
    };

    const renderHero = () => {
        if (isLoading || isFetching) return <HeroSkeleton />;
        if (!heroNews) return null;

        return (
            <section key="hero" className="relative w-full bg-slate-900 overflow-hidden min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center">
                <div className="absolute inset-0 z-0">
                    {heroNews.images && heroNews.images.length > 0 ? (
                        <>
                            <ImageWithSkeleton
                                src={heroNews.images[0]}
                                alt=""
                                className="w-full h-full object-cover opacity-40 scale-105"
                                containerClassName="absolute inset-0"
                                skeletonClassName="bg-slate-800"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-20" />
                        </>
                    ) : (
                        <div className="w-full h-full bg-slate-800" />
                    )}
                </div>

                <div className="absolute top-8 right-8 z-30 animate-in fade-in slide-in-from-top-4 duration-1000 delay-500 hidden md:block">
                    <WeatherWidget variant="compact" />
                </div>

                <div className="container-custom relative z-10 py-12 sm:py-16 md:py-20">
                    <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6 animate-in slide-in-from-left duration-700">
                            <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold tracking-widest uppercase rounded">
                                {heroNews.category}
                            </span>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={14} className="text-primary" />
                                {new Date(getEffectiveDate(heroNews)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.4] sm:leading-[1.5] md:leading-[1.6] mb-4 sm:mb-6 md:mb-8 animate-in slide-in-from-left duration-1000 delay-100 padauk-bold">
                            {heroNews.title}
                        </h1>

                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 mb-6 sm:mb-8 md:mb-10 leading-[1.6] sm:leading-[1.8] line-clamp-2 sm:line-clamp-3 max-w-2xl animate-in slide-in-from-left duration-1000 delay-200 padauk-regular">
                            {t("hero.subtitle") || "Providing transparent, efficient, and secure immigration services for all residents and visitors. Stay updated with our official policy enhancements and legal frameworks."}
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-5 items-start sm:items-center animate-in slide-in-from-bottom duration-1000 delay-300">
                            <Button asChild className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-10 py-5 sm:py-7 h-auto text-xs sm:text-sm font-bold tracking-widest rounded-xl shadow-xl shadow-primary/20 transition-all transform active:scale-95 w-full sm:w-auto">
                                <Link to={`/news/${heroNews._id}`}>{t("hero.readFull")}</Link>
                            </Button>
                            <div className="hidden sm:flex items-center gap-4 pl-6 border-l border-white/10">
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                    <User size={18} className="text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Released By</span>
                                    <span className="text-white text-sm font-bold">{heroNews.author?.name || t("hero.officialMedia")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    const renderStats = () => <div key="stats"><StatisticsSection /></div>;

    const renderServices = () => (
        <section key="services" className="bg-secondary/10 section-padding border-b border-border/50">
            <div className="container-custom">
                <div className="text-center mb-10 sm:mb-14 md:mb-20 flex flex-col items-center">
                    <div className="inline-flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em] mb-4">
                        Public Assistance Center
                    </div>
                    <h2 className="h2 mb-8 relative inline-block pb-4">
                        {t("services.publicServices")}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-primary/30 rounded-full"></div>
                    </h2>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 max-w-6xl mx-auto">
                    {isServicesLoading ? (
                        [1, 2].map(i => <Skeleton key={i} className="h-96 rounded-[2rem]" />)
                    ) : publishedServices.length > 0 ? (
                        publishedServices.map((service, index) => (
                            <div
                                key={service._id}
                                className="bg-card rounded-[2rem] border border-border hover:border-primary/30 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group transform hover:-translate-y-2 relative overflow-hidden"
                            >
                                <div className="aspect-[16/9] bg-secondary/20 relative overflow-hidden border-b border-border">
                                    {service.bannerImage ? (
                                        <img loading="lazy"
                                            src={service.bannerImage}
                                            alt={service.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-primary/20">
                                            {index % 2 === 0 ? <IdCard size={100} strokeWidth={0.5} /> : <FileText size={100} strokeWidth={0.5} />}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                                    <div className="absolute bottom-6 left-8">
                                        <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] text-white font-bold uppercase tracking-widest leading-none">
                                            Services #{service.order || 1}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 sm:p-8 md:p-10 flex flex-col flex-grow">
                                    <h2 className="h3 mb-4 padauk-bold text-foreground group-hover:text-primary transition-colors">
                                        {service.title}
                                    </h2>
                                    <div className="text-muted-foreground mb-8 line-clamp-3 padauk-regular text-[15px] leading-relaxed opacity-80"
                                        dangerouslySetInnerHTML={{ __html: (service.content || "").replace(/<[^>]*>?/gm, '').substring(0, 160) + '...' }}
                                    />
                                    <div className="mt-auto w-full">
                                        <Link to={`/services/${service._id}`} className="w-full block">
                                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/80 font-bold py-5 sm:py-7 text-sm sm:text-base lg:text-lg rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98]">
                                                {t("services.applyBtn")}
                                                <ArrowRight size={20} className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 bg-muted/30 rounded-3xl border border-dashed border-border text-center">
                            <p className="text-muted-foreground padauk-bold">{t("services.noServices")}</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );

    const renderDistricts = () => (
        <section key="districts" className="bg-background section-padding">
            <div className="container-custom">
                <div className="text-center mb-10 sm:mb-12 md:mb-16 flex flex-col items-center">
                    <div className="inline-flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em] mb-4">
                        REGIONAL IMMIGRATION OFFICES
                    </div>
                    <h2 className="h2 mb-8 relative inline-block pb-4">
                        {t("districts.title")}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-primary/30 rounded-full"></div>
                    </h2>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
                    {isDistrictsLoading ? (
                        [1, 2, 3].map(i => <Skeleton key={i} className="aspect-[16/10] rounded-3xl" />)
                    ) : (
                        displayDistricts.map((district) => (
                            <Link key={district._id} to="/districts" className="group flex flex-col overflow-hidden bg-card border border-border rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500">
                                <div className="aspect-[16/10] bg-secondary/20 relative overflow-hidden">
                                    <img loading="lazy"
                                        src={district.coverImage}
                                        alt=""
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <h3 className="text-xl font-bold text-white mb-2">{district.name}</h3>
                                        <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                                            {t("districts.viewDetails")} <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                <div className="mt-10 sm:mt-12 md:mt-16 text-center">
                    <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-8 sm:px-12 py-5 sm:py-7 h-auto text-sm sm:text-base shadow-xl shadow-primary/10 transition-all w-full sm:w-auto">
                        <Link to="/districts">{t("common.viewAllDistricts")}</Link>
                    </Button>
                </div>
            </div>
        </section>
    );

    const renderNews = () => {
        if (allFeedNews.length === 0) return null;
        return (
            <section key="news" id="news-feed" className="bg-secondary/10 section-padding border-t border-border/50">
                <div className="container-custom">
                    <div className="text-center mb-16 flex flex-col items-center">
                        <div className="inline-flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em] mb-4">
                            PRESS CENTER
                        </div>
                        <h2 className="h2 mb-8 relative inline-block pb-4">
                            {t("news.latestOfficialNews")}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-primary/30 rounded-full"></div>
                        </h2>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
                        {isLoading || isFetching ? (
                            <NewsCardSkeleton repeat={newsPerPage} />
                        ) : paginatedFeed.map((news) => (
                            <Link key={news._id} to={`/news/${news._id}`} className="group flex flex-col h-full bg-card rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                                <div className="aspect-[16/10] relative overflow-hidden bg-slate-50">
                                    {news.images && news.images.length > 0 ? (
                                        <ImageWithSkeleton
                                            src={news.images[0]}
                                            alt=""
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground text-xs">Archive Image</div>
                                    )}
                                    <div className="absolute top-6 left-6 z-10">
                                        <span className="px-3 py-1 bg-background/95 backdrop-blur-sm text-primary font-bold text-[10px] uppercase tracking-widest rounded shadow-sm border border-border/50">
                                            {news.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5 sm:p-6 md:p-8 flex flex-col flex-grow">
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-muted-foreground font-bold text-[10px] uppercase tracking-widest mb-4 sm:mb-6">
                                        <div className="flex items-center gap-1.5"><Calendar size={12} className="text-primary" /> {new Date(getEffectiveDate(news)).toLocaleDateString('en-GB')}</div>
                                        <div className="w-[1px] h-3 bg-border" />
                                        <div className="flex items-center gap-1.5"><User size={12} className="text-primary" /> {news.author?.name || "Admin"}</div>
                                    </div>
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-[1.4] sm:leading-[1.6] mb-4 sm:mb-6 md:mb-8 padauk-bold">
                                        {news.title}
                                    </h3>
                                    <div className="mt-auto pt-4 sm:pt-6 border-t border-border/50 flex items-center justify-between group-hover:text-primary transition-all font-bold text-xs uppercase tracking-widest text-muted-foreground">
                                        {t("common.readMore")} <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-12 sm:mt-16 md:mt-20 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                            <button
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-30 transition-all bg-card"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            {Array.from({ length: totalPages }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handlePageChange(idx + 1)}
                                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl font-bold text-sm sm:text-base transition-all ${currentPage === idx + 1
                                        ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-110"
                                        : "bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary"
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-30 transition-all bg-card"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </section>
        );
    };

    const renderAnnouncements = () => (
        <section key="announcements" className="bg-background section-padding border-b border-border/50">
            <div className="container-custom">
                <div className="text-center mb-16 flex flex-col items-center">
                    <div className="inline-flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em] mb-4">
                        OFFICIAL ANNOUNCEMENTS
                    </div>
                    <h2 className="h2 mb-8 relative inline-block pb-4">
                        {t("announcements.title")}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-primary/30 rounded-full"></div>
                    </h2>

                </div>

                {isAnnouncementsLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="aspect-[1/1.414] rounded-2xl" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
                        {latestAnnouncements.map((announcement) => (
                            <Link
                                key={announcement._id}
                                to={`/announcements/${announcement._id}`}
                                className="group flex flex-col transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div className="w-full aspect-[1/1.414] bg-secondary/10 relative overflow-hidden border border-border/50 rounded-2xl shadow-sm group-hover:shadow-xl group-hover:border-primary/50 transition-all">
                                    {announcement.documentImages && announcement.documentImages.length > 0 ? (
                                        <img loading="lazy"
                                            src={announcement.documentImages[0]}
                                            alt=""
                                            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center"><FileText size={48} className="text-muted" /></div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="mt-5 px-1">
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-2">
                                        <Calendar size={12} className="text-primary" />
                                        {new Date(announcement.publishedDate).toLocaleDateString('en-GB')}
                                    </div>
                                    <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-relaxed group-hover:text-primary transition-colors padauk-bold">
                                        {announcement.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-10 sm:mt-12 md:mt-16 text-center">
                    <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-8 sm:px-12 py-5 sm:py-7 h-auto text-sm sm:text-base shadow-xl shadow-primary/10 transition-all w-full sm:w-auto">
                        <Link to="/announcements" className="flex items-center justify-center gap-2">{t("common.viewAllAnnouncements")} <ArrowRight size={18} /></Link>
                    </Button>
                </div>
            </div>
        </section>
    );

    const mappedSections = () => {
        if (isLayoutLoading) {
            return (
                <div className="h-screen flex items-center justify-center">
                    <HeroSkeleton />
                </div>
            );
        }

        return layout.filter(s => s.isVisible).map(s => {
            switch (s.sectionId) {
                case 'hero': return <div key="hero-container">{renderHero()}</div>;
                case 'stats': return <div key="stats-container">{renderStats()}</div>;
                case 'services': return <div key="services-container">{renderServices()}</div>;
                case 'districts': return <div key="districts-container">{renderDistricts()}</div>;
                case 'news': return <div key="news-container">{renderNews()}</div>;
                case 'announcements': return <div key="announcements-container">{renderAnnouncements()}</div>;
                default: return null;
            }
        });
    }

    return (
        <div className="page-container bg-background animate-in fade-in duration-500">
            {mappedSections()}

            {isError && (
                <div className="container-custom py-10">
                    <NetworkErrorState />
                </div>
            )}
        </div>
    );
};

export default Home;
