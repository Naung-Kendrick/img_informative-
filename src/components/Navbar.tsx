import { useState, useRef, useEffect, useMemo } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Menu, Search, Languages, Loader2, User, LogOut, LayoutDashboard, UserCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../store/authSlice"
import type { RootState } from "../store"
import { Button } from "./ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
} from "./ui/sheet"
import { useGetAllNewsQuery } from "../store/newsApiSlice"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"

const getLinks = (t: any) => [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.activities"), path: "/activities" },
    { name: t("nav.services"), path: "/services" },
    { name: t("nav.districts"), path: "/districts" },
    { name: t("nav.announcements"), path: "/announcements" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.contact"), path: "/contact" },
    { name: t("nav.helpCenter"), path: "/help-center" },
]

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const links = getLinks(t);

    const { data: allNews = [] } = useGetAllNewsQuery();

    const toggleLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const isActive = (path: string) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (searchOpen && inputRef.current) {
            inputRef.current.focus();
        } else {
            setSearchQuery("");
            setDebouncedQuery("");
        }
    }, [searchOpen]);

    // Debounce Logic
    useEffect(() => {
        if (searchQuery.trim().length >= 2) {
            setIsSearching(true);
            const handler = setTimeout(() => {
                setDebouncedQuery(searchQuery);
                setIsSearching(false);
            }, 400);
            return () => clearTimeout(handler);
        } else {
            setDebouncedQuery("");
            setIsSearching(false);
        }
    }, [searchQuery]);

    // Live results calculation
    const liveResults = useMemo(() => {
        if (debouncedQuery.trim().length < 2) return [];

        return allNews.filter(
            (n) => n.status === "Published" &&
                (n.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                    n.category.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                    (n.author?.name || "").toLowerCase().includes(debouncedQuery.toLowerCase()))
        ).slice(0, 6);
    }, [allNews, debouncedQuery]);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.trim().length >= 2) {
            const results = allNews.filter(
                (n) => n.status === "Published" &&
                    (n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        n.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (n.author?.name || "").toLowerCase().includes(searchQuery.toLowerCase()))
            );
            if (results.length > 0) {
                navigate(`/news/${results[0]._id}`);
            }
            setSearchOpen(false);
            setSearchQuery("");
            setDebouncedQuery("");
        }
    };

    const handleResultClick = (id: string) => {
        navigate(`/news/${id}`);
        setSearchOpen(false);
        setSearchQuery("");
        setDebouncedQuery("");
    };

    return (
        <header className="sticky top-0 z-40 w-full shadow-md transition-all duration-300">
            {/* Top Tier: Official Identity & Critical Actions */}
            <div className="bg-white border-b border-slate-100 py-2 lg:py-3">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mx-auto max-w-[1920px]">
                    <div className="flex items-center justify-between gap-3 lg:gap-8">
                        {/* Identity Module */}
                        <Link to="/" className="flex items-center gap-3 sm:gap-4 lg:gap-5 group min-w-0">
                            <div className="relative flex-shrink-0">
                                <img src="/photo_2026-03-09_14-35-44-removebg-preview.png" alt="Dept Seal" className="h-12 sm:h-14 lg:h-16 w-auto object-contain drop-shadow-md" />
                            </div>
                            <div className="flex flex-col min-w-0 justify-center">
                                <span className="text-[14px] sm:text-[16px] lg:text-[20px] font-[800] leading-[1.3] lg:leading-tight text-slate-800 group-hover:text-primary transition-colors pr-2">
                                    {t("nav.deptTitle")}
                                </span>
                                <span className="text-[8px] sm:text-[10px] lg:text-[12px] text-slate-500 font-bold tracking-[0.1em] lg:tracking-[0.15em] uppercase mt-0.5 opacity-90">
                                    {t("nav.deptSubtitle")}
                                </span>
                            </div>
                        </Link>

                        {/* Fast Actions Module */}
                        <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                            {/* Integrated Search */}
                            <div className="relative" ref={searchRef}>
                                <div className={`flex items-center bg-slate-50 border transition-all duration-300 rounded-xl px-3 py-1.5 ${searchOpen ? 'w-80 border-primary ring-2 ring-primary/10' : 'w-48 border-slate-200'}`}>
                                    <Search size={18} className="text-slate-400 shrink-0" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder={t("nav.searchPlaceholder")}
                                        value={searchQuery}
                                        onFocus={() => setSearchOpen(true)}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleSearch}
                                        className="ml-2 bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-full placeholder:text-slate-400"
                                    />
                                    {isSearching && <Loader2 size={14} className="animate-spin text-primary ml-2" />}
                                </div>

                                {/* Results Dropdown */}
                                {searchOpen && searchQuery.trim().length >= 2 && (
                                    <div className="absolute right-0 top-full mt-2 w-full bg-white shadow-2xl rounded-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        {liveResults.length === 0 && !isSearching ? (
                                            <div className="p-4 text-center text-sm text-slate-500 italic">{t("nav.noSearchRes")}</div>
                                        ) : (
                                            <div className="flex flex-col">
                                                {liveResults.map((news) => (
                                                    <button key={news._id} onClick={() => handleResultClick(news._id)} className="text-left p-4 hover:bg-slate-50 transition-colors border-b last:border-0 border-slate-100 group/item">
                                                        <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">{news.category}</div>
                                                        <div className="text-sm font-bold text-slate-900 leading-relaxed group-hover/item:text-primary transition-colors">{news.title}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="h-8 w-[1px] bg-slate-200 mx-1" />

                            {/* Language Selector */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all text-slate-600 group">
                                        <Languages size={18} className="group-hover:text-primary transition-colors" />
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

                            <div className="h-8 w-[1px] bg-slate-200 mx-1" />

                            {isAuthenticated ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-100 transition-all border border-slate-100 group">
                                            <div className="w-9 h-9 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center border-2 border-white group-hover:border-primary/20 transition-all">
                                                {user?.avatar ? (
                                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={20} className="text-primary" />
                                                )}
                                            </div>
                                            <div className="hidden xl:flex flex-col items-start">
                                                <span className="text-xs font-bold text-slate-800 line-clamp-1">{user?.name}</span>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                                    {user?.role === 3 ? "Root Admin" : user?.role === 2 ? "Admin" : user?.role === 1 ? "Staff" : "User"}
                                                </span>
                                            </div>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 rounded-2xl border-slate-200 shadow-2xl p-2 animate-in fade-in zoom-in-95">
                                        <div className="px-3 py-3 border-b border-slate-100 mb-1">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Session Active</p>
                                            <p className="text-sm font-bold text-slate-900 line-clamp-1">{user?.email}</p>
                                        </div>
                                        <DropdownMenuItem asChild>
                                            <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-primary/5 text-slate-700 font-bold text-sm transition-colors">
                                                <LayoutDashboard size={18} className="text-primary" />
                                                {t("nav.admin")}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link to="/admin/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-primary/5 text-slate-700 font-bold text-sm transition-colors">
                                                <UserCircle size={18} className="text-primary" />
                                                {t("nav.profileSettings")}
                                            </Link>
                                        </DropdownMenuItem>
                                        <div className="h-px bg-slate-100 my-1" />
                                        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-red-50 text-red-600 font-bold text-sm transition-colors">
                                            <LogOut size={18} />
                                            {t("nav.logout")}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button asChild className="font-bold px-6 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95 text-xs tracking-widest">
                                    <Link to="/login">LOGIN</Link>
                                </Button>
                            )}
                        </div>

                        {/* Mobile Controls */}
                        <div className="lg:hidden flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon" className="rounded-lg border-slate-200">
                                        <Languages size={20} className="text-slate-600" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-32 rounded-xl border-slate-200 shadow-xl">
                                    <DropdownMenuItem onClick={() => toggleLanguage('mm')} className="font-bold text-sm">မြန်မာ</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => toggleLanguage('en')} className="font-bold text-sm">ENGLISH</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-slate-600">
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[300px] p-0 border-l border-slate-200">
                                    <div className="p-4 border-b border-slate-100">
                                        <div className="relative">
                                            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                                                <Search size={18} className="text-slate-400 shrink-0" />
                                                <input
                                                    type="text"
                                                    placeholder={t("nav.searchPlaceholder")}
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && searchQuery.trim().length >= 2) {
                                                            const results = allNews.filter(
                                                                (n: any) => n.status === "Published" &&
                                                                    (n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                                        n.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                                        (n.author?.name || "").toLowerCase().includes(searchQuery.toLowerCase()))
                                                            );
                                                            if (results.length > 0) {
                                                                navigate(`/news/${results[0]._id}`);
                                                                setIsMobileMenuOpen(false);
                                                            }
                                                            setSearchQuery("");
                                                        }
                                                    }}
                                                    className="ml-2 bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-full placeholder:text-slate-400"
                                                />
                                                {isSearching && <Loader2 size={14} className="animate-spin text-primary ml-2" />}
                                            </div>

                                            {/* Mobile Results Dropdown */}
                                            {searchQuery.trim().length >= 2 && (
                                                <div className="absolute left-0 right-0 top-full mt-2 bg-white shadow-xl rounded-xl border border-slate-200 z-50 overflow-hidden">
                                                    {liveResults.length === 0 && !isSearching ? (
                                                        <div className="p-4 text-center text-sm text-slate-500 italic">{t("nav.noSearchRes")}</div>
                                                    ) : (
                                                        <div className="flex flex-col max-h-64 overflow-y-auto">
                                                            {liveResults.map((news) => (
                                                                <SheetClose asChild key={news._id}>
                                                                    <button onClick={() => handleResultClick(news._id)} className="text-left p-3 hover:bg-slate-50 transition-colors border-b last:border-0 border-slate-100 group/item">
                                                                        <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">{news.category}</div>
                                                                        <div className="text-xs font-bold text-slate-900 leading-relaxed group-hover/item:text-primary transition-colors line-clamp-2">{news.title}</div>
                                                                    </button>
                                                                </SheetClose>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-1">
                                        {links.map((link) => (
                                            <SheetClose asChild key={link.name}>
                                                <Link
                                                    to={link.path}
                                                    className={`flex items-center p-4 rounded-xl text-md font-bold transition-all ${isActive(link.path)
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-slate-600 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    {link.name}
                                                </Link>
                                            </SheetClose>
                                        ))}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-100 bg-white">
                                        {isAuthenticated ? (
                                            <div className="space-y-3">
                                                <Button asChild variant="outline" className="w-full py-6 rounded-xl font-bold flex items-center justify-center gap-2 border-slate-200">
                                                    <Link to="/admin">
                                                        <LayoutDashboard size={18} />
                                                        {t("nav.admin")}
                                                    </Link>
                                                </Button>
                                                <Button onClick={handleLogout} variant="destructive" className="w-full py-6 rounded-xl font-bold flex items-center justify-center gap-2">
                                                    <LogOut size={18} />
                                                    {t("nav.logout")}
                                                </Button>
                                            </div>
                                        ) : (
                                            <SheetClose asChild>
                                                <Button asChild className="w-full py-6 rounded-xl font-bold text-[16px]">
                                                    <Link to="/login">{t("nav.login")}</Link>
                                                </Button>
                                            </SheetClose>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Tier: Navigational Backbone */}
            <div className="bg-primary hidden lg:block border-b border-white/5">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mx-auto max-w-[1920px]">
                    <nav className="flex justify-between items-center h-12">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-8 h-full flex items-center text-[13px] font-bold tracking-[0.1em] uppercase transition-all relative group ${isActive(link.path)
                                    ? "text-primary bg-white shadow-[0_-4px_0_inset_currentColor]"
                                    : "text-white/80 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {link.name}
                                {/* Hover Indicator */}
                                <span className={`absolute bottom-0 left-0 w-full h-[3px] bg-primary transition-transform duration-300 origin-left ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    )
}
