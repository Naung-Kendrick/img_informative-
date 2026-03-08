import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useGetAllNewsQuery } from "../../store/newsApiSlice";
import { useGetUsersQuery } from "../../store/usersApiSlice";
import { useGetPagesBySectionQuery } from "../../store/pageApiSlice";
import { useGetAllContactsQuery } from "../../store/contactApiSlice";
import { Link } from "react-router-dom";
import {
    Newspaper, Users as UsersIcon, CheckCircle2, FileEdit,
    Activity, Briefcase, MapPin, Mail, MailOpen, Megaphone, Zap,
    Plus, ArrowRight, ShieldCheck, Clock, TrendingUp
} from "lucide-react";

export default function DashboardOverview() {
    const { user } = useSelector((state: RootState) => state.auth);
    const role = user?.role ?? 0;

    // ── Data Hooks (conditionally skip based on role) ──
    const { data: news = [], isLoading: newsLoading } = useGetAllNewsQuery();
    const { data: users = [], isLoading: usersLoading } = useGetUsersQuery(undefined, { skip: role < 2 });
    const { data: servicePages = [], isLoading: servicesLoading } = useGetPagesBySectionQuery("services", { skip: role < 1 });
    const { data: districtPages = [], isLoading: districtsLoading } = useGetPagesBySectionQuery("districts", { skip: role < 1 });
    const { data: contacts = [], isLoading: contactsLoading } = useGetAllContactsQuery(undefined, { skip: role < 2 });

    // ── Computed Stats ──
    const publishedCount = news.filter(n => n.status === "Published").length;
    const draftCount = news.filter(n => n.status === "Draft").length;
    const activitiesCount = news.filter(n => n.category === "Activities" && n.status === "Published").length;
    const announcementsCount = news.filter(n => n.category === "Announcements" && n.status === "Published").length;
    // Staff: only show own news
    const myNewsCount = news.filter(n => n.author?._id === user?._id).length;
    const myPublishedCount = news.filter(n => n.author?._id === user?._id && n.status === "Published").length;
    const myDraftCount = news.filter(n => n.author?._id === user?._id && n.status === "Draft").length;

    const adminCount = users.filter(u => u.role > 0).length;
    const regularUsersCount = users.filter(u => u.role === 0).length;
    const unreadContacts = contacts.filter(c => !c.isRead).length;

    // ── Role Labels ──
    const roleLabel = role === 3 ? "Root Admin" : role === 2 ? "Admin" : "Staff";
    const roleGreeting = role === 3
        ? "စနစ်အား အပြီးအစီးထိန်းချုပ်နိုင်သည်။"
        : role === 2
            ? "သတင်းများ၊ ကဏ္ဍများနှင့် ဆက်သွယ်ချက်များကို စီမံခန့်ခွဲနိုင်သည်။"
            : "သတင်းရေးသားခြင်းနှင့် ကဏ္ဍအချက်အလက်များ ကြည့်ရှုနိုင်သည်။";

    return (
        <div className="animate-in fade-in duration-500">

            {/* ── Welcome Banner ─────────────────────────────── */}
            <div className={`mb-8 rounded-2xl p-6 md:p-8 border shadow-sm ${role === 3 ? "bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700" :
                role === 2 ? "bg-gradient-to-r from-[#808080] to-[#555555] border-slate-600" :
                    "bg-gradient-to-r from-blue-600 to-indigo-700 border-indigo-600"
                }`}>
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck size={18} className="text-white/60" />
                            <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{roleLabel}</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white padauk-bold mb-2">
                            မင်္ဂလာပါ၊ {user?.name}
                        </h1>
                        <p className="text-white/70 padauk-regular text-sm max-w-lg">
                            {roleGreeting}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-white/50 text-xs">
                        <Clock size={14} />
                        <span>{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
                STAFF DASHBOARD (Role 1)
               ══════════════════════════════════════════════════════ */}
            {role === 1 && (
                <>
                    {/* My News Stats */}
                    <h2 className="text-lg font-bold text-slate-800 padauk-bold mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-5 rounded-full bg-blue-500 inline-block" />
                        ကျွန်ုပ်၏ သတင်းများ
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                        <StatCard
                            icon={<Newspaper size={22} />}
                            label="ကျွန်ုပ် ရေးသားသော သတင်းများ"
                            value={newsLoading ? "-" : myNewsCount}
                            bg="bg-blue-50" text="text-blue-600" border="border-blue-100"
                        />
                        <StatCard
                            icon={<CheckCircle2 size={22} />}
                            label="လွှင့်တင်ပြီး"
                            value={newsLoading ? "-" : myPublishedCount}
                            bg="bg-green-50" text="text-green-600" border="border-green-100"
                        />
                        <StatCard
                            icon={<FileEdit size={22} />}
                            label="မူကြမ်းများ"
                            value={newsLoading ? "-" : myDraftCount}
                            bg="bg-slate-100" text="text-slate-600" border="border-slate-200"
                        />
                    </div>

                    {/* Site Overview (read-only) */}
                    <h2 className="text-lg font-bold text-slate-800 padauk-bold mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-5 rounded-full bg-slate-500 inline-block" />
                        ဝက်ဘ်ဆိုက် အနှစ်ချုပ်
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <MiniStat icon={<TrendingUp size={18} />} label="စုစုပေါင်း သတင်းများ" value={newsLoading ? "-" : publishedCount} color="text-slate-600" />
                        <MiniStat icon={<Zap size={18} />} label="လှုပ်ရှားမှုများ" value={newsLoading ? "-" : activitiesCount} color="text-slate-600" />
                        <MiniStat icon={<Briefcase size={18} />} label="ဝန်ဆောင်မှုများ" value={servicesLoading ? "-" : servicePages.length} color="text-violet-600" />
                        <MiniStat icon={<Megaphone size={18} />} label="ထုတ်ပြန်ချက်များ" value={newsLoading ? "-" : announcementsCount} color="text-rose-600" />
                    </div>

                    {/* Staff Quick Actions */}
                    <h2 className="text-lg font-bold text-slate-800 padauk-bold mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-5 rounded-full bg-green-500 inline-block" />
                        အမြန် လုပ်ဆောင်ရန်
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <QuickAction
                            to="/admin/news/new"
                            icon={<Newspaper size={24} />}
                            title="သတင်းအသစ် တင်မည်"
                            subtitle="ဝက်ဘ်ဆိုက်အတွက် သတင်းအသစ် ရေးသားပါ။"
                            variant="dark"
                        />
                        <QuickAction
                            to="/admin/news"
                            icon={<FileEdit size={24} />}
                            title="ကျွန်ုပ်၏ သတင်းများ ကြည့်မည်"
                            subtitle="ရေးသားထားသော သတင်းများကို ပြင်ဆင်/စစ်ဆေးပါ။"
                            variant="amber"
                        />
                    </div>
                </>
            )}

            {/* ══════════════════════════════════════════════════════
                ADMIN DASHBOARD (Role 2)
               ══════════════════════════════════════════════════════ */}
            {role === 2 && (
                <>
                    {/* Primary Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                        <StatCard
                            icon={<CheckCircle2 size={22} />}
                            label="လွှင့်တင်ပြီး သတင်းများ"
                            value={newsLoading ? "-" : publishedCount}
                            bg="bg-slate-50" text="text-primary" border="border-slate-100"
                        />
                        <StatCard
                            icon={<FileEdit size={22} />}
                            label="သတင်းမူကြမ်းများ"
                            value={newsLoading ? "-" : draftCount}
                            bg="bg-slate-100" text="text-slate-600" border="border-slate-200"
                        />
                        <StatCard
                            icon={<UsersIcon size={22} />}
                            label="ဝန်ထမ်းများ / အကောင့်များ"
                            value={usersLoading ? "-" : users.length}
                            bg="bg-blue-50" text="text-blue-600" border="border-blue-100"
                        />
                        <StatCard
                            icon={<Mail size={22} />}
                            label="ဆက်သွယ်ချက်များ"
                            value={contactsLoading ? "-" : contacts.length}
                            bg="bg-green-50" text="text-green-600" border="border-green-100"
                            badge={unreadContacts}
                        />
                    </div>

                    {/* CMS Section Stats */}
                    <h2 className="text-lg font-bold text-slate-800 padauk-bold mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
                        ကဏ္ဍအလိုက် အချက်အလက်
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                        <MiniStat icon={<Zap size={18} />} label="လှုပ်ရှားမှုများ" value={newsLoading ? "-" : activitiesCount} color="text-slate-600" />
                        <MiniStat icon={<Briefcase size={18} />} label="ဝန်ဆောင်မှုများ" value={servicesLoading ? "-" : servicePages.length} color="text-violet-600" />
                        <MiniStat icon={<MapPin size={18} />} label="ခရိုင်များ" value={districtsLoading ? "-" : districtPages.length} color="text-teal-600" />
                        <MiniStat icon={<Megaphone size={18} />} label="ထုတ်ပြန်ချက်များ" value={newsLoading ? "-" : announcementsCount} color="text-rose-600" />
                        <Link to="/admin/contact" className="relative">
                            <MiniStat icon={<Mail size={18} />} label="ဆက်သွယ်ချက်များ" value={contactsLoading ? "-" : contacts.length} color="text-sky-600" />
                            {unreadContacts > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                                    {unreadContacts}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Admin Quick Actions */}
                    <h2 className="text-lg font-bold text-slate-800 padauk-bold mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
                        အမြန် လုပ်ဆောင်ရန်
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <QuickAction
                            to="/admin/news/new"
                            icon={<Newspaper size={24} />}
                            title="သတင်းအသစ် တင်မည်"
                            subtitle="ဝက်ဘ်ဆိုက်အတွက် သတင်းအသစ် ရေးသားပါ။"
                            variant="dark"
                        />
                        <QuickAction
                            to="/admin/pages/new?section=services"
                            icon={<Plus size={24} />}
                            title="ဝန်ဆောင်မှု ထည့်မည်"
                            subtitle="ဝန်ဆောင်မှုအသစ် စာမျက်နှာ ဖန်တီးပါ။"
                            variant="amber"
                        />
                        <QuickAction
                            to="/admin/contact"
                            icon={<MailOpen size={24} />}
                            title="မက်ဆေ့ချ်များ ကြည့်မည်"
                            subtitle={unreadContacts > 0 ? `မဖတ်ရသေးသော ${unreadContacts} ခု ရှိသည်။` : "မက်ဆေ့ချ်များအားလုံး ဖတ်ပြီးပါပြီ။"}
                            variant="dark"
                            badge={unreadContacts}
                        />
                    </div>

                    {/* Admin Permission Info */}
                    <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-3">
                        <ShieldCheck size={20} className="text-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-slate-900 padauk-bold">စီမံခန့်ခွဲသူ အကောင့်</p>
                            <p className="text-xs text-slate-700 padauk-regular mt-1">
                                သင်သည် သတင်းများ၊ ကဏ္ဍများ၊ ဆက်သွယ်ချက်များကို စီမံနိုင်ပြီး Staff အကောင့်များ၏ ရာထူးကို ပြောင်းနိုင်ပါသည်။ Root Admin ၏ အကောင့်ကိုမူ ပြင်ဆင်ခွင့်မရှိပါ။
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                        <StatCard
                            icon={<CheckCircle2 size={22} />}
                            label="လွှင့်တင်ပြီး သတင်းများ"
                            value={newsLoading ? "-" : publishedCount}
                            bg="bg-slate-50" text="text-primary" border="border-slate-100"
                        />
                        <StatCard
                            icon={<FileEdit size={22} />}
                            label="သတင်းမူကြမ်းများ"
                            value={newsLoading ? "-" : draftCount}
                            bg="bg-slate-100" text="text-slate-600" border="border-slate-200"
                        />
                        <StatCard
                            icon={<Activity size={22} />}
                            label="စီမံခန့်ခွဲသူ/ဝန်ထမ်း"
                            value={usersLoading ? "-" : adminCount}
                            bg="bg-blue-50" text="text-blue-600" border="border-blue-100"
                        />
                        <StatCard
                            icon={<UsersIcon size={22} />}
                            label="အသုံးပြုသူ အကောင့်များ"
                            value={usersLoading ? "-" : regularUsersCount}
                            bg="bg-green-50" text="text-green-600" border="border-green-100"
                        />
                    </div>

                    {/* CMS Section Stats */}
                    <h2 className="text-lg font-bold text-slate-800 padauk-bold mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
                        ကဏ္ဍအလိုက် အချက်အလက်
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                        <MiniStat icon={<Zap size={18} />} label="လှုပ်ရှားမှုများ" value={newsLoading ? "-" : activitiesCount} color="text-slate-600" />
                        <MiniStat icon={<Briefcase size={18} />} label="ဝန်ဆောင်မှုများ" value={servicesLoading ? "-" : servicePages.length} color="text-violet-600" />
                        <MiniStat icon={<MapPin size={18} />} label="ခရိုင်များ" value={districtsLoading ? "-" : districtPages.length} color="text-teal-600" />
                        <MiniStat icon={<Megaphone size={18} />} label="ထုတ်ပြန်ချက်များ" value={newsLoading ? "-" : announcementsCount} color="text-rose-600" />
                        <Link to="/admin/contact" className="relative">
                            <MiniStat icon={<Mail size={18} />} label="ဆက်သွယ်ချက်များ" value={contactsLoading ? "-" : contacts.length} color="text-sky-600" />
                            {unreadContacts > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                                    {unreadContacts}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Root Admin Quick Actions */}
                    <h2 className="text-lg font-bold text-slate-800 padauk-bold mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
                        အမြန် လုပ်ဆောင်ရန်
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <QuickAction
                            to="/admin/news/new"
                            icon={<Newspaper size={24} />}
                            title="သတင်းအသစ် တင်မည်"
                            subtitle="ဝက်ဘ်ဆိုက်အတွက် သတင်းအသစ် ရေးသားပါ။"
                            variant="dark"
                        />
                        <QuickAction
                            to="/admin/pages/new?section=services"
                            icon={<Plus size={24} />}
                            title="ဝန်ဆောင်မှု ထည့်မည်"
                            subtitle="ဝန်ဆောင်မှုအသစ် စာမျက်နှာ ဖန်တီးပါ။"
                            variant="amber"
                        />
                        <QuickAction
                            to="/admin/contact"
                            icon={<MailOpen size={24} />}
                            title="မက်ဆေ့ချ်များ ကြည့်မည်"
                            subtitle={unreadContacts > 0 ? `မဖတ်ရသေးသော ${unreadContacts} ခု ရှိသည်။` : "မက်ဆေ့ချ်များအားလုံး ဖတ်ပြီးပါပြီ။"}
                            variant="dark"
                            badge={unreadContacts}
                        />
                    </div>
                </>
            )}

        </div>
    );
}

