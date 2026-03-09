import { Link } from "react-router-dom";
import { IdCard, BookOpen, ArrowRight, AlertCircle, Briefcase } from "lucide-react";
import { Button } from "../components/ui/button";
import { useTranslation } from "react-i18next";
import { useGetPagesBySectionQuery } from "../store/pageApiSlice";
import { Skeleton } from "../components/ui/skeleton";

export default function Services() {
    const { t } = useTranslation();
    const { data: services, isLoading, isError } = useGetPagesBySectionQuery("services", {
        pollingInterval: 30000,
    });

    const publishedServices = services?.filter(s => s.status === "Published") || [];

    return (
        <div className="page-container bg-background animate-in fade-in duration-500 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10"></div>

            <div className="container-custom section-padding pb-32">
                {/* Page Header */}
                <div className="mb-16 text-center max-w-3xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/20">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        {t("services.portalBadge")}
                    </div>
                    <h1 className="h1 mb-8 relative inline-block pb-4">
                        {t("services.publicServices")}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-primary/30 rounded-full"></div>
                    </h1>
                    <p className="p-lead mt-6">
                        {t("services.publicServicesDesc")}
                    </p>
                </div>

                {/* Content Logic */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <Skeleton className="h-[500px] rounded-2xl" />
                        <Skeleton className="h-[500px] rounded-2xl" />
                    </div>
                ) : isError ? (
                    <div className="text-center py-20 bg-destructive/5 rounded-2xl border border-destructive/10 max-w-2xl mx-auto">
                        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                        <h3 className="h4 mb-2">{t("errors.failedToLoad")}</h3>
                        <p className="p-muted mb-6">ဒေတာရယူနေစဉ် အဆင်မပြေမှု ရှိနေပါသည်။</p>
                    </div>
                ) : publishedServices.length === 0 ? (
                    <div className="text-center py-20 bg-muted/30 rounded-2xl border border-border max-w-2xl mx-auto">
                        <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                        <h3 className="h4 text-slate-400 mb-2">ဝန်ဆောင်မှုများ မရှိသေးပါ</h3>
                        <p className="p-muted">ဌာနမှ ဆောင်ရွက်ပေးနေသော ဝန်ဆောင်မှုများကို မကြာမီ ဖော်ပြပေးပါမည်။</p>
                    </div>
                ) : (
                    /* Dynamic Card Layout */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                        {publishedServices.map((service, index) => (
                            <div
                                key={service._id}
                                className="bg-card rounded-[2rem] border border-border hover:border-primary/30 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group transform hover:-translate-y-2 relative overflow-hidden"
                            >
                                {/* Banner Decorative or Featured */}
                                <div className="aspect-[16/9] bg-secondary/20 relative overflow-hidden border-b border-border">
                                    {service.bannerImage ? (
                                        <img
                                            src={service.bannerImage}
                                            alt={service.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-primary/20">
                                            {index % 2 === 0 ? <IdCard size={100} strokeWidth={0.5} /> : <BookOpen size={100} strokeWidth={0.5} />}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                                    <div className="absolute bottom-6 left-8">
                                        <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] text-white font-bold uppercase tracking-widest leading-none">
                                            Service Node #{service.order || 1}
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-8 md:p-10 flex flex-col flex-grow">
                                    <h2 className="h3 mb-4 padauk-bold text-foreground group-hover:text-primary transition-colors">
                                        {service.title}
                                    </h2>

                                    <div className="p-muted mb-8 line-clamp-3 padauk-regular text-[15px] leading-relaxed opacity-80"
                                        dangerouslySetInnerHTML={{ __html: service.content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...' }}
                                    />

                                    <div className="mt-auto w-full">
                                        <Link to={`/services/${service._id}`} className="w-full block">
                                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-7 text-base lg:text-lg rounded-2xl transition-all duration-500 shadow-md hover:shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98]">
                                                {t("services.applyBtn") || "လျှောက်ထားရန်"}
                                                <ArrowRight size={20} className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
