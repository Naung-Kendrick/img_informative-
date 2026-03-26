import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "../../store";
import { logout } from "../../store/authSlice";
import { useGetAllContactsQuery } from "../../store/contactApiSlice";
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
    Mail,
    UserCircle,
    ShieldCheck,
    Shield,
    X,
    HelpCircle,
    Info,
    BellRing,
    Phone,
    BarChart2,
    Clock,
    Globe,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const playNotificationSound = () => {
    try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        // Soft digital bell configuration
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 1);
    } catch {
        // Ignore if AudioContext fails/blocked
    }
};

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
    const { i18n } = useTranslation();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    void i18n; // used in language switcher below
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const role = user?.role ?? 0;
    const dispatch = useDispatch();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Global Notification State
    const [toastMessage, setToastMessage] = useState<{ id: string, name: string, subject: string, type?: 'contact' | 'report' | 'pendingPost' } | null>(null);
    const knownContactIds = useRef<Set<string>>(new Set());
    const knownPendingNewsIds = useRef<Set<string>>(new Set());
    const knownPendingAnnouncementIds = useRef<Set<string>>(new Set());
    const knownPendingPageIds = useRef<Set<string>>(new Set());

    // Polling contacts every 10 seconds checking for newly arrived inquiries
    const { data: contacts } = useGetAllContactsQuery(undefined, {
        pollingInterval: 10000,
        skip: !isAuthenticated || role === 0 // Skip polling if not admin
    });


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

    useEffect(() => {
        if (contacts && contacts.length > 0) {
            let hasNewUnread = false;
            let newestContact = null;

            contacts.forEach(contact => {
                if (!knownContactIds.current.has(contact._id)) {
                    knownContactIds.current.add(contact._id);
                    if (!contact.isRead) {
                        hasNewUnread = true;
                        newestContact = contact;
                    }
                }
            });

            // Trigger alert only if we find a brand new unread message 
            // after the initial mount (when knownContactIds was > 0 populated)
            if (hasNewUnread && newestContact && knownContactIds.current.size > contacts.length === false) {
                playNotificationSound();
                setToastMessage({
                    id: (newestContact as any)._id,
                    name: (newestContact as any).name,
                    subject: (newestContact as any).subject,
                    type: 'contact'
                });

                setTimeout(() => setToastMessage(null), 5000);
            }
        }
    }, [contacts]);


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

    const toggleLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };


    // Role display config
    const roleConfig = {
        0: { label: "အသုံးပြုသူ", eng: "User", icon: UserCircle, color: "text-slate-400", bg: "bg-slate-500/10" },
        1: { label: "ဝန်ထမ်း", eng: "Staff", icon: Shield, color: "text-blue-400", bg: "bg-blue-500/10" },
        2: { label: "စီမံခန့်ခွဲသူ", eng: "Admin", icon: ShieldCheck, color: "text-slate-400", bg: "bg-slate-500/10" },
        3: { label: "Root Admin", eng: "Root Admin", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    }[role] || { label: "Unknown", eng: "Unknown", icon: Shield, color: "text-slate-400", bg: "bg-slate-500/10" };

    // Nav Links with Role-based Access Control
    const navLinks = [
        // ── Core ──
        { name: "admin ပင်မမျက်နှာစာ", path: "/admin", icon: LayoutDashboard, minRole: 1 },
        { name: "အစီရင်ခံစာများ", path: "/admin/reports", icon: BarChart2, minRole: 1 },
        { name: "သတင်းများ စီမံရန်", path: "/admin/news", icon: Newspaper, minRole: 1 },
        { name: "ကိန်းဂဏန်းများ စီမံရန်", path: "/admin/statistics", icon: Activity, minRole: 1 },
        { name: "အကောင့်များ စီမံရန်", path: "/admin/users", icon: Users, minRole: 2 },
        { name: "History Log (Audit Trail)", path: "/admin/audit-logs", icon: Clock, minRole: 3 },
        { name: "Home layout မျက်နှာစာ", path: "/admin/layout", icon: LayoutDashboard, minRole: 2 },

        // ── CMS Sections ──
        { name: "ကဏ္ဍများ စီမံရန်", path: "/admin/categories", icon: LayoutDashboard, minRole: 1, group: "cms" },
        { name: "လှုပ်ရှားမှုများ", path: "/admin/activities", icon: Activity, minRole: 1, group: "cms" },
        { name: "အထူးသတင်းများ (Ticker)", path: "/admin/hotnews", icon: Megaphone, minRole: 1, group: "cms" },
        { name: "ဝန်ဆောင်မှုများ", path: "/admin/services", icon: Briefcase, minRole: 1, group: "cms" },
        { name: "လူဝင်မှုကြီးကြပ်ရေးရုံးများ", path: "/admin/districts", icon: MapPin, minRole: 1, group: "cms" },
        { name: "ထုတ်ပြန်ချက်နှင့် ညွှန်ကြားချက်များ", path: "/admin/announcements", icon: Megaphone, minRole: 1, group: "cms" },
        { name: "ဌာနအကြောင်း", path: "/admin/about", icon: Info, minRole: 1, group: "cms" },
        { name: "FAQ စီမံခန့်ခွဲမှု", path: "/admin/faq", icon: HelpCircle, minRole: 1, group: "cms" },
        { name: "ဆက်သွယ်မှုများ စီမံရန်", path: "/admin/contact", icon: Mail, minRole: 2, group: "cms" },
        { name: "လိပ်စာနှင့် ဖုန်းနံပါတ်များ", path: "/admin/contact-info", icon: Phone, minRole: 2, group: "cms" },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Sidebar - Desktop & Mobile */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Sidebar Header with Role Badge */}
                <div className="flex h-16 items-center justify-between px-5 border-b border-slate-800 bg-slate-950 shrink-0">
                    <div className="flex items-center gap-2">
                        <roleConfig.icon size={18} className={roleConfig.color} />
                        <span className="text-base font-bold text-white tracking-wide padauk-bold">{roleConfig.label}</span>
                    </div>
                    <button
                        className="lg:hidden text-slate-400 hover:text-white"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col flex-1 justify-between p-4 overflow-hidden">
                    <nav className="space-y-1 overflow-y-auto flex-1 pr-1">
                        {navLinks.map((link, index) => {
                            // Hide links if the user role is below minimum required
                            if (role < link.minRole) return null;

                            // Insert a divider before the first CMS group item
                            const showDivider =
                                (link as any).group === "cms" &&
                                (index === 0 || !(navLinks[index - 1] as any).group || role < navLinks[index - 1].minRole);

                            // Exact match for /admin; for other paths, match exactly or as a prefix followed by '/'
                            const isActive = link.path === "/admin"
                                ? location.pathname === "/admin"
                                : location.pathname === link.path || location.pathname.startsWith(link.path + "/");

                            return (
                                <div key={link.name}>
                                    {showDivider && (
                                        <div className="pt-4 pb-2 mt-2 border-t border-slate-700">
                                            <span className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                                ကဏ္ဍများ
                                            </span>
                                        </div>
                                    )}
                                    <Link
                                        to={link.path}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                            : "hover:bg-slate-800 hover:text-white"
                                            }`}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <link.icon className="h-5 w-5 shrink-0" />
                                        <span className="font-medium text-sm truncate">{link.name}</span>
                                    </Link>
                                </div>
                            );
                        })}
                    </nav>

                    {/* Bottom Section */}
                    <div className="shrink-0 border-t border-slate-800 pt-3 mt-3">
                        <Link
                            to="/admin/profile"
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${location.pathname === '/admin/profile' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:bg-slate-800 hover:text-white'}`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <UserCircle className="h-5 w-5" />
                            <span className="font-medium text-sm">ပရိုဖိုင်</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors w-full mt-1"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="font-medium text-sm">ထွက်မည်</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

                {/* Global Notification Toast */}
                {toastMessage && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-500">
                        <div className={`bg-white border-l-4 ${toastMessage.type === 'pendingPost' ? 'border-indigo-500' : 'border-primary'} rounded-xl shadow-2xl p-4 flex items-start gap-4 pr-12 min-w-[300px]`}>
                            <div className={`${toastMessage.type === 'pendingPost' ? 'bg-indigo-100 text-indigo-600' : 'bg-primary/10 text-primary'} p-2 rounded-full shrink-0`}>
                                {toastMessage.type === 'pendingPost' ? (
                                    <Clock size={20} className="animate-pulse" />
                                ) : (
                                    <BellRing size={20} className="animate-pulse" />
                                )}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 padauk-bold">
                                    {toastMessage.type === 'pendingPost' ? 'အတည်ပြုရန် သတင်းအသစ်ရှိပါသည်' : 'မက်ဆေ့ချ်အသစ်ရောက်ရှိနေပါသည်'}
                                </h4>
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                    <span className="text-slate-700">{toastMessage.name}</span>
                                    {toastMessage.type === 'pendingPost' ? ' မှ တင်ပြထားပါသည်။' : ' မှ ပေးပို့ထားပါသည်။'}
                                </p>
                                <p className="text-xs text-slate-400 mt-1 truncate max-w-[200px]">"{toastMessage.subject}"</p>
                            </div>
                            <button onClick={() => setToastMessage(null)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600">
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Topbar */}
                <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden text-slate-500 hover:text-slate-700"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h2 className="text-xl font-bold text-slate-800 hidden sm:block padauk-bold">
                            Management Center
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Language Selector */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all text-slate-600 group">
                                    <Globe size={18} className="group-hover:text-primary transition-colors" />
                                    <span className="text-[11px] font-black uppercase tracking-widest">{i18n.language.startsWith('mm') ? 'မြန်မာ' : 'EN'}</span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl border-slate-200 shadow-2xl p-1.5 animate-in fade-in zoom-in-95">
                                <DropdownMenuItem
                                    onClick={() => toggleLanguage('mm')}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${i18n.language.startsWith('mm') ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50 text-slate-700'}`}
                                >
                                    <span className="font-bold text-xs uppercase tracking-wide">မြန်မာဘာသာ</span>
                                    {i18n.language.startsWith('mm') && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => toggleLanguage('en')}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${i18n.language.startsWith('en') ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50 text-slate-700'}`}
                                >
                                    <span className="font-bold text-xs uppercase tracking-wide">English</span>
                                    {i18n.language.startsWith('en') && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="h-6 w-px bg-slate-200 mx-1" />

                        <div className="flex items-center gap-4">
                            <div className="flex flex-col text-right">
                                <span className="text-sm font-bold text-slate-900">{user.name}</span>
                                <span className={`text-xs font-bold tracking-wide ${role === 3 ? "text-emerald-600" : role === 2 ? "text-primary" : "text-blue-600"
                                    }`}>
                                    {roleConfig.eng}
                                </span>
                            </div>
                            <Link to="/admin/profile" className={`h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border-2 overflow-hidden shrink-0 hover:ring-2 transition-all ${role === 3 ? "border-emerald-300 hover:ring-emerald-200" : role === 2 ? "border-primary hover:ring-primary/20" : "border-blue-300 hover:ring-blue-200"
                                }`}>
                                {user.avatar ? (
                                    <img loading="lazy" src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-bold text-sm text-slate-600">{user.name.charAt(0).toUpperCase()}</span>
                                )}
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content Rendering via Outlet */}
                <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