/* ── Reusable Sub-components ──────────────────────────────────────────── */

function StatCard({ icon, label, value, bg, text, border, badge }: {
    icon: React.ReactNode; label: string; value: string | number;
    bg: string; text: string; border: string; badge?: number;
}) {
    return (
        <div className="relative bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className={`w-11 h-11 rounded-xl ${bg} ${text} ${border} border flex items-center justify-center shrink-0`}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-semibold text-slate-500 padauk-bold">{label}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{value}</h3>
            </div>
            {badge !== undefined && badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                    {badge}
                </span>
            )}
        </div>
    );
}

function MiniStat({ icon, label, value, color }: {
    icon: React.ReactNode; label: string; value: string | number; color: string;
}) {
    return (
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow">
            <div className={`${color} mx-auto mb-2`}>{icon}</div>
            <p className="text-[22px] font-extrabold text-slate-900">{value}</p>
            <p className="text-[11px] font-semibold text-slate-500 padauk-bold mt-1">{label}</p>
        </div>
    );
}

function QuickAction({ to, icon, title, subtitle, variant, badge }: {
    to: string; icon: React.ReactNode; title: string; subtitle: string;
    variant: 'dark' | 'amber'; badge?: number;
}) {
    const isDark = variant === 'dark';
    return (
        <Link
            to={to}
            className={`group relative p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all flex flex-col ${isDark
                ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'
                : 'bg-gradient-to-br from-primary to-primary/80 border-primary/20 shadow-primary/20'
                }`}
        >
            {badge ? (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                    {badge}
                </span>
            ) : null}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${isDark ? 'bg-slate-800 border-2 border-primary/40 text-primary' : 'bg-primary/20 border-2 border-white/30 text-white'
                }`}>
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white padauk-bold mb-1">{title}</h3>
            <p className={`text-sm padauk-regular mb-3 ${isDark ? 'text-slate-400' : 'text-white/80'}`}>{subtitle}</p>
            <div className="mt-auto flex items-center text-xs font-bold text-[#e2e8f0]">
                သွားမည် <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
        </Link>
    );
}

