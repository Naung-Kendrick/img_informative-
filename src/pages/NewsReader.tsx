import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGetNewsByIdQuery, useGetAllNewsQuery, useToggleLikeNewsMutation } from "../store/newsApiSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import Comments from "../components/Comments";
import NetworkErrorState from "../components/ui/NetworkErrorState";
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
    Send
} from "lucide-react";
import { useModal } from "../context/ModalContext";
import { useTranslation } from "react-i18next";
import { getEffectiveDate, cleanContentForDisplay } from "../lib/dateUtils";

/**
 * Senior UI/UX Redesign: Professional 2-Column News Reader
 * Adheres to top-tier digital journalism standards.
 */
export default function NewsReader() {
    const { id } = useParams();
    const articleId = id as string;
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const { showSuccess, showError } = useModal();
    const { t } = useTranslation();

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
            showError("အကူအညီ", "ကျေးဇူးပြု၍ အရင်ဆုံး Login ဝင်ပေးပါ။");
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

    if (isError) {
        return (
            <div className="page-container bg-background flex flex-col items-center justify-center min-h-[70vh] px-4">
                <NetworkErrorState />
            </div>
        );
    }

    if (!article) {
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
                <div className="fixed inset-0 z-[100] bg-foreground/95 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300" onClick={() => setLightboxImage(null)}>
                    <button className="absolute top-6 right-6 sm:top-10 sm:right-10 text-background/50 hover:text-background transition-colors"><X size={28} /></button>
                    <img loading="lazy" src={lightboxImage} alt="Full view" className="max-h-[85vh] max-w-full rounded-sm shadow-2xl animate-in zoom-in-95 duration-500 border border-background/10" />
                </div>
            )}

            {/* Breadcrumb / Top Navigation */}
            <div className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
                <div className="container-custom py-4">
                    <Link to="/" className="inline-flex items-center gap-2 sm:gap-3 text-[#1e3a8a] bg-white border-2 border-[#1e3a8a] px-4 sm:px-6 py-2 rounded-lg text-[13px] sm:text-[15px] transition-all padauk-bold shadow-sm hover:bg-[#1e3a8a] hover:text-white active:scale-95 w-fit group">
                        <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-1" /> 
                        {t('newsReader.back')}
                    </Link>
                </div>
            </div>

            <main className="container-custom section-padding">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">

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
                                    <span className="text-xs font-bold text-foreground">{article.author?.name || t('newsReader.admin')}</span>
                                </div>
                                <div className="hidden sm:block w-[1px] h-3 bg-border" />
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar size={14} />
                                    <span className="text-xs font-medium">{new Date(getEffectiveDate(article)).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
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
                                    <img loading="lazy" src={article.images[0]} alt="" className="w-full aspect-[16/9] object-cover group-hover:scale-[1.03] transition-transform duration-1000" />
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
                                                <img loading="lazy" src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
                            dangerouslySetInnerHTML={{ __html: cleanContentForDisplay(article.content) }}
                        />

                        {/* Redesigned Engagement Bar */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 py-6 sm:py-8 border-y border-slate-100 mb-8 sm:mb-12">
                            <button
                                onClick={handleToggleLike}
                                disabled={isLiking}
                                className={`flex items-center gap-2 px-5 sm:px-8 h-10 sm:h-12 rounded-xl text-[13px] sm:text-[15px] font-bold transition-all shadow-sm active:scale-95 border-2 ${
                                    isLiked 
                                    ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" 
                                    : "bg-white text-slate-700 border-slate-200 hover:border-red-200 hover:text-red-500 hover:bg-slate-50"
                                }`}
                            >
                                <Heart size={20} className={`transition-colors duration-300 ${isLiked ? "fill-red-500 text-red-500" : "fill-transparent text-current"}`} />
                                <span className="padauk-bold">
                                    {t('newsReader.like')} {article?.likes?.length ? `(${article.likes.length})` : ""}
                                </span>
                            </button>

                            <div className="flex items-center gap-3">
                                {/* Generic Share / Copy */}
                                <button
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({ title: article.title, url: window.location.href });
                                        } else {
                                            navigator.clipboard.writeText(window.location.href);
                                            showSuccess("အောင်မြင်ပါသည်", "Link ကို Clipboard သို့ ကူးယူပြီးပါပြီ");
                                        }
                                    }}
                                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#f8f9fa] border border-[#f1f3f5] text-slate-600 hover:text-primary hover:border-primary/30 transition-all shadow-sm active:scale-95"
                                    title="Share or Copy Link"
                                >
                                    <Share2 size={20} />
                                </button>

                                {/* Facebook Share */}
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#f8f9fa] border border-[#f1f3f5] text-slate-600 hover:text-[#1877F2] hover:border-[#1877F2]/30 transition-all shadow-sm active:scale-95"
                                    title="Share on Facebook"
                                >
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </a>

                                {/* Telegram Share */}
                                <a
                                    href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#f8f9fa] border border-[#f1f3f5] text-slate-600 hover:text-[#0088cc] hover:border-[#0088cc]/30 transition-all shadow-sm active:scale-95"
                                    title="Share on Telegram"
                                >
                                    <Send size={20} />
                                </a>

                                {/* X (Twitter) Share */}
                                <a
                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#f8f9fa] border border-[#f1f3f5] text-slate-600 hover:text-black hover:border-black/30 transition-all shadow-sm active:scale-95"
                                    title="Share on X"
                                >
                                    <X size={20} />
                                </a>
                            </div>

                        </div>

                        {/* Comments Section */}
                        <div className="mt-12 bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-14 shadow-sm shadow-slate-100/50">
                            <Comments newsId={article._id} />
                        </div>
                    </div>


                    {/* RIGHT SIDE: SIDEBAR (4 Cols) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-28 space-y-12">

                            {/* Related News Section */}
                            <div>
                                <h4 className="p-small text-foreground uppercase mb-8 pb-4 border-b-2 border-primary/20 flex justify-between items-center">
                                    {t('newsReader.relatedNews')}
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
                                                        <img loading="lazy" src={news.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
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
                                                        {new Date(getEffectiveDate(news)).toLocaleDateString("en-GB")}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="p-muted">{t('newsReader.noRelated')}</p>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
