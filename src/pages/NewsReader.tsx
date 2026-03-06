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
        <div className="bg-white min-h-screen pb-16">
            {/* Lightbox Modal */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={() => setLightboxImage(null)}
                >
                    <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors">
                        <X size={32} />
                    </button>
                    <div className="relative group max-w-5xl w-full flex flex-col items-center">
                        <img
                            src={lightboxImage}
                            alt="Full view"
                            className="max-h-[85vh] max-w-full rounded-lg shadow-2xl animate-in zoom-in-95 duration-300 pointer-events-none"
                        />
                        <div className="mt-6 flex items-center gap-4">
                            <a
                                href={lightboxImage}
                                download
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Download size={16} /> {t("newsReader.download")}
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Banner / Header Image Area */}
            <div className="w-full relative bg-slate-900 border-b border-slate-200">
                <div className="absolute inset-0 z-0">
                    {article.bannerImage ? (
                        <div className="relative w-full h-full">
                            <img src={article.bannerImage} alt={article.title} className="w-full h-full object-cover opacity-40 blur-sm" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950" />
                    )}
                </div>

                {/* Header Content constrained width */}
                <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24 relative z-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">

                    <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
                        <span className="flex items-center gap-1.5 px-4 py-1.5 bg-[#808080] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                            <Tag size={14} /> {article.category === "Activities" ? t("activities.badge") : article.category === "Announcements" ? t("announcements.badge") : article.category}
                        </span>
                        <span className="px-4 py-1.5 bg-slate-800/80 backdrop-blur-md text-slate-200 rounded-full text-xs font-medium border border-slate-700 shadow-lg flex items-center gap-1.5">
                            <Calendar size={14} /> {new Date(article.createdAt).toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-tight padauk-bold drop-shadow-2xl">
                        {article.title}
                    </h1>

                    <div className="flex items-center justify-center gap-3 text-slate-200">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border-2 border-[#808080] overflow-hidden">
                            <User size={20} className="text-slate-400" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-sm font-bold text-white uppercase tracking-wide">{t("newsReader.author")}</span>
                            <span className="text-xs font-medium text-[#808080]">{article.author?.name || t("newsReader.admin")}</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Main Reading Canvas */}
            <div className="container mx-auto max-w-4xl px-4 -mt-12 relative z-20">
                <div className="bg-white rounded-3xl p-6 md:p-12 shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">

                    <Breadcrumbs items={breadcrumbItems} />

                    {/* Featured Image (Banner) - Clickable for Lightbox */}
                    {article.bannerImage && (
                        <div
                            className="relative group mb-10 overflow-hidden rounded-2xl cursor-zoom-in"
                            onClick={() => setLightboxImage(article.bannerImage)}
                        >
                            <img
                                src={article.bannerImage}
                                alt={article.title}
                                className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full">
                                    <ZoomIn size={24} />
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Tailwind Typography Injection `.prose` -> Formats inner Tiptap generated HTML universally! */}
                    <article
                        className="prose prose-slate prose-lg max-w-none padauk-regular
                        prose-headings:padauk-bold prose-headings:text-slate-900
                        prose-a:text-[#808080] prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-2xl prose-img:shadow-lg prose-img:mx-auto prose-img:cursor-zoom-in
                        prose-p:leading-relaxed prose-p:text-slate-700"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Like / Love Button */}
                    <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleToggleLike}
                                disabled={isLiking}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all duration-300 shadow-sm padauk-bold ${isLiked
                                    ? "bg-red-50 text-red-600 border border-red-100 ring-2 ring-red-50"
                                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                                    }`}
                            >
                                <Heart
                                    size={20}
                                    fill={isLiked ? "currentColor" : "none"}
                                    className={`${isLiked ? "animate-pulse" : ""} transition-transform active:scale-125`}
                                />
                                <span>{article?.likes?.length || 0} {t("newsReader.loves")}</span>
                            </button>
                        </div>

                        {/* Share Buttons */}
                        <ShareButtons
                            url={window.location.href}
                            title={article.title}
                        />
                    </div>

                    {/* Phase 4 Comment Hooks Generation */}
                    <div className="mt-16">
                        <Comments newsId={article._id} />
                    </div>

                </div>
            </div>

        </div>
    );
}

