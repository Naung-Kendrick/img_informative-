import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGetNewsByIdQuery, useToggleLikeNewsMutation } from "../store/newsApiSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import Comments from "../components/Comments";
import Breadcrumbs from "../components/Breadcrumbs";
import ShareButtons from "../components/ShareButtons";
import { Loader2, ArrowLeft, Calendar, User, Tag, X, ZoomIn, Download, Heart } from "lucide-react";

export default function NewsReader() {
    const { t } = useTranslation();
    const { id } = useParams();
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { data: newsQuery, isLoading, isError } = useGetNewsByIdQuery(id as string, { skip: !id });
    const [toggleLikeNews, { isLoading: isLiking }] = useToggleLikeNewsMutation();

    const article = newsQuery;
    const isLiked = article?.likes?.includes(user?._id || "");

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

    // Lightbox click handler for images in rich text
    useEffect(() => {
        const handleImageClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'IMG' && target.closest('article')) {
                setLightboxImage((target as HTMLImageElement).src);
            }
        };

        document.addEventListener('click', handleImageClick);
        return () => document.removeEventListener('click', handleImageClick);
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 text-[#808080] animate-spin mb-4" />
                <p className="text-slate-500 padauk-bold text-lg animate-pulse">{t("newsReader.preparing")}</p>
            </div>
        );
    }

    if (isError || !article) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <h2 className="text-2xl font-bold text-slate-800 padauk-bold mb-4">{t("newsReader.notFound")}</h2>
                <p className="text-slate-500 padauk-regular mb-8">{t("newsReader.notFoundDesc")}</p>
                <Link to="/" className="px-6 py-3 bg-[#808080] hover:bg-[#555555] text-white font-bold rounded-xl transition-colors padauk-bold flex items-center gap-2">
                    <ArrowLeft size={18} /> {t("newsReader.backHome")}
                </Link>
            </div>
        );
    }

    const breadcrumbItems = [
        { label: article.category === "Activities" ? t("activities.title") : article.category === "Announcements" ? t("announcements.title") : article.category, path: article.category === "Activities" ? "/activities" : article.category === "Announcements" ? "/announcements" : "/" },
        { label: article.title }
    ];

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-24">
            {/* Lightbox Modal */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-[100] bg-slate-950/98 flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={() => setLightboxImage(null)}
                >
                    <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                        <X size={32} />
                    </button>
                    <div className="relative group max-w-6xl w-full flex flex-col items-center">
                        <img
                            src={lightboxImage}
                            alt="Full view"
                            className="max-h-[80vh] max-w-full rounded-sm shadow-2xl animate-in zoom-in-95 duration-300 pointer-events-none border border-white/10"
                        />
                        <div className="mt-8 flex items-center gap-6">
                            <a
                                href={lightboxImage}
                                download
                                className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-sm text-xs font-bold uppercase tracking-widest transition-all"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Download size={18} /> {t("newsReader.download")}
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Banner Section: Institutional Authority */}
            <div className="w-full relative bg-slate-950 overflow-hidden border-b border-slate-900">
                <div className="absolute inset-0 z-0">
                    {article.bannerImage ? (
                        <div className="relative w-full h-full">
                            <img src={article.bannerImage} alt={article.title} className="w-full h-full object-cover opacity-30 grayscale filter" />
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950" />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-slate-950" />
                    )}
                    {/* Background Seal Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none invert">
                        <img src="/logo1-removebg-preview.png" alt="" className="scale-150 rotate-12" />
                    </div>
                </div>

                <div className="container-custom relative z-10 py-20 md:py-32 flex flex-col items-center text-center">
                    <div className="flex flex-col items-center gap-6 mb-10">
                        <div className="flex items-center gap-2 text-primary text-[11px] font-bold uppercase tracking-[0.3em]">
                            <span className="w-12 h-[1px] bg-primary/40"></span>
                            OFFICIAL STATEMENT
                            <span className="w-12 h-[1px] bg-primary/40"></span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-0 leading-[1.1] max-w-4xl tracking-tight">
                            {article.title}
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 py-6 border-y border-white/10 w-full max-w-3xl">
                        <div className="flex items-center gap-3">
                            <Calendar size={16} className="text-primary" />
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                                {new Date(article.createdAt).toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                        <div className="w-[1px] h-4 bg-white/10 hidden md:block" />
                        <div className="flex items-center gap-3">
                            <Tag size={16} className="text-primary" />
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">{article.category}</span>
                        </div>
                        <div className="w-[1px] h-4 bg-white/10 hidden md:block" />
                        <div className="flex items-center gap-3 text-slate-300">
                            <User size={16} className="text-primary" />
                            <span className="text-xs font-bold uppercase tracking-widest leading-none">
                                {article.author?.name || t("newsReader.admin")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container-custom -mt-16 sm:-mt-24 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Article Canvas */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-sm border border-slate-200 p-8 md:p-16 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)]">
                            <div className="mb-12">
                                <Breadcrumbs items={breadcrumbItems} />
                            </div>

                            {article.bannerImage && (
                                <div
                                    className="relative group mb-12 overflow-hidden rounded-sm cursor-zoom-in border border-slate-100"
                                    onClick={() => setLightboxImage(article.bannerImage)}
                                >
                                    <img
                                        src={article.bannerImage}
                                        alt={article.title}
                                        className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-4 rounded-full">
                                            <ZoomIn size={24} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <article
                                className="prose prose-slate prose-lg max-w-none 
                                prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight
                                prose-p:text-slate-700 prose-p:leading-[1.8] prose-p:mb-8
                                prose-img:rounded-sm prose-img:shadow-xl prose-img:mx-auto prose-img:cursor-zoom-in prose-img:border prose-img:border-slate-100
                                prose-strong:text-slate-900 prose-strong:font-bold
                                prose-blockquote:border-l-primary prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-sm
                                prose-li:text-slate-700"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />

                            {/* Like / Love Interaction */}
                            <div className="mt-16 flex items-center justify-between border-t border-slate-100 pt-10">
                                <button
                                    onClick={handleToggleLike}
                                    disabled={isLiking}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-sm font-bold uppercase tracking-widest text-[11px] transition-all duration-300 shadow-xl ${isLiked
                                        ? "bg-red-600 text-white"
                                        : "bg-white text-slate-600 border border-slate-200 hover:border-red-600 hover:text-red-600"
                                        }`}
                                >
                                    <Heart
                                        size={18}
                                        fill={isLiked ? "currentColor" : "none"}
                                        className={`${isLiked ? "animate-pulse" : ""} transition-transform active:scale-125`}
                                    />
                                    <span>{article?.likes?.length || 0} Appreciation</span>
                                </button>

                                <div className="flex items-center gap-6">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Spread Awareness</span>
                                    <ShareButtons
                                        url={window.location.href}
                                        title={article.title}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="mt-12 bg-white rounded-sm border border-slate-200 p-8 md:p-12 shadow-sm">
                            <h4 className="text-xl font-bold mb-8 flex items-center gap-3 text-slate-900">
                                Public Discourse
                                <span className="w-12 h-[1px] bg-slate-200"></span>
                            </h4>
                            <Comments newsId={article._id} />
                        </div>
                    </div>

                    {/* Sidebar: Institutional Context */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Official Support Sidebar Card */}
                        <div className="bg-slate-950 text-white p-8 rounded-sm shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <h4 className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4">Official Verification</h4>
                                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                    All information published on this portal is verified by the Department of Media and Public Relations of the Ta'ang Land Federal Unit.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Source Accuracy</div>
                                        <div className="text-xs font-bold text-slate-300">Verified Department Document</div>
                                    </div>
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Access Tier</div>
                                        <div className="text-xs font-bold text-slate-300">Public Domain Access</div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Seal */}
                            <img src="/logo1-removebg-preview.png" alt="" className="absolute -bottom-10 -right-10 w-48 opacity-[0.05] grayscale invert rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                        </div>

                        {/* Back Link */}
                        <Link to="/" className="flex items-center justify-center gap-3 w-full py-4 border border-slate-200 rounded-sm text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-white hover:text-primary transition-all">
                            <ArrowLeft size={16} /> {t("newsReader.backHome")}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

