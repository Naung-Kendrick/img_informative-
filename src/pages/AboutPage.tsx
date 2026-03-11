import { Flag, Landmark, Building2, ClipboardList, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetAboutContentQuery } from "../store/aboutApiSlice";
import { Skeleton } from "../components/ui/skeleton";

export default function AboutPage() {
    const { t } = useTranslation();
    const { data, isLoading } = useGetAboutContentQuery({});

    const about = data?.about || {};

    if (isLoading) {
        return (
            <div className="container-custom section-padding pt-24 animate-in fade-in duration-500 min-h-[60vh]">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <Skeleton className="h-6 w-32 mx-auto mb-6 rounded-full" />
                    <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                </div>
                <div className="max-w-4xl mx-auto flex flex-col items-center gap-16">
                    <Skeleton className="h-[300px] md:h-[500px] w-full max-w-3xl rounded-[3rem]" />
                    <div className="space-y-6 w-full max-w-2xl text-center">
                        <Skeleton className="h-4 w-32 mx-auto rounded-full" />
                        <Skeleton className="h-16 w-full rounded-xl" />
                        <Skeleton className="h-24 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container bg-white animate-in fade-in duration-700">
            {/* ── SIMPLE CLEAN HEADER ────────────────────────────────────────── */}
            <div className="bg-slate-50 border-b border-slate-100 py-12 md:py-16">
                <div className="container-custom text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/20 shadow-sm">
                        <Building2 size={14} />
                        {t("about.badge") || "ADMINISTRATIVE BODY"}
                    </div>
                    <h1 className="h1 text-slate-900 mb-4 font-heading">
                        {about.title || t("about.title")}
                    </h1>
                    <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6" />
                    <p className="p-lead max-w-2xl mx-auto text-slate-600 font-sans leading-[1.8]">
                        {t("about.subtitle")}
                    </p>
                </div>
            </div>

            {/* ── MAIN CONTENT (STORY) ────────────────────────────────────────── */}
            <div className="container-custom py-16 md:py-20">
                <div className="max-w-5xl mx-auto flex flex-col gap-16 md:gap-24 items-center">

                    {/* Image Section - Premium Redesign */}
                    <div className="relative w-full max-w-3xl animate-in fade-in zoom-in-95 duration-1000">
                        <div className="aspect-[16/9] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[#f8fafc] border-[12px] md:border-[20px] ring-1 ring-slate-200 bg-white">
                            <img
                                src={about.imageUrl || "/images/about-dept.png"}
                                alt="Department Image"
                                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                            />
                        </div>

                        {/* Floating Glass Accents */}
                        <div className="absolute -z-10 -bottom-10 -right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-60" />
                        <div className="absolute -z-10 -top-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-60" />
                    </div>

                    {/* Text Section - Centered Elegance */}
                    <div className="space-y-8 text-center max-w-4xl px-4">
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-20 h-1 bg-primary/20 rounded-full" />
                            <span className="text-primary font-bold text-xs md:text-sm uppercase tracking-[0.5em] leading-none">
                                {t("about.pslf") || "OUR FOUNDATION"}
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] padauk-bold tracking-tight">
                            {about.title || t("about.title")}
                        </h2>

                        <div className="w-full max-w-2xl mx-auto pt-4">
                            <p className="text-xl md:text-2xl text-slate-600 padauk-regular leading-[1.8] whitespace-pre-wrap font-sans">
                                {about.description || t("about.description")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── POLICY & OBJECTIVES (SIMPLE CARDS) ─────────────────────────── */}
            <div className="bg-slate-50 py-16 md:py-20 border-t border-slate-100">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Policy Card */}
                        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-start gap-6 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                <Landmark size={30} strokeWidth={1.5} />
                            </div>
                            <h3 className="h3 font-heading text-slate-900">{t("about.policyTitle")}</h3>
                            <p className="p-default text-slate-600 padauk-regular leading-relaxed whitespace-pre-wrap">
                                {about.policy || t("about.policyDesc")}
                            </p>
                        </div>

                        {/* Objectives Card */}
                        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-start gap-6 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                <Flag size={30} strokeWidth={1.5} />
                            </div>
                            <h3 className="h3 font-heading text-slate-900">{t("about.objectiveTitle")}</h3>
                            <p className="p-default text-slate-600 padauk-regular leading-relaxed whitespace-pre-wrap">
                                {about.objective || t("about.objectiveDesc")}
                            </p>
                        </div>

                        {/* Responsibilities Card */}
                        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-start gap-6 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                <ClipboardList size={30} strokeWidth={1.5} />
                            </div>
                            <h3 className="h3 font-heading text-slate-900">{t("about.responsibilitiesTitle")}</h3>
                            <p className="p-default text-slate-600 padauk-regular leading-relaxed whitespace-pre-wrap">
                                {about.duty || t("about.responsibilitiesDesc")}
                            </p>
                        </div>

                        {/* Main Tasks Card */}
                        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-start gap-6 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                <ShieldCheck size={30} strokeWidth={1.5} />
                            </div>
                            <h3 className="h3 font-heading text-slate-900">{t("about.mainTasksTitle")}</h3>
                            <p className="p-default text-slate-600 padauk-regular leading-relaxed whitespace-pre-wrap text-left w-full">
                                {about.mainTasks || t("about.mainTasksDesc")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
