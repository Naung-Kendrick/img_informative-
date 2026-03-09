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
            <div className="page-container bg-background flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="p-muted animate-pulse">{t("pageReader.preparing")}</p>
            </div>
        );
    }

    if (isError || !page) {
        return (
            <div className="page-container bg-background flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <h2 className="h2 mb-4">{t("pageReader.notFound")}</h2>
                <Link to="/" className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl flex items-center gap-2">
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
        <div className="page-container bg-background">
            {/* Lightbox Modal */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-[100] bg-foreground/95 flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={() => setLightboxImage(null)}
                >
                    <button className="absolute top-8 right-8 text-background/50 hover:text-background transition-colors">
                        <X size={32} />
                    </button>
                    <div className="relative group max-w-6xl w-full flex flex-col items-center">
                        <img
                            src={lightboxImage}
                            alt="Full view"
                            className="max-h-[80vh] max-w-full rounded-sm shadow-2xl animate-in zoom-in-95 duration-300 pointer-events-none border border-background/10"
                        />
                        <div className="mt-8 flex items-center gap-6">
                            <a
                                href={lightboxImage}
                                download
                                className="flex items-center gap-3 px-6 py-3 bg-background/5 hover:bg-background/10 border border-background/10 text-background rounded-sm p-small transition-all"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Download size={18} /> {t("pageReader.download")}
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Banner Section: Institutional Identity */}
            <div className="w-full relative bg-foreground overflow-hidden border-b border-border">
                <div className="absolute inset-0 z-0">
                    {page.bannerImage ? (
                        <div className="relative w-full h-full">
                            <img src={page.bannerImage} alt={page.title} className="w-full h-full object-cover opacity-30 grayscale filter" />
                            <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/80 to-foreground" />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-foreground" />
                    )}
                    {/* Background Seal Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none invert">
                        <img src="/photo_2026-03-09_14-35-44-removebg-preview.png" alt="" className="scale-150 rotate-12" />
                    </div>
                </div>

                <div className="container-custom relative z-10 py-20 md:py-32 flex flex-col items-center text-center">
                    <div className="flex flex-col items-center gap-6 mb-10">
                        <div className="flex items-center gap-2 text-primary p-small">
                            <span className="w-12 h-[1px] bg-primary/40"></span>
                            {page.section === "services" ? "DEPARTMENTAL SERVICE" : "DISTRICT ADMINISTRATION"}
                            <span className="w-12 h-[1px] bg-primary/40"></span>
                        </div>
                        <h1 className="h1 text-white mb-0 max-w-4xl">
                            {page.title}
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 py-6 border-y border-white/10 w-full max-w-3xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-background/10 rounded-sm text-primary">
                                {page.section === "services" ? <Briefcase size={16} /> : <MapPin size={16} />}
                            </div>
                            <span className="p-small text-background/80">
                                {page.section === "services" ? t("pageReader.service") : t("pageReader.districtInfo")}
                            </span>
                        </div>
                        <div className="w-[1px] h-4 bg-white/10 hidden md:block" />
                        <div className="flex items-center gap-3 text-background/80">
                            <User size={16} className="text-primary" />
                            <span className="p-small leading-none text-background/80">
                                {page.author?.name || "Official Admin"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container-custom -mt-16 sm:-mt-24 relative z-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content Canvas */}
                    <div className="lg:col-span-8">
                        <div className="bg-card rounded-xl border border-border p-8 md:p-16 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)]">
                            <div className="mb-12">
                                <Breadcrumbs items={breadcrumbItems} />
                            </div>

                            {page.bannerImage && (
                                <div
                                    className="relative group mb-12 overflow-hidden rounded-xl cursor-zoom-in border border-border/50"
                                    onClick={() => setLightboxImage(page.bannerImage)}
                                >
                                    <img
                                        src={page.bannerImage}
                                        alt={page.title}
                                        className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-background/10 backdrop-blur-md border border-background/20 text-background p-4 rounded-full">
                                            <ZoomIn size={24} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <article
                                className="prose prose-slate prose-lg max-w-none 
                                prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
                                prose-p:text-muted-foreground prose-p:leading-[1.8] prose-p:mb-8
                                prose-img:rounded-sm prose-img:shadow-xl prose-img:mx-auto prose-img:cursor-zoom-in prose-img:border prose-img:border-border
                                prose-strong:text-foreground prose-strong:font-bold
                                prose-blockquote:border-l-primary prose-blockquote:bg-secondary prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-sm
                                prose-li:text-muted-foreground"
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />

                            <div className="mt-16 flex items-center justify-between border-t border-border pt-10">
                                <Link
                                    to={page.section === "services" ? "/services" : "/districts"}
                                    className="flex items-center gap-3 px-8 py-4 bg-secondary border border-border rounded-lg p-small text-muted-foreground hover:bg-background hover:text-primary transition-all"
                                >
                                    <ArrowLeft size={16} /> {t("pageReader.back")}
                                </Link>

                                <div className="flex items-center gap-6">
                                    <span className="p-small text-muted-foreground/50 hidden sm:block font-bold">Public Archive</span>
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
                        <div className="sticky top-24 bg-foreground text-background p-8 rounded-xl shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <h4 className="p-small text-primary mb-4">Official Notice</h4>
                                <p className="text-sm text-background/60 leading-relaxed mb-6 font-medium">
                                    This page contains official administrative data and service protocols of the Ta'ang Land Federal Unit.
                                </p>
                                <div className="p-4 bg-background/5 border border-background/10 rounded-sm">
                                    <div className="text-[10px] text-background/40 font-bold uppercase tracking-widest mb-1">Documentation Type</div>
                                    <div className="text-xs font-bold text-background/80">
                                        {page.section === "services" ? "Public Service Charter" : "District Governance Record"}
                                    </div>
                                </div>
                            </div>
                            <img src="/photo_2026-03-09_14-35-44-removebg-preview.png" alt="" className="absolute -bottom-10 -right-10 w-48 opacity-[0.05] grayscale invert rotate-12 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

