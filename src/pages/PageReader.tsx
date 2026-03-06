import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGetPageByIdQuery } from "../store/pageApiSlice";
import Breadcrumbs from "../components/Breadcrumbs";
import ShareButtons from "../components/ShareButtons";
import { Loader2, ArrowLeft, User, MapPin, Briefcase, X, ZoomIn, Download } from "lucide-react";

export default function PageReader() {
    const { t } = useTranslation();
    const { id } = useParams();
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const { data: page, isLoading, isError } = useGetPageByIdQuery(id as string, { skip: !id });

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
                <p className="text-slate-500 padauk-bold text-lg animate-pulse">{t("pageReader.preparing")}</p>
            </div>
        );
    }

    if (isError || !page) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <h2 className="text-2xl font-bold text-slate-800 padauk-bold mb-4">{t("pageReader.notFound")}</h2>
                <Link to="/" className="px-6 py-3 bg-[#808080] text-white font-bold rounded-xl padauk-bold flex items-center gap-2">
                    <ArrowLeft size={18} /> {t("pageReader.back")}
                </Link>
            </div>
        );
    }

    const breadcrumbItems = [
        {
            label: page.section === "services" ? t("services.title") : t("districts.title"),
            path: page.section === "services" ? "/services" : "/districts"
        },
        { label: page.title }
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
                        <div className="mt-6">
                            <a
                                href={lightboxImage}
                                download
                                className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-colors border border-white/20"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Download size={16} /> {t("pageReader.download")}
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Area */}
            <div className="w-full relative bg-slate-900 overflow-hidden">
                <div className="absolute inset-0">
                    {page.bannerImage ? (
                        <div className="relative w-full h-full">
                            <img src={page.bannerImage} alt={page.title} className="w-full h-full object-cover opacity-30 blur-md scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950" />
                    )}
                </div>

                <div className="container mx-auto max-w-4xl px-4 py-20 text-center relative z-10 animate-in fade-in slide-in-from-top-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-500/20 backdrop-blur-md rounded-full text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 border border-slate-500/30">
                        {page.section === "services" ? <Briefcase size={14} /> : <MapPin size={14} />}
                        {page.section === "services" ? t("pageReader.service") : t("pageReader.districtInfo")}
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-tight padauk-bold drop-shadow-2xl">
                        {page.title}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-slate-300">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-slate-800 rounded-full border border-slate-700"><User size={14} /></div>
                            <span className="text-sm font-medium">{page.author?.name || "Admin"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto max-w-4xl px-4 -mt-12 relative z-20">
                <div className="bg-white rounded-3xl p-6 md:p-12 shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                    <Breadcrumbs items={breadcrumbItems} />

                    {page.bannerImage && (
                        <div
                            className="relative group mb-12 overflow-hidden rounded-2xl cursor-zoom-in border border-slate-100"
                            onClick={() => setLightboxImage(page.bannerImage)}
                        >
                            <img
                                src={page.bannerImage}
                                alt={page.title}
                                className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="p-4 bg-white/20 backdrop-blur-md text-white rounded-full">
                                    <ZoomIn size={24} />
                                </span>
                            </div>
                        </div>
                    )}

                    <article
                        className="prose prose-slate prose-lg max-w-none padauk-regular
                        prose-headings:padauk-bold prose-headings:text-slate-900
                        prose-a:text-[#808080] prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-2xl prose-img:shadow-lg prose-img:mx-auto prose-img:cursor-zoom-in
                        prose-p:leading-relaxed prose-p:text-slate-700"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />

                    <ShareButtons
                        url={window.location.href}
                        title={page.title}
                    />

                    <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
                        <Link
                            to={page.section === "services" ? "/services" : "/districts"}
                            className="text-slate-400 hover:text-[#808080] flex items-center gap-2 text-sm font-bold transition-colors padauk-bold"
                        >
                            <ArrowLeft size={16} /> {t("pageReader.back")}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

