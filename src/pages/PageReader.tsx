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
                                <Download size={18} /> {t("pageReader.download")}
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Banner Section: Institutional Identity */}
            <div className="w-full relative bg-slate-950 overflow-hidden border-b border-slate-900">
                <div className="absolute inset-0 z-0">
                    {page.bannerImage ? (
                        <div className="relative w-full h-full">
                            <img src={page.bannerImage} alt={page.title} className="w-full h-full object-cover opacity-30 grayscale filter" />
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
                            {page.section === "services" ? "DEPARTMENTAL SERVICE" : "DISTRICT ADMINISTRATION"}
                            <span className="w-12 h-[1px] bg-primary/40"></span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-0 leading-[1.1] max-w-4xl tracking-tight">
                            {page.title}
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 py-6 border-y border-white/10 w-full max-w-3xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-900 rounded-sm text-primary">
                                {page.section === "services" ? <Briefcase size={16} /> : <MapPin size={16} />}
                            </div>
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                                {page.section === "services" ? t("pageReader.service") : t("pageReader.districtInfo")}
                            </span>
                        </div>
                        <div className="w-[1px] h-4 bg-white/10 hidden md:block" />
                        <div className="flex items-center gap-3 text-slate-300">
                            <User size={16} className="text-primary" />
                            <span className="text-xs font-bold uppercase tracking-widest leading-none">
                                {page.author?.name || "Official Admin"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container-custom -mt-16 sm:-mt-24 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content Canvas */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-sm border border-slate-200 p-8 md:p-16 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)]">
                            <div className="mb-12">
                                <Breadcrumbs items={breadcrumbItems} />
                            </div>

                            {page.bannerImage && (
                                <div
                                    className="relative group mb-12 overflow-hidden rounded-sm cursor-zoom-in border border-slate-100"
                                    onClick={() => setLightboxImage(page.bannerImage)}
                                >
                                    <img
                                        src={page.bannerImage}
                                        alt={page.title}
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
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />

                            <div className="mt-16 flex items-center justify-between border-t border-slate-100 pt-10">
                                <Link
                                    to={page.section === "services" ? "/services" : "/districts"}
                                    className="flex items-center gap-3 px-8 py-4 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:bg-white hover:text-primary transition-all"
                                >
                                    <ArrowLeft size={16} /> {t("pageReader.back")}
                                </Link>

                                <div className="flex items-center gap-6">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Public Archive</span>
                                    <ShareButtons
                                        url={window.location.href}
                                        title={page.title}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Institutional Context */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Official Support Sidebar Card */}
                        <div className="bg-slate-950 text-white p-8 rounded-sm shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <h4 className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4">Official Notice</h4>
                                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                    This page contains official administrative data and service protocols of the Ta'ang Land Federal Unit.
                                </p>
                                <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Documentation Type</div>
                                    <div className="text-xs font-bold text-slate-300">
                                        {page.section === "services" ? "Public Service Charter" : "District Governance Record"}
                                    </div>
                                </div>
                            </div>
                            <img src="/logo1-removebg-preview.png" alt="" className="absolute -bottom-10 -right-10 w-48 opacity-[0.05] grayscale invert rotate-12 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

