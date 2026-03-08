import { Link } from "react-router-dom";
import { IdCard, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { useTranslation } from "react-i18next";

export default function Services() {
    const { t } = useTranslation();
    return (
        <div className="page-container bg-background animate-in fade-in duration-500 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10"></div>

            <div className="container-custom section-padding">
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

                {/* Dual-Card Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* Card 1: Smartcard */}
                    <div className="bg-card rounded-2xl p-8 md:p-10 border border-border hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center group transform hover:-translate-y-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-150"></div>

                        <div className="w-24 h-24 rounded-3xl bg-secondary text-primary border border-border flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm relative z-10">
                            <IdCard size={48} strokeWidth={1.5} />
                        </div>

                        <h2 className="h4 mb-4 relative z-10">
                            {t("services.smartcardTitle")}
                        </h2>

                        <p className="p-muted mb-8 max-w-sm relative z-10">
                            {t("services.smartcardDesc")}
                        </p>

                        <div className="flex flex-col gap-4 w-full mb-10 text-left px-2 sm:px-6 relative z-10">
                            <div className="flex items-center gap-3 p-small text-muted-foreground bg-muted/50 p-3 rounded-xl border border-border">
                                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                                <span>{t("services.smartcardFeature1")}</span>
                            </div>
                            <div className="flex items-center gap-3 p-small text-muted-foreground bg-muted/50 p-3 rounded-xl border border-border">
                                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                                <span>{t("services.smartcardFeature2")}</span>
                            </div>
                        </div>

                        <div className="mt-auto w-full relative z-10">
                            <Link to="/services/smartcard/apply" className="w-full block">
                                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-7 text-base lg:text-lg rounded-xl transition-all duration-500 shadow-md hover:shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98]">
                                    {t("services.applyBtn")}
                                    <ArrowRight size={20} className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Card 2: Household Registration */}
                    <div className="bg-card rounded-2xl p-8 md:p-10 border border-border hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center group transform hover:-translate-y-2 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-br-[100px] -z-10 transition-transform duration-500 group-hover:scale-150"></div>

                        <div className="w-24 h-24 rounded-3xl bg-secondary text-primary border border-border flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm relative z-10">
                            <BookOpen size={48} strokeWidth={1.5} />
                        </div>

                        <h2 className="h4 mb-4 relative z-10">
                            {t("services.householdTitle")}
                        </h2>

                        <p className="p-muted mb-8 max-w-sm relative z-10">
                            {t("services.householdDesc")}
                        </p>

                        <div className="flex flex-col gap-4 w-full mb-10 text-left px-2 sm:px-6 relative z-10">
                            <div className="flex items-center gap-3 p-small text-muted-foreground bg-muted/50 p-3 rounded-xl border border-border">
                                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                                <span>{t("services.householdFeature1")}</span>
                            </div>
                            <div className="flex items-center gap-3 p-small text-muted-foreground bg-muted/50 p-3 rounded-xl border border-border">
                                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                                <span>{t("services.householdFeature2")}</span>
                            </div>
                        </div>

                        <div className="mt-auto w-full relative z-10">
                            <Link to="/services/household/apply" className="w-full block">
                                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-7 text-base lg:text-lg rounded-xl transition-all duration-500 shadow-md hover:shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98]">
                                    {t("services.applyBtn")}
                                    <ArrowRight size={20} className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
