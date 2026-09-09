import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useGetAllNewsQuery } from "../../store/newsApiSlice";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertCircle, Loader2, TrendingUp, BarChart2, Heart, Award, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function ReportsManagement() {
    const { user } = useSelector((state: RootState) => state.auth);
    const { data: news, isLoading, isError } = useGetAllNewsQuery();

    const stats = useMemo(() => {
        if (!news) return null;

        // 1. Calculate Monthly Data (Jan - Dec)
        const currentYear = new Date().getFullYear();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyCounts = new Array(12).fill(0);

        news.forEach((item) => {
            const date = new Date(item.createdAt);
            if (date.getFullYear() === currentYear) {
                monthlyCounts[date.getMonth()] += 1;
            }
        });

        const monthlyData = monthNames.map((month, idx) => ({
            name: month,
            News: monthlyCounts[idx]
        }));

        // 2. Calculate Top 5 Liked News
        const topLiked = [...news]
            .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
            .slice(0, 5);

        // 3. Calculate Top 5 Viewed News
        const topViews = [...news]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5);

        return { monthlyData, topLiked, topViews, currentYear };
    }, [news]);

    if (!user || user.role === 0) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white padauk-bold flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <BarChart2 size={20} />
                        </div>
                        <span>အစီရင်ခံစာများ (Reports Overview)</span>
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1 padauk-regular">
                        သတင်းနှင့် လှုပ်ရှားမှုများ၏ အချက်အလက်များနှင့် အများဆုံးနှစ်သက်မှုရရှိသော သတင်းများကို လေ့လာပါ။
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-16"><Loader2 size={40} className="animate-spin text-blue-500" /></div>
            ) : isError ? (
                <div className="text-red-400 font-semibold text-center p-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col items-center gap-4">
                    <AlertCircle size={32} />
                    <span>အချက်အလက်များ ရယူရာတွင် ချို့ယွင်းချက်ဖြစ်ပေါ်နေပါသည်။</span>
                </div>
            ) : !stats ? null : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column: Monthly Chart */}
                    <div className="bg-[#0e1627] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
                            <div className="p-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white padauk-bold">
                                    လအလိုက် သတင်းတင်မှုများ
                                </h3>
                                <p className="text-xs text-slate-400 font-semibold">{stats.currentYear} ခုနှစ် အခြေအနေ</p>
                            </div>
                        </div>

                        <div className="h-[340px] w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                    />
                                    <Bar dataKey="News" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={28} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Right Column: Top Liked News */}
                    <div className="bg-[#0e1627] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
                            <div className="p-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl">
                                <Award size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white padauk-bold">
                                    အများဆုံးနှစ်သက်မှုရရှိသော သတင်း (Top 5)
                                </h3>
                                <p className="text-xs text-slate-400 font-semibold">အချိန်တိုင်းအတွက်</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {stats.topLiked.length === 0 ? (
                                <div className="text-center p-8 text-slate-500">သတင်းမှတ်တမ်း မရှိသေးပါ</div>
                            ) : (
                                stats.topLiked.map((item: any, index: number) => (
                                    <div
                                        key={item._id}
                                        className="flex items-start gap-3.5 p-3.5 rounded-xl hover:bg-slate-800/40 border border-slate-800/60 transition-all group"
                                    >
                                        <div className="shrink-0 w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-2 padauk-bold group-hover:text-blue-400 transition-colors leading-relaxed">
                                                {item.title}
                                            </h4>
                                            <div className="flex items-center gap-2.5 mt-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                                <span className="flex items-center gap-1 text-rose-400">
                                                    <Heart size={12} className="fill-rose-500/20" />
                                                    {item.likes?.length || 0} Likes
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                <span className="truncate text-slate-400">{item.category}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center gap-1.5 shrink-0">
                                            {item.images && item.images[0] && (
                                                <img loading="lazy"
                                                    src={item.images[0]}
                                                    alt=""
                                                    className="w-12 h-12 rounded-lg object-cover shadow-2xs border border-slate-700"
                                                />
                                            )}
                                            <Link
                                                to={`/admin/news/interactions/${item._id}`}
                                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md text-[10px] font-bold uppercase transition-colors border border-slate-700/80"
                                            >
                                                Details
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Top Viewed News */}
                    <div className="bg-[#0e1627] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-sm lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
                            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
                                <Eye size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white padauk-bold">
                                    ဝင်ရောက်ကြည့်ရှုမှုအများဆုံး သတင်း (Top 5 Views)
                                </h3>
                                <p className="text-xs text-slate-400 font-semibold">အချိန်တိုင်းအတွက် စုစုပေါင်း ကြည့်ရှုမှု</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {stats.topViews.length === 0 ? (
                                <div className="col-span-full text-center p-8 text-slate-500">ကြည့်ရှုမှုမှတ်တမ်း မရှိသေးပါ</div>
                            ) : (
                                stats.topViews.map((item: any, index: number) => (
                                    <div
                                        key={item._id}
                                        className="relative flex flex-col p-5 bg-[#0a101d] rounded-2xl border border-slate-800 hover:border-indigo-500/40 hover:bg-[#10182b] transition-all group overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4">
                                            <span className="flex items-center gap-1 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-black shadow-2xs">
                                                <Eye size={12} /> {item.views || 0}
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-3.5 mb-4">
                                            <div className="shrink-0 w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                                                #{index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0 pr-12">
                                                <h4 className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-2 padauk-bold group-hover:text-indigo-300 transition-colors leading-relaxed">
                                                    {item.title}
                                                </h4>
                                            </div>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between gap-4 pt-3.5 border-t border-slate-800/80">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.category}</span>
                                                <span className="text-[9px] text-slate-500 font-medium">{new Date(item.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <Link
                                                to={`/news/${item._id}`}
                                                target="_blank"
                                                className="px-3 py-1.5 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-lg text-[10px] font-bold uppercase transition-all shadow-2xs border border-slate-700 hover:border-indigo-500"
                                            >
                                                View Post
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
