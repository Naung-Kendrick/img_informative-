import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useGetAllStatisticsQuery } from "../store/statisticApiSlice";
import { Users, Home, CreditCard, Activity, Briefcase, MapPin, Map, Database, Globe, UserCheck, ShieldCheck, Heart } from "lucide-react";

// Helper map for dynamic lucide icons
const IconMap: Record<string, React.ElementType> = {
    Users,
    Home,
    CreditCard,
    Activity,
    Briefcase,
    MapPin,
    Map,
    Database,
    Globe,
    UserCheck,
    ShieldCheck,
    Heart
};

// Custom CountUp Component
const CountUp = ({ end, duration = 2000 }: { end: number, duration?: number }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (countRef.current) observer.observe(countRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Ease out expo function
            const easeOutProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setCount(Math.floor(easeOutProgress * end));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setCount(end); // Ensure we end accurately
            }
        };

        window.requestAnimationFrame(step);
    }, [end, duration, isVisible]);

    return (
        <div ref={countRef}>
            {count.toLocaleString('en-US')}
        </div>
    );
};

export default function StatisticsSection() {
    const { i18n } = useTranslation();
    const { data: statistics, isLoading } = useGetAllStatisticsQuery();

    if (isLoading || !statistics || statistics.length === 0) {
        return null; // Return nothing if there are no stats or it is loading.
    }

    const currentLang = i18n.language || "mm";

    return (
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-y border-slate-800 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
                {/* Decorative map/grid pattern overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            </div>

            <div className="container-custom relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">
                        {currentLang === 'en' ? 'Our Reach' : 'ကျွန်ုပ်တို့၏ လက်လှမ်းမီမှု'}
                    </h2>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white padauk-bold mb-6">
                        {currentLang === 'en' ? 'Ta\'ang Land Population & Registration Statistics' : 'တအာင်းပြည်နယ် လူဦးရေ နှင့် မှတ်ပုံတင် စာရင်း'}
                    </h1>
                    <div className="w-24 h-1 bg-primary/50 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {statistics.map((stat, idx) => {
                        const IconElement = IconMap[stat.icon] || Activity;
                        const title = currentLang === 'en' ? stat.title_en : stat.title_mm;

                        return (
                            <div key={stat._id} className="relative group perspective-1000">
                                {/* Hover Light effect */}
                                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl -z-10"></div>

                                <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl flex flex-col items-center text-center transform transition-transform duration-500 hover:-translate-y-2 group-hover:border-primary/30 h-full shadow-2xl">
                                    <div className="w-20 h-20 rounded-2xl bg-slate-900/80 border border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner group-hover:shadow-primary/20">
                                        <IconElement size={40} className="text-primary" />
                                    </div>

                                    <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight font-sans drop-shadow-md">
                                        <CountUp end={stat.value} duration={2500 + (idx * 500)} />
                                    </div>

                                    {(currentLang === 'en' ? stat.date_en : stat.date_mm) && (
                                        <div className="text-[10px] font-bold text-primary/80 uppercase tracking-widest mb-4 bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                                            {currentLang === 'en' ? stat.date_en : stat.date_mm}
                                        </div>
                                    )}

                                    <h3 className="text-lg font-bold text-slate-300 padauk-bold mt-auto leading-relaxed group-hover:text-white transition-colors">
                                        {title}
                                    </h3>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
