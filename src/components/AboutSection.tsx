import { Shield, Flag } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AboutSection() {
    const { t } = useTranslation();
    return (
        <section id="about-us" className="bg-slate-50 py-24 md:py-32 relative overflow-hidden scroll-mt-24">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column: Authoritative Text Content */}
                    <div className="relative z-10 animate-in fade-in slide-in-from-left duration-1000">
                        <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.3em] mb-6">
                            <span className="w-12 h-[2px] bg-primary/40"></span>
                            {t("about.pslf")}
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-8 padauk-bold leading-[1.6]">
                            {t("about.title")}
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-12 text-lg md:text-xl padauk-regular max-w-2xl border-l-4 border-primary/10 pl-6">
                            {t("about.description")}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                            {/* Policy Card */}
                            <div className="group relative p-8 rounded-[2rem] bg-white border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <Shield size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 padauk-bold">{t("about.policyTitle")}</h3>
                                <p className="text-slate-500 padauk-regular leading-relaxed text-sm">{t("about.policyDesc")}</p>
                            </div>

                            {/* Objectives Card */}
                            <div className="group relative p-8 rounded-[2rem] bg-white border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <Flag size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 padauk-bold">{t("about.objectiveTitle")}</h3>
                                <p className="text-slate-500 padauk-regular leading-relaxed text-sm">{t("about.objectiveDesc")}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Premium Visual Expression */}
                    <div className="relative animate-in fade-in slide-in-from-right duration-1000 delay-200">
                        {/* Overlapping Primary Frame */}
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] border-[8px] border-white ring-1 ring-slate-100 aspect-[4/3] group">
                            <img
                                src="/images/about-dept.png"
                                alt="Department Building"
                                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                            />
                            {/* Decorative Overlay */}
                            <div className="absolute inset-0 bg-slate-900/10 mix-blend-overlay group-hover:bg-transparent transition-all duration-500"></div>
                        </div>

                        {/* Decorative Background Glimmers */}
                        <div className="absolute -top-16 -right-16 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                        <div className="absolute -bottom-16 -left-16 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

                        {/* Premium Info Badge */}
                        <div className="absolute -bottom-12 -right-10 z-20 bg-white p-10 rounded-[2.5rem] shadow-[0_45px_100px_-20px_rgba(0,0,0,0.25)] border border-slate-100 hidden md:block transform hover:-translate-y-2 transition-transform duration-500 cursor-default">
                            <div className="flex flex-col items-center">
                                <div className="text-primary font-black text-5xl mb-1 tracking-tighter">e-ID</div>
                                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.4em] text-center whitespace-nowrap">NATIONAL STANDARD</div>
                                <div className="mt-4 px-4 py-1.5 bg-primary/5 rounded-full text-primary font-bold text-[9px] uppercase tracking-widest border border-primary/10 self-stretch text-center">TRUSTED AUTHORITY</div>
                            </div>
                        </div>

                        {/* Framing Element (Physicality Effect) */}
                        <div className="absolute top-12 left-12 -right-12 -bottom-12 bg-slate-100 rounded-[3rem] -z-20 border border-slate-200 shadow-inner"></div>
                    </div>
                </div>
            </div>

            {/* Subtle Texture Decorative Accent */}
            <div className="absolute top-0 right-0 p-20 opacity-[0.03] select-none pointer-events-none group">
                <Shield size={300} className="text-primary rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
            </div>
        </section>
    );
}
