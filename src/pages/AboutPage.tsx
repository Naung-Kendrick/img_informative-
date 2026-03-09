import { Flag, Landmark, Building2, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetAboutContentQuery } from "../store/aboutApiSlice";
import { Skeleton } from "../components/ui/skeleton";

export default function AboutPage() {
    const { t } = useTranslation();
    const { data, isLoading } = useGetAboutContentQuery({});

    const about = data?.about || {};

    if (isLoading) {
        return (
            <div className="container-custom section-padding animate-in fade-in duration-500">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <Skeleton className="h-6 w-32 mx-auto mb-6 rounded-full" />
                    <Skeleton className="h-12 w-full mb-4" />
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <Skeleton className="h-80 w-full rounded-2xl" />
                    <Skeleton className="h-80 w-full rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="page-container bg-white animate-in fade-in duration-700">
            {/* ── SIMPLE CLEAN HEADER ────────────────────────────────────────── */}
            <div className="bg-slate-50 border-b border-slate-100 py-16 md:py-24">
                <div className="container-custom text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/20">
                        <Building2 size={14} />
                        {t("about.badge") || "ADMINISTRATIVE BODY"}
                    </div>
                    <h1 className="h1 text-slate-900 mb-6 font-heading">
                        {t("about.title")}
                    </h1>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-8" />
                    <p className="p-lead max-w-2xl mx-auto text-slate-600 font-sans leading-[1.8]">
                        {t("about.subtitle")}
                    </p>
                </div>
            </div>

            {/* ── MAIN CONTENT (STORY) ────────────────────────────────────────── */}
            <div className="container-custom py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Text Section */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-3 text-primary font-bold text-sm uppercase tracking-[0.3em]">
                            <span className="w-12 h-0.5 bg-primary/30" />
                            {t("about.pslf") || "OUR FOUNDATION"}
                        </div>
                        <h2 className="h2 text-slate-900 leading-tight">
                            Committed to Providing Secure and Official Identifications.
                        </h2>
                        <div className="prose prose-slate max-w-none">
                            <p className="p-default text-lg text-slate-600 padauk-regular leading-relaxed">
                                {t("about.description")}
                            </p>
                        </div>

                        {/* Quick Highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            {[
                                "Verified Digital Standards",
                                "Citizen-First Services",
                                "Data Security & Privacy",
                                "Official Documentation"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-slate-700 font-medium font-sans">
                                    <CheckCircle2 size={18} className="text-primary" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="relative">
                        <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white ring-1 ring-slate-200">
                            <img
                                src={about.imageUrl || "/images/about-dept.png"}
                                alt="Department Image"
                                className="w-full h-full object-cover"
                            />
                        </div>

                    </div>
                </div>
            </div>

            {/* ── POLICY & OBJECTIVES (SIMPLE CARDS) ─────────────────────────── */}
            <div className="bg-slate-50 py-20 border-t border-slate-100">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Policy Card */}
                        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-start gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                <Landmark size={30} strokeWidth={1.5} />
                            </div>
                            <h3 className="h3 font-heading text-slate-900">{t("about.policyTitle")}</h3>
                            <p className="p-default text-slate-600 padauk-regular">
                                {t("about.policyDesc")}
                            </p>
                        </div>

                        {/* Objectives Card */}
                        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-start gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                <Flag size={30} strokeWidth={1.5} />
                            </div>
                            <h3 className="h3 font-heading text-slate-900">{t("about.objectiveTitle")}</h3>
                            <p className="p-default text-slate-600 padauk-regular">
                                {t("about.objectiveDesc")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
