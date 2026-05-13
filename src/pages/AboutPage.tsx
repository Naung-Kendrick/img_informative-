import { Flag, Landmark, Building2, ClipboardList, ShieldCheck, Users, Globe, Award, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetAboutContentQuery } from "../store/aboutApiSlice";
import { Skeleton } from "../components/ui/skeleton";
import NetworkErrorState from "../components/ui/NetworkErrorState";
import SEO from "../components/SEO";

export default function AboutPage() {
    const { t } = useTranslation();
    const { data, isLoading, isError } = useGetAboutContentQuery({});

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

    if (isError) {
        return (
            <div className="container-custom pt-24 min-h-[60vh] flex items-center justify-center">
                <NetworkErrorState />
            </div>
        );
    }

    return (
        <>
            <SEO
                pathname="/about"
                title="About Us"
                description="Learn about Ta'ang Land Immigration Department - our mission, policies, objectives, and official standards."
            />
            <div className="page-container bg-white animate-in fade-in duration-700">
                {/* ── HERO SECTION WITH SPLIT LAYOUT ─────────────────────────────── */}
                <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-primary/20 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

                    <div className="container-custom relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 md:py-24 lg:py-32">
                            {/* Left Content */}
                            <div className="order-2 lg:order-1 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-xs font-bold uppercase tracking-widest mb-6 border border-white/20">
                                    <Building2 size={14} />
                                    Official Government Portal
                                </div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                                    {t("about.title") || "Immigration Department"}
                                </h1>
                                <div className="w-24 h-1 bg-primary mx-auto lg:mx-0 rounded-full mb-6" />
                                <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                                    {t("about.subtitle") || "Committed to transparent, efficient, and secure immigration services for all residents and visitors of Ta'ang Land."}
                                </p>

                                {/* Quick Stats */}
                                <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-10">
                                    <div className="flex items-center gap-3 text-white/90">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                            <Users size={24} />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-2xl font-bold">87K+</div>
                                            <div className="text-xs text-white/60 uppercase tracking-wider">Population Served</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/90">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                            <Globe size={24} />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-2xl font-bold">3</div>
                                            <div className="text-xs text-white/60 uppercase tracking-wider">Regional Offices</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Image */}
                            <div className="order-1 lg:order-2 relative">
                                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/30 border-4 border-white/10">
                                    <img
                                        loading="lazy"
                                        src={about.imageUrl || "/images/about-dept.png"}
                                        alt="Ta'ang Land Immigration Department"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                                </div>
                                {/* Floating Badge */}
                                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Award size={24} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">Official</div>
                                            <div className="text-xs text-slate-500">Government Entity</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
                        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
                        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
                            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
                        </div>
                    </div>
                </div>

                {/* ── MISSION & VISION ─────────────────────────────────────────── */}
                <div className="py-20 md:py-28 bg-white relative">
                    <div className="container-custom">
                        <div className="max-w-4xl mx-auto text-center mb-16">
                            <span className="text-primary font-bold text-xs uppercase tracking-[0.4em] mb-4 block">
                                Our Foundation
                            </span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-6">
                                Mission & Vision
                            </h2>
                            <div className="w-20 h-1 bg-primary/20 mx-auto rounded-full" />
                        </div>

                        <div className="relative bg-slate-50 rounded-[2.5rem] p-8 md:p-12 lg:p-16 border border-slate-100">
                            {/* Decorative Elements */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg border border-slate-100">
                                <span className="text-xs font-bold text-primary uppercase tracking-widest">About Us</span>
                            </div>

                            <div className="prose prose-lg max-w-none">
                                <div className="text-slate-600 padauk-regular leading-[2] text-justify text-base md:text-lg whitespace-pre-wrap">
                                    {about.description || t("about.description") || "The Immigration Department of Ta'ang Land Government is dedicated to providing efficient and transparent immigration services. We manage passport issuance, visa processing, citizenship registration, and border control to ensure the security and prosperity of our nation."}
                                </div>
                            </div>

                            {/* Quote */}
                            <div className="mt-10 md:mt-12 pl-6 md:pl-8 border-l-4 border-primary">
                                <p className="text-xl md:text-2xl font-bold text-slate-900 italic leading-relaxed">
                                    "Serving the people with integrity, transparency, and dedication."
                                </p>
                                <p className="mt-3 text-sm font-bold text-slate-500 uppercase tracking-wider">
                                    — Immigration Department, Ta'ang Land Government
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── CORE VALUES / INFO CARDS ───────────────────────────────────── */}
                <div className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
                    <div className="container-custom">
                        <div className="text-center mb-16">
                            <span className="text-primary font-bold text-xs uppercase tracking-[0.4em] mb-4 block">
                Core Pillars
                            </span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-6">
                Policy & Objectives
                            </h2>
                            <p className="text-slate-500 max-w-2xl mx-auto">
                Our guiding principles and strategic goals for serving the nation
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Policy Card */}
                            <div className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <Landmark size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Policy</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {about.policy || t("about.policyDesc") || "Upholding immigration laws with fairness and transparency to maintain national security."}
                                </p>
                                <div className="mt-6 flex items-center gap-2 text-primary text-sm font-bold group-hover:gap-4 transition-all duration-300">
                                    Learn More <ChevronRight size={16} />
                                </div>
                            </div>

                            {/* Objectives Card */}
                            <div className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <Flag size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Objectives</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {about.objective || t("about.objectiveDesc") || "Streamlining immigration processes while ensuring thorough vetting and compliance."}
                                </p>
                                <div className="mt-6 flex items-center gap-2 text-primary text-sm font-bold group-hover:gap-4 transition-all duration-300">
                                    Learn More <ChevronRight size={16} />
                                </div>
                            </div>

                            {/* Responsibilities Card */}
                            <div className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <ClipboardList size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Responsibilities</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {about.duty || t("about.responsibilitiesDesc") || "Managing border control, passport issuance, visa processing, and citizen registration."}
                                </p>
                                <div className="mt-6 flex items-center gap-2 text-primary text-sm font-bold group-hover:gap-4 transition-all duration-300">
                                    Learn More <ChevronRight size={16} />
                                </div>
                            </div>

                            {/* Main Tasks Card */}
                            <div className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <ShieldCheck size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Main Tasks</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {about.mainTasks || t("about.mainTasksDesc") || "Ensuring secure borders, efficient service delivery, and protection of citizens' rights."}
                                </p>
                                <div className="mt-6 flex items-center gap-2 text-primary text-sm font-bold group-hover:gap-4 transition-all duration-300">
                                    Learn More <ChevronRight size={16} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── OFFICIAL UNIFORMS SECTION ────────────────────────────────────── */}
                <div className="py-20 md:py-28 bg-slate-900 relative overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />

                    <div className="container-custom relative z-10">
                        <div className="text-center mb-16">
                            <span className="text-primary font-bold text-xs uppercase tracking-[0.4em] mb-4 block">
                                Official Standards
                            </span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
                                Department Uniforms
                            </h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                {about.uniformDescription || "Standard-issue uniforms representing professionalism, authority, and dedication to public service."}
                            </p>
                        </div>

                        {/* Uniform Grid */}
                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {/* Uniform 1 */}
                            <div className="group relative">
                                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-slate-800 border border-slate-700">
                                    <img
                                        loading="lazy"
                                        src={about.uniform1Image || "/images/uniform-01.jpg"}
                                        alt={about.uniform1Name || "Field Service Uniform TI-0010"}
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

                                    {/* Overlay Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm text-primary text-xs font-bold uppercase tracking-wider mb-3 border border-primary/30">
                                            Type A
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                            {about.uniform1Name || "Field Service Uniform"}
                                        </h3>
                                        <p className="text-sm text-slate-300">TI-0010 • Standard Issue</p>
                                    </div>
                                </div>
                            </div>

                            {/* Uniform 2 */}
                            <div className="group relative">
                                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-slate-800 border border-slate-700">
                                    <img
                                        loading="lazy"
                                        src={about.uniform2Image || "/images/uniform-02.jpg"}
                                        alt={about.uniform2Name || "Field Service Uniform TI-0099"}
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

                                    {/* Overlay Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm text-primary text-xs font-bold uppercase tracking-wider mb-3 border border-primary/30">
                                            Type B
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                            {about.uniform2Name || "Field Service Uniform"}
                                        </h3>
                                        <p className="text-sm text-slate-300">TI-0099 • Standard Issue</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Note */}
                        <div className="text-center mt-12">
                            <p className="text-slate-500 text-sm">
                                Immigration Department • Ta'ang Land Government • Official Personnel Standards
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── CTA SECTION ─────────────────────────────────────────────────── */}
                <div className="py-16 md:py-20 bg-gradient-to-r from-primary/5 via-white to-primary/5 border-t border-slate-100">
                    <div className="container-custom">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                                Need Immigration Services?
                            </h2>
                            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                                Visit one of our regional offices or apply online for passport, visa, and citizenship services.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="/services"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                >
                                    View Services
                                    <ChevronRight size={20} />
                                </a>
                                <a
                                    href="/districts"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border-2 border-slate-200 hover:border-primary hover:text-primary transition-colors"
                                >
                                    Find Offices
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
