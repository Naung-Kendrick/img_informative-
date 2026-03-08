import { Shield, Flag, Target } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetAboutContentQuery } from "../store/aboutApiSlice";
import { Skeleton } from "../components/ui/skeleton";

export default function AboutPage() {
    const { t } = useTranslation();
    const { data, isLoading } = useGetAboutContentQuery({});

    const about = data?.about || {};

    if (isLoading) {
        return (
            <div className="page-container bg-background animate-in fade-in duration-500 relative overflow-hidden">
                <div className="container-custom section-padding">
                    <div className="mb-16 text-center max-w-2xl mx-auto flex flex-col items-center">
                        <Skeleton className="h-6 w-32 mb-6 rounded-full" />
                        <Skeleton className="h-10 w-3/4 mb-6" />
                        <Skeleton className="h-4 w-1/2 mt-6" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="space-y-6">
                            <Skeleton className="h-24 w-full" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                                <Skeleton className="h-40 w-full rounded-2xl" />
                                <Skeleton className="h-40 w-full rounded-2xl" />
                            </div>
                        </div>
                        <Skeleton className="w-full aspect-[4/3] rounded-[3rem]" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container bg-background animate-in fade-in duration-500 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>

            <div className="container-custom section-padding">
                {/* Page Header */}
                <div className="mb-16 text-center max-w-2xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/20">
                        <Shield size={14} />
                        {t("about.badge")}
                    </div>
                    <h1 className="h1 mb-8 relative inline-block pb-4">
                        {about.title || t("about.title")}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-primary/30 rounded-full"></div>
                    </h1>
                    <p className="p-lead mt-6">
                        {t("about.subtitle")}
                    </p>
                </div>

                {/* Content Section (2-Column Premium Layout) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Column: Authoritative Text Content */}
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.3em] mb-6">
                            <span className="w-12 h-[2px] bg-primary/40"></span>
                            {t("about.pslf")}
                        </div>

                        <p className="text-slate-600 leading-relaxed mb-12 text-lg md:text-xl padauk-regular max-w-2xl">
                            {about.description || t("about.description")}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                            {/* Policy Card */}
                            <div className="group relative p-8 rounded-[2rem] bg-card border border-border shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <Shield size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className="h4 mb-3">{t("about.policyTitle")}</h3>
                                <p className="text-slate-500 padauk-regular leading-relaxed text-sm">
                                    {about.policy || t("about.policyDesc")}
                                </p>
                            </div>

                            {/* Objectives Card */}
                            <div className="group relative p-8 rounded-[2rem] bg-card border border-border shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <Flag size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className="h4 mb-3">{t("about.objectiveTitle")}</h3>
                                <p className="text-slate-500 padauk-regular leading-relaxed text-sm">
                                    {about.objective || t("about.objectiveDesc")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Premium Visual Expression */}
                    <div className="relative">
                        {/* Overlapping Primary Frame */}
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_30px_100px_-20px_rgba(30,58,138,0.2)] border-[8px] border-white ring-1 ring-slate-100 aspect-[4/3] group bg-secondary">
                            <img
                                src={about.imageUrl || "/images/about-dept.png"}
                                alt="Department Building"
                                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                            />
                            {/* Decorative Overlay */}
                            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay group-hover:bg-transparent transition-all duration-500"></div>
                        </div>

                        {/* Premium Info Badge */}
                        <div className="absolute -bottom-12 -right-10 z-20 bg-white p-10 rounded-[2.5rem] shadow-[0_45px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 hidden md:block transform hover:-translate-y-2 transition-transform duration-500 cursor-default">
                            <div className="flex flex-col items-center">
                                <div className="text-primary font-black text-5xl mb-1 tracking-tighter">e-ID</div>
                                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.4em] text-center whitespace-nowrap">NATIONAL STANDARD</div>
                                <div className="mt-4 px-4 py-1.5 bg-primary/5 rounded-full text-primary font-bold text-[9px] uppercase tracking-widest border border-primary/10 self-stretch text-center">TRUSTED AUTHORITY</div>
                            </div>
                        </div>

                        {/* Framing Element (Physicality Effect) */}
                        <div className="absolute top-12 left-12 -right-12 -bottom-12 bg-slate-50 rounded-[3rem] -z-20 border border-slate-200"></div>
                    </div>
                </div>

                {/* Subtle Texture Decorative Accent */}
                <div className="absolute top-10 right-10 opacity-[0.02] select-none pointer-events-none group -z-20">
                    <Target size={300} className="text-primary rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                </div>
            </div>
        </div>
    );
}
