import { useGetPagesBySectionQuery } from "../store/pageApiSlice";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, ArrowRight } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";

/**
 * Public Districts page — shows published pages with section="districts"
 */
export default function Districts() {
    const { t } = useTranslation();
    const { data: pages, isLoading, isError } = useGetPagesBySectionQuery("districts");

    const published = pages?.filter((p) => p.status === "Published") || [];

    return (
        <div className="bg-[#f8fafc] min-h-screen py-16 animate-in fade-in duration-500">
            <div className="container-custom">
                {/* Page Header: Official Identity */}
                <div className="mb-16 border-b border-slate-200 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-primary"></span>
                            Territorial Governance
                        </div>
                        <h1 className="mb-0 leading-none">
                            {t("districts.title")}
                        </h1>
                    </div>
                    <div className="text-muted-foreground text-sm font-medium max-w-md md:text-right">
                        {t("districts.subtitle")}
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-sm border border-slate-200 overflow-hidden">
                                <Skeleton className="w-full aspect-[16/10]" />
                                <div className="p-8">
                                    <Skeleton className="h-6 w-3/4 mb-4" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                        <div className="bg-red-50 text-red-500 p-8 rounded-sm border border-red-100 max-w-lg">
                            <h2 className="text-xl font-bold mb-3 uppercase tracking-tight">Data Error</h2>
                            <p className="text-sm opacity-80">Could not synchronize district administrative records. Please verify your connection.</p>
                        </div>
                    </div>
                ) : published.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                        <div className="bg-white text-slate-400 p-12 rounded-sm max-w-lg border border-slate-200 shadow-sm">
                            <MapPin size={40} className="mx-auto mb-6 text-slate-200" />
                            <h2 className="text-xl font-bold mb-3 text-slate-800 uppercase tracking-tight">{t("districts.noDistricts")}</h2>
                            <p className="text-sm leading-relaxed">{t("districts.noDistrictsDesc")}</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {published.map((page) => (
                            <Link
                                key={page._id}
                                to={`/districts/${page._id}`}
                                className="group bg-white rounded-sm border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col shadow-sm"
                            >
                                {/* Banner */}
                                <div className="aspect-[16/10] bg-slate-900 overflow-hidden relative">
                                    {page.bannerImage ? (
                                        <img src={page.bannerImage} alt={page.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-800">
                                            <MapPin size={50} className="opacity-10" />
                                            <div className="absolute inset-0 flex items-center justify-center italic text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500">Geospatial Record</div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                                    <div className="absolute top-6 right-6">
                                        <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-sm text-[9px] font-bold uppercase tracking-widest shadow-xl">
                                            Official Domain
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4">
                                        <MapPin size={12} />
                                        Regional Administration
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight tracking-tight">
                                        {page.title}
                                    </h3>
                                    <div
                                        className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-8 italic font-medium"
                                        dangerouslySetInnerHTML={{ __html: page.content.replace(/<[^>]*>?/gm, '') }}
                                    />
                                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center text-[11px] font-bold text-slate-400 group-hover:text-primary uppercase tracking-[0.2em] group-hover:gap-3 transition-all">
                                        View Profile <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform text-primary/70" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

