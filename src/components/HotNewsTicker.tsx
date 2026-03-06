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
        <div className="w-full bg-slate-50 border-b border-slate-200 flex items-center overflow-hidden h-10 sm:h-12 relative z-30">
            {/* Static Label */}
            <div className="bg-primary text-white font-bold px-3 sm:px-6 h-full flex items-center justify-center shrink-0 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.15)] padauk-bold text-xs sm:text-[15px] whitespace-nowrap gap-1.5 uppercase tracking-wide">
                <Zap size={16} fill="currentColor" strokeWidth={0} className="hidden sm:block animate-pulse text-slate-300" />
                အထူးသတင်း
            </div>

            {/* Scrolling Track */}
            <div className="flex-1 overflow-hidden relative h-full flex items-center">
                {/* We need an exact duplicate of the content so it loops seamlessly. 
            Using CSS animation to translate it from 0 to -50% width. */}
                <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] w-max items-center h-full group">

                    {/* First set of items */}
                    <div className="flex items-center h-full shrink-0">
                        {breakingNews.map((news, idx) => (
                            <div key={`news-1-${news._id}-${idx}`} className="flex items-center mx-4 sm:mx-8">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary mr-3 sm:mr-4 opacity-80 group-hover:opacity-100 transition-opacity"></span>
                                <Link to={`/news/${news._id}`} className="text-[13px] sm:text-[15px] font-medium text-slate-700 hover:text-primary transition-colors padauk-regular cursor-pointer">
                                    {news.title}
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Duplicate set for seamless looping */}
                    <div className="flex items-center h-full shrink-0">
                        {breakingNews.map((news, idx) => (
                            <div key={`news-2-${news._id}-${idx}`} className="flex items-center mx-4 sm:mx-8">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary mr-3 sm:mr-4 opacity-80 group-hover:opacity-100 transition-opacity"></span>
                                <Link to={`/news/${news._id}`} className="text-[13px] sm:text-[15px] font-medium text-slate-700 hover:text-primary transition-colors padauk-regular cursor-pointer">
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

