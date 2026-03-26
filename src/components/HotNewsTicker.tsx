import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { useGetAllNewsQuery } from "../store/newsApiSlice";

export default function HotNewsTicker() {
    const { data: allNews = [] } = useGetAllNewsQuery();

    // Filter for Published news under the "HotNews" category
    const breakingNews = allNews
        .filter((news) => news.status === "Published" && news.category === "HotNews")
        .map((news) => ({
            _id: news._id,
            title: news.title
        }));

    if (breakingNews.length === 0) {
        return null; // Do not render the ticker if there are no hot news items
    }

    return (
        <div className="w-full bg-white border-b border-slate-200 flex items-center overflow-hidden h-10 sm:h-12 relative z-30 card-shadow">
            {/* Action Label: Institutional Ticker */}
            <div className="bg-primary text-white font-bold px-4 sm:px-8 h-full flex items-center justify-center shrink-0 z-10 shadow-[4px_0_15px_rgba(0,0,0,0.1)] gap-1.5 sm:gap-2 uppercase tracking-[0.1em] sm:tracking-[0.15em] text-[10px] sm:text-[11px]">
                <Zap size={12} fill="currentColor" strokeWidth={0} className="text-white/80 sm:hidden" />
                <Zap size={14} fill="currentColor" strokeWidth={0} className="text-white/80 hidden sm:block" />
                <span>Breaking</span>
            </div>

            {/* Content Flux */}
            <div className="flex-1 overflow-hidden relative h-full flex items-center bg-slate-50/50">
                <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] w-max items-center h-full group">

                    {/* Primary Channel */}
                    <div className="flex items-center h-full shrink-0">
                        {breakingNews.map((news, idx) => (
                            <div key={`news-1-${news._id}-${idx}`} className="flex items-center mx-10">
                                <span className="w-1.5 h-1.5 rotate-45 bg-primary/40 mr-4"></span>
                                <Link to={`/news/${news._id}`} className="text-[11px] sm:text-[13px] font-bold text-slate-700 hover:text-primary transition-colors tracking-tight uppercase cursor-pointer">
                                    {news.title}
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Buffer Channel for Loop */}
                    <div className="flex items-center h-full shrink-0">
                        {breakingNews.map((news, idx) => (
                            <div key={`news-2-${news._id}-${idx}`} className="flex items-center mx-10">
                                <span className="w-1.5 h-1.5 rotate-45 bg-primary/40 mr-4"></span>
                                <Link to={`/news/${news._id}`} className="text-[11px] sm:text-[13px] font-bold text-slate-700 hover:text-primary transition-colors tracking-tight uppercase cursor-pointer">
                                    {news.title}
                                </Link>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}

