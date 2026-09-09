import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { logout } from "../../store/authSlice";
import { useGetAllNewsQuery } from "../../store/newsApiSlice";
import { useGetAllAnnouncementsQuery } from "../../store/announcementApiSlice";
import { useGetPagesBySectionQuery } from "../../store/pageApiSlice";
import {
    LayoutDashboard,
    Newspaper,
    Users,
    LogOut,
    Menu,
    Activity,
    Briefcase,
    MapPin,
    Megaphone,
    UserCircle,
    ShieldCheck,
    Shield,
    X,
    HelpCircle,
    Info,
    BellRing,
    BarChart2,
    Clock,
    Globe,
    ExternalLink,
    ChevronRight,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const playPendingNotificationSound = () => {
    try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const playBeep = (time: number, freq: number) => {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(freq, time);
            gainNode.gain.setValueAtTime(0, time);
            gainNode.gain.linearRampToValueAtTime(0.3, time + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
            oscillator.start(time);
            oscillator.stop(time + 0.3);
        };
        playBeep(audioCtx.currentTime, 440);
        playBeep(audioCtx.currentTime + 0.35, 440);
    } catch { }
};

export default function AdminLayout() {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const role = user?.role ?? 0;
    const dispatch = useDispatch();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        // Prevent body/html from scrolling and showing double scrollbars on Admin dashboard
        const originalHtmlOverflow = document.documentElement.style.overflow;
        const originalBodyOverflow = document.body.style.overflow;
        const originalBodyHeight = document.body.style.height;
        const originalHtmlHeight = document.documentElement.style.height;
        const originalHtmlZoom = document.documentElement.style.zoom;
        const originalHtmlBg = document.documentElement.style.backgroundColor;
        const originalBodyBg = document.body.style.backgroundColor;

        document.documentElement.classList.add('dark', 'admin-mode');
        document.documentElement.style.zoom = '1';
        document.documentElement.style.overflow = 'hidden';
        document.documentElement.style.height = '100%';
        document.documentElement.style.backgroundColor = '#070b14';

        document.body.style.overflow = 'hidden';
        document.body.style.height = '100%';
        document.body.style.backgroundColor = '#070b14';
        
        return () => {
            document.documentElement.classList.remove('dark', 'admin-mode');
            document.documentElement.style.zoom = originalHtmlZoom;
            document.documentElement.style.overflow = originalHtmlOverflow;
            document.documentElement.style.height = originalHtmlHeight;
            document.documentElement.style.backgroundColor = originalHtmlBg;

            document.body.style.overflow = originalBodyOverflow;
            document.body.style.height = originalBodyHeight;
            document.body.style.backgroundColor = originalBodyBg;
        };
    }, []);

    // Global Notification State
    const [toastMessage, setToastMessage] = useState<{ id: string, name: string, subject: string, type?: 'report' | 'pendingPost' } | null>(null);
    const knownPendingNewsIds = useRef<Set<string>>(new Set());
    const knownPendingAnnouncementIds = useRef<Set<string>>(new Set());
    const knownPendingPageIds = useRef<Set<string>>(new Set());


    // Polling news every 10 seconds checking for newly arrived pending posts (only for admin/root admin)
    const { data: allNews } = useGetAllNewsQuery(undefined, {
        pollingInterval: 10000,
        skip: !isAuthenticated || role < 2
    });

    const { data: allAnnouncements } = useGetAllAnnouncementsQuery(undefined, {
        pollingInterval: 10000,
        skip: !isAuthenticated || role < 2
    });

    const { data: services } = useGetPagesBySectionQuery("services", {
        pollingInterval: 10000,
        skip: !isAuthenticated || role < 2
    });

    const { data: districts } = useGetPagesBySectionQuery("districts", {
        pollingInterval: 10000,
        skip: !isAuthenticated || role < 2
    });

    // Computed pending / unread counts for badges
    const pendingNewsCount = allNews?.filter(n => n.status === 'Pending').length ?? 0;
    const pendingAnnouncementsCount = allAnnouncements?.filter(a => a.status === 'Pending').length ?? 0;


    useEffect(() => {
        if (allNews && allNews.length > 0) {
            let hasNewPending = false;
            let newestPending = null;

            allNews.forEach(news => {
                if (news.status === 'Pending') {
                    if (!knownPendingNewsIds.current.has(news._id)) {
                        knownPendingNewsIds.current.add(news._id);
                        hasNewPending = true;
                        newestPending = news;
                    }
                } else {
                    knownPendingNewsIds.current.delete(news._id);
                }
            });

            if (hasNewPending && newestPending && role >= 2) {
                playPendingNotificationSound();
                setToastMessage({
                    id: (newestPending as any)._id,
                    name: (newestPending as any).author?.name || "ဝန်ထမ်း",
                    subject: `သတင်းအသစ်: ${(newestPending as any).title}`,
                    type: 'pendingPost'
                });
                setTimeout(() => setToastMessage(null), 8000);
            }
        }
    }, [allNews, role]);

    useEffect(() => {
        if (allAnnouncements && allAnnouncements.length > 0) {
            let hasNewPending = false;
            let newestPending = null;

            allAnnouncements.forEach(ann => {
                if (ann.status === 'Pending') {
                    if (!knownPendingAnnouncementIds.current.has(ann._id)) {
                        knownPendingAnnouncementIds.current.add(ann._id);
                        hasNewPending = true;
                        newestPending = ann;
                    }
                } else {
                    knownPendingAnnouncementIds.current.delete(ann._id);
                }
            });

            if (hasNewPending && newestPending && role >= 2) {
                playPendingNotificationSound();
                setToastMessage({
                    id: (newestPending as any)._id,
                    name: "ဝန်ထမ်း",
                    subject: `ထုတ်ပြန်ချက်အသစ်: ${(newestPending as any).title}`,
                    type: 'pendingPost'
                });
                setTimeout(() => setToastMessage(null), 8000);
            }
        }
    }, [allAnnouncements, role]);

    useEffect(() => {
        const pages = [...(services || []), ...(districts || [])];
        if (pages.length > 0) {
            let hasNewPending = false;
            let newestPending = null;

            pages.forEach(page => {
                if (page.status === 'Pending') {
                    if (!knownPendingPageIds.current.has(page._id)) {
                        knownPendingPageIds.current.add(page._id);
                        hasNewPending = true;
                        newestPending = page;
                    }
                } else {
                    knownPendingPageIds.current.delete(page._id);
                }
            });

            if (hasNewPending && newestPending && role >= 2) {
                playPendingNotificationSound();
                setToastMessage({
                    id: (newestPending as any)._id,
                    name: "ဝန်ထမ်း",
                    subject: `စာမျက်နှာအသစ်: ${(newestPending as any).title}`,
                    type: 'pendingPost'
                });
                setTimeout(() => setToastMessage(null), 8000);
            }
        }
    }, [services, districts, role]);

    // 1. Protection Logic: Must be authenticated
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Protection Logic: Regular Users (Role 0) can ONLY access their profile
    if (user.role === 0) {
        if (location.pathname === "/admin") {
            return <Navigate to="/admin/profile" replace />;
        }
        if (!location.pathname.startsWith("/admin/profile")) {
            return <Navigate to="/" replace />;
        }
    }

    const handleLogout = () => {
        dispatch(logout());
    };

    // Role display config
    const roleConfig = {
        0: { label: "အသုံးပြုသူ", eng: "User", icon: UserCircle, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", dot: "bg-slate-400" },
        1: { label: "ဌာန ဝန်ထမ်း", eng: "Staff", icon: Shield, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-400" },
        2: { label: "စီမံခန့်ခွဲသူ", eng: "Administrator", icon: ShieldCheck, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", dot: "bg-indigo-400" },
        3: { label: "အဆင့်မြင့် အုပ်ချုပ်သူ", eng: "Root Admin", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
    }[role] || { label: "Unknown", eng: "Unknown", icon: Shield, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", dot: "bg-slate-400" };

    // Nav Links with Role-based Access Control
    const navLinks = [
        // ── Core Management ──
        { name: "ပင်မ ဒက်ရှ်ဘုတ်", path: "/admin", icon: LayoutDashboard, minRole: 1, group: "core" },
        { name: "အစီရင်ခံစာများ", path: "/admin/reports", icon: BarChart2, minRole: 1, group: "core" },
        { name: "သတင်းများ စီမံရန်", path: "/admin/news", icon: Newspaper, minRole: 1, group: "core", badge: role >= 2 ? pendingNewsCount : 0 },
        { name: "ကိန်းဂဏန်းများ စီမံရန်", path: "/admin/statistics", icon: Activity, minRole: 1, group: "core" },
        { name: "အကောင့်များ စီမံရန်", path: "/admin/users", icon: Users, minRole: 3, group: "core" },
        { name: "History Log (Audit Trail)", path: "/admin/audit-logs", icon: Clock, minRole: 3, group: "core" },
        { name: "Home Layout စီမံရန်", path: "/admin/layout", icon: LayoutDashboard, minRole: 2, group: "core" },

        // ── CMS Content Sections ──
        { name: "ကဏ္ဍများ စီမံရန်", path: "/admin/categories", icon: LayoutDashboard, minRole: 1, group: "cms" },
        { name: "လှုပ်ရှားမှုများ", path: "/admin/activities", icon: Activity, minRole: 1, group: "cms" },
        { name: "အထူးသတင်းများ (Ticker)", path: "/admin/hotnews", icon: Megaphone, minRole: 1, group: "cms" },
        { name: "ဝန်ဆောင်မှုများ", path: "/admin/services", icon: Briefcase, minRole: 1, group: "cms" },
        { name: "လူဝင်မှုကြီးကြပ်ရေးရုံးများ", path: "/admin/districts", icon: MapPin, minRole: 1, group: "cms" },
        { name: "ထုတ်ပြန်ချက်နှင့် ညွှန်ကြားချက်များ", path: "/admin/announcements", icon: Megaphone, minRole: 1, group: "cms", badge: role >= 2 ? pendingAnnouncementsCount : 0 },
        { name: "ဌာနအကြောင်း", path: "/admin/about", icon: Info, minRole: 1, group: "cms" },
        { name: "FAQ မေးခွန်းများ", path: "/admin/faq", icon: HelpCircle, minRole: 1, group: "cms" },
        { name: "လိပ်စာနှင့် ဆက်သွယ်ရန် အချက်အလက်", path: "/admin/contact-info", icon: MapPin, minRole: 2, group: "cms" },
    ];

    // Find current active link name for breadcrumbs
    const currentActiveLink = navLinks.find(link => 
        link.path === "/admin" 
            ? location.pathname === "/admin" 
            : location.pathname === link.path || location.pathname.startsWith(link.path + "/")
    );

    return (
        <div className="dark admin-mode flex h-screen overflow-hidden bg-[#070b14] text-slate-100 font-sans">
            {/* Sidebar - Desktop & Mobile */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-[#0c1322] text-slate-300 transition-all duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col border-r border-slate-800/80 shadow-2xl ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Brand Header */}
                <div className="flex h-20 items-center justify-between px-5 border-b border-slate-800/80 bg-[#090e1a] shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                            <img
                                src="/photo_2026-03-09_14-35-44-removebg-preview.png"
                                alt="TLG Immigration"
                                className="h-10 w-10 object-contain drop-shadow-md"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#090e1a]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-black text-white tracking-wider uppercase truncate">
                                TLG IMMIGRATION
                            </span>
                            <span className="text-[11px] font-medium text-slate-400 padauk-bold truncate">
                                စီမံခန့်ခွဲမှု ဗဟိုဌာန
                            </span>
                        </div>
                    </div>
                    <button
                        className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 shrink-0 ml-1 transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Role Badge Sub-strip */}
                <div className="px-5 py-2.5 bg-[#090e1a] border-b border-slate-800/80 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${roleConfig.dot}`} />
                        <span className="text-xs font-bold text-slate-200 tracking-wide">
                            {roleConfig.eng}
                        </span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 padauk-bold">
                        {roleConfig.label}
                    </span>
                </div>

                {/* Navigation Links Area */}
                <div className="flex flex-col flex-1 justify-between p-3.5 overflow-hidden">
                    <nav className="space-y-1 overflow-y-auto flex-1 pr-1.5 custom-scrollbar">
                        {/* Group 1: Core Header */}
                        <div className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            အထွေထွေ စီမံခန့်ခွဲမှု
                        </div>

                        {navLinks.map((link, index) => {
                            // Hide links if the user role is below minimum required
                            if (role < link.minRole) return null;

                            // Insert a divider before the first CMS group item
                            const isFirstCms =
                                link.group === "cms" &&
                                (index === 0 || navLinks[index - 1]?.group !== "cms" || role < (navLinks[index - 1]?.minRole ?? 0));

                            const isActive = link.path === "/admin"
                                ? location.pathname === "/admin"
                                : location.pathname === link.path || location.pathname.startsWith(link.path + "/");

                            return (
                                <div key={link.name}>
                                    {isFirstCms && (
                                        <div className="pt-4 pb-1.5 px-3 mt-2 border-t border-slate-800/80">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                                ဝက်ဘ်ဆိုက် ကဏ္ဍများ
                                            </span>
                                        </div>
                                    )}
                                    <Link
                                        to={link.path}
                                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group my-0.5 ${
                                            isActive
                                                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-xs font-semibold"
                                                : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent"
                                        }`}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <link.icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                                            <span className={`truncate text-sm leading-normal ${isActive ? "font-semibold" : "font-medium"}`}>{link.name}</span>
                                        </div>

                                        {link.badge !== undefined && link.badge > 0 && (
                                            <span className="ml-2 px-1.5 py-0.5 text-[10px] font-black rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-xs animate-pulse shrink-0">
                                                {link.badge}
                                            </span>
                                        )}
                                    </Link>
                                </div>
                            );
                        })}
                    </nav>

                    {/* Bottom User Card & Quick Actions */}
                    <div className="shrink-0 border-t border-slate-800/80 pt-3 mt-2">
                        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-2 flex items-center justify-between">
                            <Link to="/admin/profile" className="flex items-center gap-2.5 min-w-0 group flex-1">
                                <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 group-hover:ring-2 ring-blue-400 transition-all">
                                    {user.avatar ? (
                                        <img loading="lazy" src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="font-bold text-xs text-slate-300">{user.name.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                                        {user.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400 truncate">
                                        {user.email}
                                    </span>
                                </div>
                            </Link>

                            <button
                                onClick={handleLogout}
                                title="စနစ်မှ ထွက်မည် / Logout"
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-1 shrink-0"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/70 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

                {/* Global Notification Toast */}
                {toastMessage && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-500">
                        <div className={`bg-[#0f172a] border-l-4 ${toastMessage.type === 'pendingPost' ? 'border-indigo-500' : 'border-blue-500'} rounded-2xl shadow-2xl p-4 flex items-start gap-4 pr-12 min-w-[320px] max-w-md border border-slate-800`}>
                            <div className={`${toastMessage.type === 'pendingPost' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-blue-500/10 text-blue-400'} p-2.5 rounded-xl shrink-0`}>
                                {toastMessage.type === 'pendingPost' ? (
                                    <Clock size={20} className="animate-pulse" />
                                ) : (
                                    <BellRing size={20} className="animate-pulse" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-sm font-bold text-white padauk-bold">
                                    {toastMessage.type === 'pendingPost' ? 'အတည်ပြုရန် ပို့စ်အသစ်ရှိပါသည်' : 'မက်ဆေ့ချ်အသစ် ရောက်ရှိပါသည်'}
                                </h4>
                                <p className="text-xs text-slate-400 font-medium mt-1 truncate">
                                    <span className="text-slate-200 font-semibold">{toastMessage.name}</span>
                                    {toastMessage.type === 'pendingPost' ? ' မှ တင်ပြထားပါသည်။' : ' မှ ပေးပို့ထားပါသည်။'}
                                </p>
                                <p className="text-xs text-slate-500 mt-1 truncate italic">"{toastMessage.subject}"</p>
                            </div>
                            <button onClick={() => setToastMessage(null)} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Topbar (Dark Mode) */}
                <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#0b101d] border-b border-slate-800/80 shadow-xs z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        
                        {/* Breadcrumbs / Page Identity */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 text-sm">
                                <span className="font-medium text-slate-400 hidden sm:inline">စီမံခန့်ခွဲမှု ဗဟို</span>
                                <ChevronRight size={13} className="text-slate-600 hidden sm:inline" />
                                <h2 className="font-semibold text-slate-100 text-sm">
                                    {currentActiveLink?.name || "ပင်မ ဒက်ရှ်ဘုတ်"}
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Direct Portal Preview Link */}
                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 transition-all shadow-2xs"
                        >
                            <Globe size={14} className="text-slate-400" />
                            <span>ဝက်ဘ်ဆိုက်သို့</span>
                            <ExternalLink size={12} className="opacity-60" />
                        </a>

                        <div className="h-5 w-px bg-slate-800 hidden sm:block" />

                        {/* User Profile Header Chip */}
                        <Link to="/admin/profile" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                            <div className="flex flex-col text-right hidden sm:flex">
                                <span className="text-xs font-bold text-slate-100 leading-tight">{user.name}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                    role === 3 ? "text-emerald-400" : role === 2 ? "text-indigo-400" : "text-blue-400"
                                }`}>
                                    {roleConfig.eng}
                                </span>
                            </div>
                            <div className={`h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center border-2 overflow-hidden shrink-0 shadow-2xs transition-all ${
                                role === 3 ? "border-emerald-500/80 ring-2 ring-emerald-500/20" : role === 2 ? "border-indigo-500/80 ring-2 ring-indigo-500/20" : "border-blue-500/80 ring-2 ring-blue-500/20"
                            }`}>
                                {user.avatar ? (
                                    <img loading="lazy" src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-bold text-xs text-slate-200">{user.name.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Page Content Rendering via Outlet */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#070b14] text-slate-100">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}

