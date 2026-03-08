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
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-slate-700 pl-3 padauk-bold flex items-center gap-2">
                        <BarChart2 className="text-slate-700" size={24} />
                        အစီရင်ခံစာများ (Reports)
                    </h1>
                    <p className="text-slate-500 mt-1 padauk-regular">
                        သတင်းနှင့် လှုပ်ရှားမှုများ၏ အချက်အလက်များနှင့် အများဆုံးနှစ်သက်မှုရရှိသော သတင်းများကို လေ့လာပါ။
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12"><Loader2 size={40} className="animate-spin text-slate-400" /></div>
            ) : isError ? (
                <div className="text-red-500 font-semibold text-center p-12 bg-red-50 rounded-2xl flex flex-col items-center gap-4">
                    <AlertCircle size={32} />
                    <span>အချက်အလက်များ ရယူရာတွင် ချို့ယွင်းချက်ဖြစ်ပေါ်နေပါသည်။</span>
                </div>
            ) : !stats ? null : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column: Monthly Chart */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 padauk-bold">
                                    လအလိုက် သတင်းတင်မှုများ
                                </h3>
                                <p className="text-sm text-slate-500 font-semibold">{stats.currentYear} ခုနှစ်</p>
                            </div>
                        </div>

                        <div className="h-[350px] w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="News" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Right Column: Top Liked News */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                                <Award size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 padauk-bold">
                                    အများဆုံးနှစ်သက်မှုရရှိသော သတင်း (Top 5)
                                </h3>
                                <p className="text-sm text-slate-500 font-semibold">အချိန်တိုင်းအတွက်</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {stats.topLiked.length === 0 ? (
                                <div className="text-center p-8 text-slate-400">No news found</div>
                            ) : (
                                stats.topLiked.map((item: any, index: number) => (
                                    <div
                                        key={item._id}
                                        className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                                    >
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-black text-sm group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-slate-900 line-clamp-2 padauk-bold group-hover:text-blue-600 transition-colors">
                                                {item.title}
                                            </h4>
                                            <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                <span className="flex items-center gap-1">
                                                    <Heart size={14} className="text-rose-500 fill-rose-500/20" />
                                                    {item.likes?.length || 0} Likes
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                <span className="truncate">{item.category}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            {item.images && item.images[0] && (
                                                <img
                                                    src={item.images[0]}
                                                    alt=""
                                                    className="shrink-0 w-16 h-16 rounded-xl object-cover shadow-sm group-hover:shadow border border-slate-200"
                                                />
                                            )}
                                            <Link
                                                to={`/admin/news/interactions/${item._id}`}
                                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold uppercase transition-colors whitespace-nowrap"
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
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm lg:col-span-2">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Eye size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 padauk-bold">
                                    ဝင်ရောက်ကြည့်ရှုမှုအများဆုံး သတင်း (Top 5 Views)
                                </h3>
                                <p className="text-sm text-slate-500 font-semibold">အချိန်တိုင်းအတွက်</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stats.topViews.length === 0 ? (
                                <div className="col-span-full text-center p-8 text-slate-400">No views record found</div>
                            ) : (
                                stats.topViews.map((item: any, index: number) => (
                                    <div
                                        key={item._id}
                                        className="relative flex flex-col p-5 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all group overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4">
                                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-[10px] font-black text-indigo-600 shadow-sm border border-slate-100">
                                                <Eye size={12} /> {item.views || 0}
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="shrink-0 w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-indigo-200">
                                                #{index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0 pr-12">
                                                <h4 className="text-sm font-bold text-slate-900 line-clamp-2 padauk-bold group-hover:text-indigo-600 transition-colors leading-relaxed">
                                                    {item.title}
                                                </h4>
                                            </div>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-slate-100/50">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.category}</span>
                                                <span className="text-[9px] text-slate-300 font-medium">{new Date(item.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <Link
                                                to={`/news/${item._id}`}
                                                target="_blank"
                                                className="px-4 py-2 bg-white hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl text-[10px] font-bold uppercase transition-all shadow-sm border border-indigo-100 hover:border-indigo-600 active:scale-95"
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
