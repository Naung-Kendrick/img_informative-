import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useGetAllNewsQuery } from "../../store/newsApiSlice";
import { useGetUsersQuery } from "../../store/usersApiSlice";
import { useGetPagesBySectionQuery } from "../../store/pageApiSlice";
import { useGetAllDistrictsQuery } from "../../store/districtApiSlice";
import { useGetAllAnnouncementsQuery } from "../../store/announcementApiSlice";
import { Link } from "react-router-dom";
import {
    Newspaper, Users as UsersIcon, CheckCircle2, FileEdit,
    Activity, Briefcase, MapPin, Megaphone, Zap,
    Plus, ArrowRight, ShieldCheck, TrendingUp, Calendar,
    Shield, ChevronRight
} from "lucide-react";

export default function DashboardOverview() {
    const { user } = useSelector((state: RootState) => state.auth);
    const role = user?.role ?? 0;

    // ── Data Hooks (conditionally skip based on role) ──
    const { data: news = [], isLoading: newsLoading } = useGetAllNewsQuery();
    const { data: users = [], isLoading: usersLoading } = useGetUsersQuery(undefined, { skip: role < 3 });
    const { data: servicePages = [], isLoading: servicesLoading } = useGetPagesBySectionQuery("services", { skip: role < 1 });
    const { data: districts = [], isLoading: districtsLoading } = useGetAllDistrictsQuery(undefined, { skip: role < 1 });
    const { data: dedicatedAnnouncements = [], isLoading: announcementsLoading } = useGetAllAnnouncementsQuery();

    // ── Computed Stats ──
    const publishedCount = news.filter(n => n.status === "Published").length;
    const draftCount = news.filter(n => n.status === "Draft").length;
    const activitiesCount = news.filter(n => n.category?.toLowerCase() === "activities").length;
    const announcementsCount = dedicatedAnnouncements.length;
    
    // Staff: only show own news
    const myNewsCount = news.filter(n => n.author?._id === user?._id).length;
    const myPublishedCount = news.filter(n => n.author?._id === user?._id && n.status === "Published").length;
    const myDraftCount = news.filter(n => n.author?._id === user?._id && n.status === "Draft").length;

    const adminCount = users.filter(u => u.role > 0).length;
    const regularUsersCount = users.filter(u => u.role === 0).length;

    // Role Label & Clearance
    const roleTitle = role === 3 ? "Root Administrator" : role === 2 ? "Administrator" : "Staff Member";
    const roleMyanmar = role === 3 ? "အဆင့်မြင့် အုပ်ချုပ်သူ (Root Admin)" : role === 2 ? "စီမံခန့်ခွဲသူ (Admin)" : "ဌာန ဝန်ထမ်း (Staff)";
    const roleDescription = role === 3
        ? "စနစ်တစ်ခုလုံးအား စီမံခန့်ခွဲနိုင်သော အဆင့်မြင့် စီမံခန့်ခွဲသူ အကောင့်ဖြင့် ဝင်ရောက်ထားပါသည်။"
        : role === 2
            ? "သတင်းများ၊ ဝန်ဆောင်မှုများနှင့် ကဏ္ဍစုံကို စီမံခန့်ခွဲနိုင်ပါသည်။"
            : "သတင်းရေးသားခြင်းနှင့် ကဏ္ဍဆိုင်ရာ အချက်အလက်များကို စစ်ဆေးကြည့်ရှုနိုင်ပါသည်။";

    return (
        <div className="space-y-8 animate-in fade-in duration-300">

            {/* ── Executive Header Banner (Professional Dark Mode) ─────────────────────────────── */}
            <div className="bg-[#0e1627] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        <span>Ta'ang Land Immigration Department</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-emerald-400 font-bold">{roleTitle}</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white padauk-bold tracking-tight">
                        မင်္ဂလာပါ၊ {user?.name}
                    </h1>

                    <p className="text-sm text-slate-300 padauk-regular mt-1.5 max-w-2xl leading-relaxed">
                        {roleDescription}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2.5 shrink-0">
                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200 shadow-2xs">
                        <Calendar size={14} className="text-blue-400" />
                        <span>{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 padauk-bold px-1">
                        {roleMyanmar}
                    </span>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
                STAFF DASHBOARD (Role 1)
               ══════════════════════════════════════════════════════ */}
            {role === 1 && (
                <>
                    {/* My News Stats */}
                    <section>
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-1.5 h-5 rounded-full bg-blue-500" />
                            <h2 className="text-base font-bold text-slate-100 padauk-bold">
                                ကျွန်ုပ်၏ သတင်းများ
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <DarkStatCard
                                icon={<Newspaper size={20} />}
                                label="ကျွန်ုပ် ရေးသားသော သတင်းများ"
                                value={newsLoading ? "-" : myNewsCount}
                                to="/admin/news"
                                accent="blue"
                            />
                            <DarkStatCard
                                icon={<CheckCircle2 size={20} />}
                                label="လွှင့်တင်ပြီး သတင်းများ"
                                value={newsLoading ? "-" : myPublishedCount}
                                to="/admin/news"
                                accent="green"
                            />
                            <DarkStatCard
                                icon={<FileEdit size={20} />}
                                label="သတင်း မူကြမ်းများ"
                                value={newsLoading ? "-" : myDraftCount}
                                to="/admin/news"
                                accent="amber"
                            />
                        </div>
                    </section>

                    {/* Site Overview */}
                    <section>
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-1.5 h-5 rounded-full bg-slate-500" />
                            <h2 className="text-base font-bold text-slate-100 padauk-bold">
                                ဝက်ဘ်ဆိုက် အနှစ်ချုပ်
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <DarkMiniStat icon={<TrendingUp size={18} />} label="စုစုပေါင်း သတင်းများ" value={newsLoading ? "-" : publishedCount} to="/admin/news" color="text-blue-400" />
                            <DarkMiniStat icon={<Zap size={18} />} label="လှုပ်ရှားမှုများ" value={newsLoading ? "-" : activitiesCount} to="/admin/activities" color="text-slate-300" />
                            <DarkMiniStat icon={<Briefcase size={18} />} label="ဝန်ဆောင်မှုများ" value={servicesLoading ? "-" : servicePages.length} to="/admin/services" color="text-violet-400" />
                            <DarkMiniStat icon={<Megaphone size={18} />} label="ထုတ်ပြန်ချက်များ" value={announcementsLoading ? "-" : announcementsCount} to="/admin/announcements" color="text-rose-400" />
                        </div>
                    </section>

                    {/* Staff Quick Actions */}
                    <section>
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-1.5 h-5 rounded-full bg-emerald-500" />
                            <h2 className="text-base font-bold text-slate-100 padauk-bold">
                                အမြန် ဆောင်ရွက်ရန်
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <DarkQuickAction
                                to="/admin/news/new"
                                icon={<Newspaper size={22} />}
                                title="သတင်းအသစ် တင်မည်"
                                subtitle="ဝက်ဘ်ဆိုက်အတွက် သတင်းအသစ် ရေးသားဖော်ပြပါ။"
                            />
                            <DarkQuickAction
                                to="/admin/news"
                                icon={<FileEdit size={22} />}
                                title="ကျွန်ုပ်၏ သတင်းများ ကြည့်မည်"
                                subtitle="ရေးသားထားသော သတင်းများကို ပြင်ဆင်/စစ်ဆေးပါ။"
                            />
                        </div>
                    </section>
                </>
            )}

            {/* ══════════════════════════════════════════════════════
                ADMIN DASHBOARD (Role 2)
               ══════════════════════════════════════════════════════ */}
            {role === 2 && (
                <>
                    {/* Primary Stats */}
                    <section>
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-1.5 h-5 rounded-full bg-blue-500" />
                            <h2 className="text-base font-bold text-slate-100 padauk-bold">
                                အဓိက အချက်အလက်များ
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <DarkStatCard
                                icon={<CheckCircle2 size={20} />}
                                label="လွှင့်တင်ပြီး သတင်းများ"
                                value={newsLoading ? "-" : publishedCount}
                                to="/admin/news"
                                accent="blue"
                            />
                            <DarkStatCard
                                icon={<FileEdit size={20} />}
                                label="သတင်းမူကြမ်းများ"
                                value={newsLoading ? "-" : draftCount}
                                to="/admin/news"
                                accent="amber"
                            />
                            <DarkStatCard
                                icon={<MapPin size={20} />}
                                label="လူဝင်မှုကြီးကြပ်ရေးရုံးများ"
                                value={districtsLoading ? "-" : districts.length}
                                to="/admin/districts"
                                accent="indigo"
                            />
                            <DarkStatCard
                                icon={<Megaphone size={20} />}
                                label="ထုတ်ပြန်ချက်များ"
                                value={announcementsLoading ? "-" : announcementsCount}
                                to="/admin/announcements"
                                accent="emerald"
                            />
                        </div>
                    </section>

                    {/* CMS Section Stats */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-1.5 h-5 rounded-full bg-indigo-500" />
                                <h2 className="text-base font-bold text-slate-100 padauk-bold">
                                    ဝက်ဘ်ဆိုက် ကဏ္ဍအလိုက် အချက်အလက်
                                </h2>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                    4 ကဏ္ဍ
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <DarkMiniStat icon={<Zap size={18} />} label="လှုပ်ရှားမှုများ" value={newsLoading ? "-" : activitiesCount} to="/admin/activities" color="text-slate-300" />
                            <DarkMiniStat icon={<Briefcase size={18} />} label="ဝန်ဆောင်မှုများ" value={servicesLoading ? "-" : servicePages.length} to="/admin/services" color="text-violet-400" />
                            <DarkMiniStat icon={<MapPin size={18} />} label="လူဝင်မှုကြီးကြပ်ရေးရုံးများ" value={districtsLoading ? "-" : districts.length} to="/admin/districts" color="text-teal-400" />
                            <DarkMiniStat icon={<Megaphone size={18} />} label="ထုတ်ပြန်ချက်များ" value={announcementsLoading ? "-" : announcementsCount} to="/admin/announcements" color="text-rose-400" />
                        </div>
                    </section>

                    {/* Admin Quick Actions */}
                    <section>
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-1.5 h-5 rounded-full bg-emerald-500" />
                            <h2 className="text-base font-bold text-slate-100 padauk-bold">
                                အမြန် ဆောင်ရွက်ရန်
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            <DarkQuickAction
                                to="/admin/news/new"
                                icon={<Newspaper size={22} />}
                                title="သတင်းအသစ် တင်မည်"
                                subtitle="ဝက်ဘ်ဆိုက်အတွက် သတင်းအသစ် ရေးသားဖော်ပြပါ။"
                            />
                            <DarkQuickAction
                                to="/admin/pages/new?section=services"
                                icon={<Plus size={22} />}
                                title="ဝန်ဆောင်မှု ထည့်မည်"
                                subtitle="ပြည်သူ့ဝန်ဆောင်မှု အသစ် စာမျက်နှာ ဖန်တီးပါ။"
                            />
                            <DarkQuickAction
                                to="/admin/announcements/new"
                                icon={<Megaphone size={22} />}
                                title="ထုတ်ပြန်ချက် အသစ်တင်မည်"
                                subtitle="ဌာနဆိုင်ရာ အသိပေးချက်နှင့် ကြေညာချက်များ တင်ပြပါ။"
                            />
                        </div>
                    </section>

                    {/* Admin Permission Info */}
                    <div className="bg-[#0e1627] border border-slate-800 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                        <div className="p-2.5 rounded-xl bg-slate-800 text-blue-400 shrink-0 mt-0.5">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-100 padauk-bold">စီမံခန့်ခွဲသူ အကောင့် (Administrator)</p>
                            <p className="text-xs text-slate-400 padauk-regular mt-1 leading-relaxed">
                                သင်သည် သတင်းများ၊ ကဏ္ဍများ၊ ဆက်သွယ်ချက်များကို စီမံခန့်ခွဲနိုင်ပြီး ဝန်ထမ်း (Staff) အကောင့်များကို ဖန်တီး/ပြင်ဆင်နိုင်ပါသည်။ အဆင့်မြင့် စီမံခန့်ခွဲသူ (Root Admin) ၏ အကောင့်များကိုမူ ပြင်ဆင်ခွင့်မရှိပါ။
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* ══════════════════════════════════════════════════════
                ROOT ADMIN DASHBOARD (Role 3) — Full Access
               ══════════════════════════════════════════════════════ */}
            {role === 3 && (
                <>
                    {/* Primary Stats Grid */}
                    <section>
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-1.5 h-5 rounded-full bg-blue-500" />
                            <h2 className="text-base font-bold text-slate-100 padauk-bold">
                                အဓိက အချက်အလက်များ
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <DarkStatCard
                                icon={<CheckCircle2 size={20} />}
                                label="လွှင့်တင်ပြီး သတင်းများ"
                                value={newsLoading ? "-" : publishedCount}
                                to="/admin/news"
                                accent="blue"
                            />
                            <DarkStatCard
                                icon={<FileEdit size={20} />}
                                label="သတင်းမူကြမ်းများ"
                                value={newsLoading ? "-" : draftCount}
                                to="/admin/news"
                                accent="amber"
                            />
                            <DarkStatCard
                                icon={<Activity size={20} />}
                                label="စီမံခန့်ခွဲသူ / ဝန်ထမ်း"
                                value={usersLoading ? "-" : adminCount}
                                to="/admin/users"
                                accent="indigo"
                            />
                            <DarkStatCard
                                icon={<UsersIcon size={20} />}
                                label="အသုံးပြုသူ အကောင့်များ"
                                value={usersLoading ? "-" : regularUsersCount}
                                to="/admin/users"
                                accent="emerald"
                            />
                        </div>
                    </section>

                    {/* CMS Section Stats */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-1.5 h-5 rounded-full bg-indigo-500" />
                                <h2 className="text-base font-bold text-slate-100 padauk-bold">
                                    ဝက်ဘ်ဆိုက် ကဏ္ဍအလိုက် အချက်အလက်
                                </h2>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                    4 ကဏ္ဍ
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <DarkMiniStat icon={<Zap size={18} />} label="လှုပ်ရှားမှုများ" value={newsLoading ? "-" : activitiesCount} to="/admin/activities" color="text-slate-300" />
                            <DarkMiniStat icon={<Briefcase size={18} />} label="ဝန်ဆောင်မှုများ" value={servicesLoading ? "-" : servicePages.length} to="/admin/services" color="text-violet-400" />
                            <DarkMiniStat icon={<MapPin size={18} />} label="လူဝင်မှုကြီးကြပ်ရေးရုံးများ" value={districtsLoading ? "-" : districts.length} to="/admin/districts" color="text-teal-400" />
                            <DarkMiniStat icon={<Megaphone size={18} />} label="ထုတ်ပြန်ချက်များ" value={announcementsLoading ? "-" : announcementsCount} to="/admin/announcements" color="text-rose-400" />
                        </div>
                    </section>

                    {/* Root Admin Quick Actions */}
                    <section>
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-1.5 h-5 rounded-full bg-emerald-500" />
                            <h2 className="text-base font-bold text-slate-100 padauk-bold">
                                အမြန် ဆောင်ရွက်ရန်
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            <DarkQuickAction
                                to="/admin/news/new"
                                icon={<Newspaper size={22} />}
                                title="သတင်းအသစ် တင်မည်"
                                subtitle="ဝက်ဘ်ဆိုက်အတွက် သတင်းအသစ် ရေးသားဖော်ပြပါ။"
                            />
                            <DarkQuickAction
                                to="/admin/pages/new?section=services"
                                icon={<Plus size={22} />}
                                title="ဝန်ဆောင်မှု ထည့်မည်"
                                subtitle="ပြည်သူ့ဝန်ဆောင်မှု အသစ် စာမျက်နှာ ဖန်တီးပါ။"
                            />
                            <DarkQuickAction
                                to="/admin/announcements/new"
                                icon={<Megaphone size={22} />}
                                title="ထုတ်ပြန်ချက် အသစ်တင်မည်"
                                subtitle="ဌာနဆိုင်ရာ အသိပေးချက်နှင့် ကြေညာချက်များ တင်ပြပါ။"
                            />
                        </div>
                    </section>

                    {/* Root Admin Security Clearance Notice */}
                    <div className="bg-[#0e1627] border border-slate-800 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                        <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 shrink-0 mt-0.5">
                            <Shield size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-100 padauk-bold">Root Admin လုံခြုံရေးအဆင့်အတန်း (Highest Authority)</p>
                            <p className="text-xs text-slate-400 padauk-regular mt-1 leading-relaxed">
                                သင်သည် စနစ်၏ ပင်မစီမံခန့်ခွဲသူဖြစ်ပြီး စနစ်တစ်ခုလုံး၊ ဝန်ထမ်းအကောင့်များ၊ အစီရင်ခံစာများ၊ လုံခြုံရေးမှတ်တမ်းများ (Audit Trail) နှင့် ပင်မစာမျက်နှာ Layout များကို အပြည့်အဝ ထိန်းချုပ်ခွင့်ရှိပါသည်။
                            </p>
                        </div>
                    </div>
                </>
            )}

        </div>
    );
}

/* ── Dark Mode Reusable Sub-components ──────────────────────────────────────────── */

interface DarkStatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    to: string;
    accent: 'blue' | 'green' | 'indigo' | 'amber' | 'emerald';
    badge?: number;
}

function DarkStatCard({ icon, label, value, to, accent, badge }: DarkStatCardProps) {
    const accentStyles = {
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    }[accent];

    return (
        <Link
            to={to}
            className="relative bg-[#0e1627] border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 transition-all duration-200 shadow-sm flex flex-col justify-between group h-full"
        >
            <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl ${accentStyles} border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                    {icon}
                </div>

                {badge !== undefined && badge > 0 && (
                    <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold rounded-full">
                        {badge} မဖတ်ရသေး
                    </span>
                )}
            </div>

            <div className="mt-4">
                <div className="text-3xl font-extrabold text-white tracking-tight font-sans group-hover:text-blue-400 transition-colors">
                    {value}
                </div>
                <p className="text-sm font-semibold text-slate-200 mt-1.5 line-clamp-1">
                    {label}
                </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-blue-400 transition-colors">
                <span>အသေးစိတ် စီမံရန်</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
        </Link>
    );
}

interface DarkMiniStatProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
    to: string;
    badge?: number;
}

function DarkMiniStat({ icon, label, value, color, to, badge }: DarkMiniStatProps) {
    return (
        <Link
            to={to}
            className="relative bg-[#0e1627] border border-slate-800/90 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-sm flex flex-col items-center text-center group h-full"
        >
            {badge !== undefined && badge > 0 && (
                <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {badge}
                </span>
            )}
            <div className={`w-10 h-10 rounded-xl bg-slate-800/80 ${color} border border-slate-700/60 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform`}>
                {icon}
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-sans group-hover:text-blue-400 transition-colors">
                {value}
            </p>
            <p className="text-sm font-semibold text-slate-200 mt-1.5 line-clamp-1">
                {label}
            </p>
        </Link>
    );
}

interface DarkQuickActionProps {
    to: string;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    badge?: number;
}

function DarkQuickAction({ to, icon, title, subtitle, badge }: DarkQuickActionProps) {
    return (
        <Link
            to={to}
            className="group relative bg-[#0e1627] border border-slate-800 hover:border-blue-500/50 hover:bg-[#111c33] rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-sm flex flex-col justify-between"
        >
            {badge ? (
                <span className="absolute top-3 right-3 px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-bold rounded-full">
                    {badge}
                </span>
            ) : null}

            <div>
                <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center mb-4">
                    {icon}
                </div>

                <h3 className="text-base font-bold text-white padauk-bold mb-1 group-hover:text-blue-300 transition-colors">
                    {title}
                </h3>

                <p className="text-xs text-slate-400 padauk-regular leading-relaxed line-clamp-2">
                    {subtitle}
                </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                <span>ဆောင်ရွက်ရန်</span>
                <div className="p-1 rounded-lg bg-slate-800/80 group-hover:bg-blue-600 transition-colors">
                    <ChevronRight size={13} />
                </div>
            </div>
        </Link>
    );
}
