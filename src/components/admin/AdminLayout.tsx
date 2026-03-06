import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { logout } from "../../store/authSlice";
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
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout() {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // 1. Protection Logic: Must be authenticated
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Protection Logic: Block Regular Users (Role 0)
    if (user.role === 0) {
        return <Navigate to="/" replace />;
    }

    const handleLogout = () => {
        dispatch(logout());
    };

    const role = user.role;

    // Role display config
    const roleConfig = {
        1: { label: "ဝန်ထမ်း", eng: "Staff", icon: Shield, color: "text-blue-400", bg: "bg-blue-500/10" },
        2: { label: "စီမံခန့်ခွဲသူ", eng: "Admin", icon: ShieldCheck, color: "text-slate-400", bg: "bg-slate-500/10" },
        3: { label: "Root Admin", eng: "Root Admin", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    }[role] || { label: "Unknown", eng: "Unknown", icon: Shield, color: "text-slate-400", bg: "bg-slate-500/10" };

    // Nav Links with Role-based Access Control
    const navLinks = [
        // ── Core ──
        { name: "ပင်မမျက်နှာစာ", path: "/admin", icon: LayoutDashboard, minRole: 1 },
        { name: "သတင်းများ စီမံရန်", path: "/admin/news", icon: Newspaper, minRole: 1 },
        { name: "အကောင့်များ စီမံရန်", path: "/admin/users", icon: Users, minRole: 2 },

        // ── CMS Sections ──
        { name: "လှုပ်ရှားမှုများ", path: "/admin/activities", icon: Activity, minRole: 1, group: "cms" },
        { name: "အထူးသတင်းများ (Ticker)", path: "/admin/hotnews", icon: Megaphone, minRole: 1, group: "cms" },
        { name: "ဝန်ဆောင်မှုများ", path: "/admin/services", icon: Briefcase, minRole: 1, group: "cms" },
        { name: "ခရိုင်များ", path: "/admin/districts", icon: MapPin, minRole: 1, group: "cms" },
        { name: "ထုတ်ပြန်ချက်များ", path: "/admin/announcements", icon: Megaphone, minRole: 1, group: "cms" },
        { name: "ဆက်သွယ်ရန်", path: "/admin/contact", icon: Mail, minRole: 2, group: "cms" },
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

                            // Exact match for /admin, broad match for other paths
                            const isActive = link.path === "/admin"
                                ? location.pathname === "/admin"
                                : location.pathname.startsWith(link.path);

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
                                            ? "bg-[#808080] text-white"
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
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${location.pathname === '/admin/profile' ? 'bg-[#808080] text-white' : 'hover:bg-slate-800 hover:text-white'}`}
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
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
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
                            Ta'ang News
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col text-right">
                                <span className="text-sm font-bold text-slate-900">{user.name}</span>
                                <span className={`text-xs font-bold tracking-wide ${role === 3 ? "text-emerald-600" : role === 2 ? "text-[#808080]" : "text-blue-600"
                                    }`}>
                                    {roleConfig.eng}
                                </span>
                            </div>
                            <Link to="/admin/profile" className={`h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border-2 overflow-hidden shrink-0 hover:ring-2 transition-all ${role === 3 ? "border-emerald-300 hover:ring-emerald-200" : role === 2 ? "border-[#808080] hover:ring-amber-200" : "border-blue-300 hover:ring-blue-200"
                                }`}>
                                {user.avatar ? (
                                    <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
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

