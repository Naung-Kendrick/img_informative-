import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGetNewsByIdQuery, useGetAllNewsQuery, useToggleLikeNewsMutation } from "../store/newsApiSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import Comments from "../components/Comments";
import ReportModal from "../components/ReportModal";
import {
    Loader2,
    ArrowLeft,
    Calendar,
    User,
    Tag,
    X,
    Heart,
    Eye,
    Share2,
    Flag,
    ChevronLeft
} from "lucide-react";

/**
 * Senior UI/UX Redesign: Professional 2-Column News Reader
 * Adheres to top-tier digital journalism standards.
 */
export default function NewsReader() {
    const { id } = useParams();
    const articleId = id as string;
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    // Data Fetching
    const { data: article, isLoading, isError } = useGetNewsByIdQuery(articleId, { skip: !id });
    const { data: allNews } = useGetAllNewsQuery();
    const [toggleLikeNews, { isLoading: isLiking }] = useToggleLikeNewsMutation();

    // Related News Logic (Same category, excluding current)
    const relatedNews = allNews
        ?.filter((n) => n.category === article?.category && n._id !== id && n.status === "Published")
        .slice(0, 5) || [];

    const isLiked = article?.likes?.some(like => like._id === user?._id);

    const handleToggleLike = async () => {
        if (!isAuthenticated) {
            alert("ကျေးဇူးပြု၍ အရင်ဆုံး Login ဝင်ပေးပါ။");
            return;
        }
        if (!id || isLiking) return;
        try {
            await toggleLikeNews(id).unwrap();
        } catch (err) {
            console.error("Failed to like:", err);
        }
    };

    // Auto-scroll to top on ID change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (isLoading) {
        return (
            <div className="page-container bg-background flex flex-col items-center justify-center min-h-[70vh]">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-6" />
                <p className="p-small animate-pulse">Synchronizing Data...</p>
            </div>
        );
    }

    if (isError || !article) {
        return (
            <div className="page-container bg-background flex flex-col items-center justify-center min-h-[70vh] px-4">
                <div className="bg-card p-12 rounded-xl border border-border shadow-xl max-w-md text-center">
                    <h2 className="h2 mb-4">Access Denied</h2>
                    <p className="p-muted mb-8">The requested document could not be retrieved from the server. It may have been archived or removed.</p>
                    <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all">
                        <ArrowLeft size={16} /> Return to Portal
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container bg-background min-h-screen">
            {/* Lightbox Modal */}
            {lightboxImage && (
                <div className="fixed inset-0 z-[100] bg-foreground/95 flex items-center justify-center p-8 animate-in fade-in duration-300" onClick={() => setLightboxImage(null)}>
                    <button className="absolute top-10 right-10 text-background/50 hover:text-background transition-colors"><X size={32} /></button>
                    <img src={lightboxImage} alt="Full view" className="max-h-[85vh] max-w-full rounded-sm shadow-2xl animate-in zoom-in-95 duration-500 border border-background/10" />
                </div>
            )}

            {/* Breadcrumb / Top Navigation */}
            <div className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
                <div className="container-custom py-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors p-small">
                        <ChevronLeft size={16} /> နောက်သို့ ပြန်သွားရန်
                    </Link>
                </div>
            </div>

            <main className="container-custom section-padding">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* LEFT SIDE: MAIN ARTICLE (8 Cols) */}
                    <div className="lg:col-span-8">
                        {/* Article Header */}
                        <header className="mb-10">
                            <div className="p-small inline-block px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-sm mb-6">
                                {article.category}
                            </div>
                            <h1 className="h1 mb-8">
                                {article.title}
                            </h1>

                            {/* Meta Row */}
                            <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-border mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-border">
                                        <User size={14} className="text-muted-foreground" />
                                    </div>
                                    <span className="text-xs font-bold text-foreground">{article.author?.name || "Official Admin"}</span>
                                </div>
                                <div className="hidden sm:block w-[1px] h-3 bg-border" />
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar size={14} />
                                    <span className="text-xs font-medium">{new Date(article.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </header>

                        {/* Images Gallery */}
                        {article.images && article.images.length > 0 && (
                            <div className="mb-12 space-y-4">
                                {/* Main Image */}
                                <div
                                    className="relative group overflow-hidden rounded-sm shadow-2xl border border-slate-100 cursor-zoom-in"
                                    onClick={() => setLightboxImage(article.images[0])}
                                >
                                    <img src={article.images[0]} alt="" className="w-full aspect-[16/9] object-cover group-hover:scale-[1.03] transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full text-white">
                                            <Eye size={24} />
                                        </div>
                                    </div>
                                </div>

                                {/* Thumbnails Grid (if more than 1 image) */}
                                {article.images.length > 1 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                        {article.images.slice(1).map((img, idx) => (
                                            <div
                                                key={idx}
                                                className="aspect-square rounded-sm overflow-hidden border border-slate-200 cursor-zoom-in group relative"
                                                onClick={() => setLightboxImage(img)}
                                            >
                                                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Article Body */}
                        <div
                            className="prose prose-slate prose-lg max-w-none 
                            prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
                            prose-p:text-muted-foreground prose-p:leading-[1.8] prose-p:text-[1.05rem]
                            prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-border prose-img:cursor-zoom-in
                            prose-strong:text-foreground prose-strong:font-bold
                            prose-blockquote:border-l-primary prose-blockquote:bg-secondary prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-r-lg
                            mb-16"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Engagement Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-border mb-16">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleToggleLike}
                                    disabled={isLiking}
                                    className={`flex items-center gap-3 px-6 py-3 rounded-lg p-small transition-all border ${isLiked
                                        ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "bg-card border-border text-muted-foreground hover:border-primary hover:text-primary"
                                        }`}
                                >
                                    <Heart size={16} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "animate-pulse" : ""} />
                                    <span>{article?.likes?.length || 0} Likes</span>
                                </button>
                                <button className="flex items-center gap-3 px-6 py-3 rounded-lg p-small bg-card border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-all">
                                    <Share2 size={16} />
                                    <span>Share</span>
                                </button>
                            </div>
                            <button
                                onClick={() => setIsReportModalOpen(true)}
                                className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors p-small"
                            >
                                <Flag size={14} /> Report Content
                            </button>
                        </div>

                        {/* Comments Section */}
                        <div className="bg-card rounded-xl border border-border p-8 md:p-12 shadow-sm">
                            <h3 className="h3 mb-10 flex items-center gap-4">
                                <span className="w-8 h-[2px] bg-primary"></span>
                                Public Interaction
                            </h3>
                            <Comments newsId={article._id} />
                        </div>
                    </div>

                    <ReportModal
                        isOpen={isReportModalOpen}
                        onClose={() => setIsReportModalOpen(false)}
                        newsId={article._id}
                        newsTitle={article.title}
                    />

                    {/* RIGHT SIDE: SIDEBAR (4 Cols) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-28 space-y-12">

                            {/* Related News Section */}
                            <div>
                                <h4 className="p-small text-foreground uppercase mb-8 pb-4 border-b-2 border-primary/20 flex justify-between items-center">
                                    ဆက်စပ်သတင်းများ
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                                        <div className="w-1 h-1 bg-primary rounded-full opacity-50"></div>
                                        <div className="w-1 h-1 bg-primary rounded-full opacity-20"></div>
                                    </div>
                                </h4>

                                {relatedNews.length > 0 ? (
                                    <div className="space-y-8">
                                        {relatedNews.map((news) => (
                                            <Link key={news._id} to={`/news/${news._id}`} className="group flex gap-4">
                                                <div className="w-20 h-20 bg-secondary rounded-lg overflow-hidden shrink-0 border border-border">
                                                    {news.images && news.images.length > 0 ? (
                                                        <img src={news.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center"><Tag size={20} className="text-muted-foreground/30" /></div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <h5 className="text-[14px] font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors mb-2">
                                                        {news.title}
                                                    </h5>
                                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                                                        <Calendar size={12} />
                                                        {new Date(news.createdAt).toLocaleDateString("en-GB")}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="p-muted italic">No related articles found in this category.</p>
                                )}
                            </div>

                            {/* Official Verification Widget */}
                            <div className="bg-slate-50/40 backdrop-blur-sm border border-slate-200/60 p-6 rounded-2xl relative overflow-hidden group shadow-sm">
                                <div className="relative z-10">
                                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                        Internal Records
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-relaxed mb-5 font-medium italic">
                                        Documentation authorized by the Media Clearance Division.
                                    </p>
                                    <div className="space-y-2.5">
                                        <div className="flex justify-between text-[9px] uppercase tracking-widest pb-2 border-b border-slate-100">
                                            <span className="text-slate-400 font-semibold">Security Tier</span>
                                            <span className="text-primary font-bold">Unclassified</span>
                                        </div>
                                        <div className="flex justify-between text-[9px] uppercase tracking-widest pt-1">
                                            <span className="text-slate-400 font-semibold">Source</span>
                                            <span className="text-slate-700 font-bold">TU Gov News</span>
                                        </div>
                                    </div>
                                </div>
                                <img src="/photo_2026-03-09_14-35-44-removebg-preview.png" alt="" className="absolute -bottom-4 -right-4 w-24 opacity-[0.03] grayscale rotate-12 pointer-events-none" />
                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
