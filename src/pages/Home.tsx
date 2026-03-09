import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetAllNewsQuery } from "../store/newsApiSlice";
import { useGetAllAnnouncementsQuery } from "../store/announcementApiSlice";
import { useGetAllDistrictsQuery } from "../store/districtApiSlice";
import { useGetPagesBySectionQuery } from "../store/pageApiSlice";
import {
    ArrowRight,
    Calendar,
    User,
    FileText,
    IdCard,
    Users,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import StatisticsSection from "../components/StatisticsSection";
import WeatherWidget from "../components/WeatherWidget";

const Home = () => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const newsPerPage = 6;

    // API Hooks
    const { data: allNews = [], isLoading, isError } = useGetAllNewsQuery();
    const { data: announcements = [], isLoading: isAnnouncementsLoading } = useGetAllAnnouncementsQuery();
    const { data: districts = [], isLoading: isDistrictsLoading } = useGetAllDistrictsQuery();
    const { data: services = [], isLoading: isServicesLoading } = useGetPagesBySectionQuery("services");

    // Filter for Published services
    const publishedServices = services.filter(s => s.status === "Published").slice(0, 2);

    // Filter for Published news
    const publishedNews = allNews.filter(n => n.status === "Published");

    // Latest news for Hero and Feed
    const sortedNews = [...publishedNews].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const heroNews = sortedNews[0];
    const allFeedNews = sortedNews.slice(1);

    // Latest 5 Announcements
    const latestAnnouncements = [...announcements]
        .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
        .slice(0, 5);

    // Districts (Top 3 for home)
    const displayDistricts = districts.slice(0, 3);

    // Pagination for News Feed
    const totalPages = Math.ceil(allFeedNews.length / newsPerPage);
    const paginatedFeed = allFeedNews.slice(
        (currentPage - 1) * newsPerPage,
        currentPage * newsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        document.getElementById("news-feed")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="page-container bg-background animate-in fade-in duration-500">
            {/* Hero: Official Department Banner */}
            {isLoading ? (
                <div className="container-custom section-padding">
                    <Skeleton className="w-full h-[600px] rounded-3xl" />
                </div>
            ) : heroNews && (
                <section className="relative w-full bg-slate-900 overflow-hidden min-h-[600px] flex items-center">
                    {/* Background Visuals */}
                    <div className="absolute inset-0 z-0">
                        {heroNews.images && heroNews.images.length > 0 ? (
                            <>
                                <img
                                    src={heroNews.images[0]}
                                    alt=""
                                    className="w-full h-full object-cover opacity-40 scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
                            </>
                        ) : (
                            <div className="w-full h-full bg-slate-800" />
                        )}
                    </div>

                    {/* Compact Weather Widget in Corner — Namhsan Township */}
                    <div className="absolute top-8 right-8 z-30 animate-in fade-in slide-in-from-top-4 duration-1000 delay-500 hidden md:block">
                        <WeatherWidget variant="compact" />
                    </div>

                    <div className="container-custom relative z-10 py-20">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-3 mb-6 animate-in slide-in-from-left duration-700">
                                <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold tracking-widest uppercase rounded">
                                    {heroNews.category}
                                </span>
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Calendar size={14} className="text-primary" />
                                    {new Date(heroNews.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.6] mb-8 animate-in slide-in-from-left duration-1000 delay-100 padauk-bold">
                                {heroNews.title}
                            </h1>

                            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-[1.8] line-clamp-3 max-w-2xl animate-in slide-in-from-left duration-1000 delay-200 padauk-regular">
                                {t("hero.subtitle") || "Providing transparent, efficient, and secure immigration services for all residents and visitors. Stay updated with our official policy enhancements and legal frameworks."}
                            </p>

                            <div className="flex flex-wrap gap-5 items-center animate-in slide-in-from-bottom duration-1000 delay-300">
                                <Button asChild className="bg-primary hover:bg-primary/90 text-white px-10 py-7 h-auto text-sm font-bold tracking-widest rounded-xl shadow-2xl shadow-primary/20 transition-all transform active:scale-95">
                                    <Link to={`/news/${heroNews._id}`}>READ FULL STATEMENT</Link>
                                </Button>
                                <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                        <User size={18} className="text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Released By</span>
                                        <span className="text-white text-sm font-bold">{heroNews.author?.name || "Official Media Office"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Statistics Animation Section */}
            <StatisticsSection />

            {/* Featured Services (Gray Alternate) */}
            <section className="bg-secondary/10 section-padding border-b border-border/50">
                <div className="container-custom">
                    <div className="text-center mb-20 flex flex-col items-center">
                        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/20">
                            Public Assistance Center
                        </div>
                        <h2 className="h2 mb-8 relative inline-block pb-4">
                            ပြည်သူ့ဝန်ဆောင်မှုများ
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-primary/30 rounded-full"></div>
                        </h2>
                        <p className="p-lead text-muted-foreground max-w-2xl mx-auto mt-6">
                            အောက်ပါဝန်ဆောင်မှုများကို အွန်လိုင်းမှတစ်ဆင့် လွယ်ကူလျင်မြန်စွာ လျှောက်ထားရယူနိုင်ပါသည်။
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-10">
                        {isServicesLoading ? (
                            [1, 2].map(i => <Skeleton key={i} className="h-96 rounded-[2rem]" />)
                        ) : publishedServices.length > 0 ? (
                            publishedServices.map((service, idx) => (
                                <div key={service._id} className="bg-card rounded-[2rem] p-10 shadow-sm border border-border flex flex-col items-center text-center hover:shadow-2xl hover:border-primary/20 transition-all group">
                                    <div className={`w-24 h-24 bg-primary/5 text-primary rounded-3xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500 ${idx % 2 === 0 ? 'rotate-3' : '-rotate-3'} group-hover:rotate-0 overflow-hidden`}>
                                        {service.bannerImage ? (
                                            <img src={service.bannerImage} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            idx % 2 === 0 ? <IdCard size={44} /> : <Users size={44} />
                                        )}
                                    </div>
                                    <h3 className="h3 mb-6 padauk-bold">{service.title}</h3>
                                    <p className="text-muted-foreground mb-10 flex-grow leading-relaxed line-clamp-3 padauk-regular"
                                        dangerouslySetInnerHTML={{ __html: service.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' }}
                                    />
                                    <Button className="w-full py-7 rounded-2xl bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground font-bold transition-all shadow-xl" asChild>
                                        <Link to={`/services/${service._id}`}>{t("hero.readMore") || "CONTINUE READING"} →</Link>
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 bg-muted/30 rounded-3xl border border-dashed border-border text-center">
                                <p className="text-muted-foreground padauk-bold">ဝန်ဆောင်မှုများ မရှိသေးပါ</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Regional Districts (White) */}
            <section className="bg-background section-padding">
                <div className="container-custom">
                    <div className="text-center mb-16 flex flex-col items-center">
                        <div className="inline-flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em] mb-4">
                            Regional Offices
                        </div>
                        <h2 className="h2 mb-8 relative inline-block pb-4">
                            ခရိုင်အုပ်ချုပ်ရေးရုံးများ
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-primary/30 rounded-full"></div>
                        </h2>
                        <p className="p-lead text-muted-foreground max-w-2xl mx-auto mt-6">
                            ဒေသအလိုက် ခရိုင်ရုံးများနှင့် ဆက်သွယ်မေးမြန်းနိုင်သော အချက်အလက်များ
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {isDistrictsLoading ? (
                            [1, 2, 3].map(i => <Skeleton key={i} className="aspect-[16/10] rounded-3xl" />)
                        ) : (
                            displayDistricts.map((district: any) => (
                                <Link key={district._id} to="/districts" className="group flex flex-col overflow-hidden bg-card border border-border rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500">
                                    <div className="aspect-[16/10] bg-secondary/20 relative overflow-hidden">
                                        <img
                                            src={district.coverImage}
                                            alt=""
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <h3 className="text-xl font-bold text-white mb-2">{district.name}</h3>
                                            <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                                                VIEW DETAILS <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    <div className="mt-16 text-center">
                        <Button variant="outline" asChild className="border-border text-muted-foreground hover:border-primary hover:text-primary font-bold rounded-xl px-10 h-14">
                            <Link to="/districts">VIEW ALL DISTRICTS</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Official Press Center (Slate Alternate) */}
            {allFeedNews.length > 0 && (
                <section id="news-feed" className="bg-secondary/10 section-padding border-t border-border/50">
                    <div className="container-custom">
                        <div className="text-center mb-16 flex flex-col items-center">
                            <div className="inline-flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em] mb-4">
                                Press Center
                            </div>
                            <h2 className="h2 mb-8 relative inline-block pb-4">
                                Latest Official News
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-primary/30 rounded-full"></div>
                            </h2>
                            <p className="p-lead text-muted-foreground max-w-2xl mx-auto mt-6">
                                ဌာန၏ လုပ်ဆောင်ချက်များ၊ သတင်းထုတ်ပြန်ချက်များနှင့် အထူးသတင်းများကို ဤနေရာတွင် စုစည်းတင်ပြထားပါသည်။
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {paginatedFeed.map((news) => (
                                <Link key={news._id} to={`/news/${news._id}`} className="group flex flex-col h-full bg-card rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                                    <div className="aspect-[16/10] relative overflow-hidden">
                                        {news.images && news.images.length > 0 ? (
                                            <img
                                                src={news.images[0]}
                                                alt=""
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">Archive Image</div>
                                        )}
                                        <div className="absolute top-6 left-6">
                                            <span className="px-3 py-1 bg-background/95 backdrop-blur-sm text-primary font-bold text-[10px] uppercase tracking-widest rounded shadow-sm border border-border/50">
                                                {news.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 text-muted-foreground font-bold text-[10px] uppercase tracking-widest mb-6">
                                            <div className="flex items-center gap-1.5"><Calendar size={12} className="text-primary" /> {new Date(news.createdAt).toLocaleDateString('en-GB')}</div>
                                            <div className="w-[1px] h-3 bg-border" />
                                            <div className="flex items-center gap-1.5"><User size={12} className="text-primary" /> {news.author?.name || "Admin"}</div>
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-[1.6] mb-8 padauk-bold">
                                            {news.title}
                                        </h3>
                                        <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between group-hover:text-primary transition-all font-bold text-xs uppercase tracking-widest text-muted-foreground">
                                            READ MORE <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-20 flex items-center justify-center gap-3">
                                <button
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="w-12 h-12 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-30 transition-all bg-card"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                {Array.from({ length: totalPages }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handlePageChange(idx + 1)}
                                        className={`w-12 h-12 rounded-xl font-bold transition-all ${currentPage === idx + 1
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
                                    className="w-12 h-12 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-30 transition-all bg-card"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Official Announcements Section (White) */}
            <section className="bg-background section-padding border-b border-border/50">
                <div className="container-custom">
                    <div className="text-center mb-16 flex flex-col items-center">
                        <div className="inline-flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em] mb-4">
                            Official Directives
                        </div>
                        <h2 className="h2 mb-8 relative inline-block pb-4">
                            နောက်ဆုံးရ ထုတ်ပြန်ချက်များ
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-primary/30 rounded-full"></div>
                        </h2>
                        <p className="p-lead text-muted-foreground max-w-2xl mx-auto mt-6">
                            ဌာနမှ ထုတ်ပြန်သော အမိန့်ကြော်ငြာစာများ၊ ညွှန်ကြားချက်များနှင့် အများပြည်သူ သိမှတ်ဖွယ်ရာများကို ဤနေရာတွင် ဖတ်ရှုနိုင်ပါသည်။
                        </p>
                    </div>

                    {isAnnouncementsLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="aspect-[1/1.414] rounded-2xl" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                            {latestAnnouncements.map((announcement) => (
                                <Link
                                    key={announcement._id}
                                    to={`/announcements/${announcement._id}`}
                                    className="group flex flex-col transition-all duration-300 transform hover:-translate-y-2"
                                >
                                    <div className="w-full aspect-[1/1.414] bg-secondary/10 relative overflow-hidden border border-border/50 rounded-2xl shadow-sm group-hover:shadow-xl group-hover:border-primary/50 transition-all">
                                        {announcement.documentImages && announcement.documentImages.length > 0 ? (
                                            <img
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

                    <div className="mt-16 text-center">
                        <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary/5 font-bold rounded-xl px-10 h-14">
                            <Link to="/announcements" className="flex items-center gap-2">ကြည့်ရှုရန် <ArrowRight size={18} /></Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Error Message */}
            {isError && (
                <div className="container-custom py-10">
                    <div className="bg-destructive/5 border border-destructive/20 p-6 rounded-2xl flex items-center gap-4 text-destructive">
                        <AlertCircle size={24} />
                        <p className="font-bold">သတင်းအချက်အလက်များ ရယူရာတွင် အဆင်မပြေမှု ရှိနေပါသည်။</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
