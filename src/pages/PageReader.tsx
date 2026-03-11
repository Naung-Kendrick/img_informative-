import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGetPageByIdQuery } from "../store/pageApiSlice";
import Breadcrumbs from "../components/Breadcrumbs";
import ShareButtons from "../components/ShareButtons";
import { Loader2, ArrowLeft, MapPin, Briefcase, X, ZoomIn, Download } from "lucide-react";

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

            <div className="container-custom py-8">
                <div className="mb-10">
                    <Breadcrumbs items={breadcrumbItems} />
                </div>

                <div className="max-w-4xl mx-auto pb-24">
                    {/* Header Section */}
                    <div className="mb-10 pb-6 border-b border-border">
                        <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                            {page.section === "services" ? <Briefcase size={16} /> : <MapPin size={16} />}
                            {page.section === "services" ? t("pageReader.service", "DEPARTMENTAL SERVICE") : t("pageReader.districtInfo", "DISTRICT ADMINISTRATION")}
                        </div>
                        <h1 className="h1 text-foreground leading-tight mb-0">
                            {page.title}
                        </h1>
                    </div>

                    {/* Banner Image */}
                    {page.bannerImage && (
                        <div
                            className="relative group mb-12 overflow-hidden rounded-2xl shadow-xl cursor-zoom-in border border-border"
                            onClick={() => setLightboxImage(page.bannerImage)}
                        >
                            <img
                                src={page.bannerImage}
                                alt={page.title}
                                className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-4 rounded-full">
                                    <ZoomIn size={24} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Article Body */}
                    <div className="bg-card rounded-2xl border border-border p-8 md:p-12 shadow-sm mb-12">
                        <article
                            className="prose prose-slate prose-lg max-w-none 
                            prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
                            prose-p:text-muted-foreground prose-p:leading-[1.8] prose-p:mb-8
                            prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto prose-img:cursor-zoom-in prose-img:border prose-img:border-border
                            prose-strong:text-foreground prose-strong:font-bold
                            prose-blockquote:border-l-primary prose-blockquote:bg-secondary prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl
                            prose-li:text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border pt-8">
                        <Link
                            to={page.section === "services" ? "/services" : "/districts"}
                            className="flex items-center gap-3 px-6 py-3 bg-secondary border border-border rounded-xl font-bold text-sm text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm"
                        >
                            <ArrowLeft size={16} /> {t("pageReader.back")}
                        </Link>

                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">Public Archive</span>
                            <ShareButtons
                                url={window.location.href}
                                title={page.title}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

