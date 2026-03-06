import { useState, useRef, useEffect, useMemo } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Menu, Search, Languages, Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "./ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
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
    { name: t("nav.contact"), path: "/contact" },
]

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    // Theme context removed; theme toggle will be handled later if needed
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const links = getLinks(t);

    const { data: allNews = [], isError } = useGetAllNewsQuery();

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
            }, 400); // 400ms debounce
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
        ).slice(0, 6); // Max 6 results
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
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 sm:h-20 items-center justify-between">

                    {/* Left: Logo Area */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 xl:flex-shrink min-w-0">
                        <img src="/logo1-removebg-preview.png" alt="logo1" className="h-10 w-auto sm:h-12 flex-shrink-0" />
                        <Link to="/" className="flex items-center gap-2 group flex-shrink min-w-0">
                            <div className="hidden sm:flex flex-col flex-shrink min-w-0">
                                <span className="text-sm lg:text-base xl:text-lg font-bold leading-tight text-foreground tracking-wide truncate xl:whitespace-normal">
                                    တအာင်းပြည် ဖက်ဒရယ်ယူနစ် အစိုးရ လူဝင်မှုကြီးကြပ်‌ရေး ဌာန
                                </span>
                                <span className="text-[10px] lg:text-[11px] xl:text-xs text-muted-foreground font-medium tracking-wider truncate xl:whitespace-normal">
                                    Ta'ang Land Federal Unit Government of Immigration
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Center: Desktop Links */}
                    <nav className="hidden xl:flex items-center justify-center gap-5 lg:gap-6 flex-1 px-4">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`relative whitespace-nowrap text-[14px] xl:text-[15px] font-semibold transition-colors ${isActive(link.path)
                                    ? "text-primary"
                                    : "text-foreground/80 hover:text-primary"
                                    }`}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <span className="absolute -bottom-[1.35rem] left-0 right-0 h-[3px] bg-primary rounded-t-full" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                        {/* Language Switcher */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary p-2">
                                    <Languages className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32 rounded-xl">
                                <DropdownMenuItem onClick={() => toggleLanguage('mm')} className="font-semibold cursor-pointer py-2 px-3">
                                    မြန်မာ
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleLanguage('en')} className="font-semibold cursor-pointer py-2 px-3">
                                    English
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Theme toggle removed to revert to original behavior */}

                        {/* Search Dropdown */}
                        <div className="relative" ref={searchRef}>
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="text-foreground/80 hover:text-primary transition-colors hidden sm:flex items-center justify-center p-2"
                            >
                                <Search className="h-5 w-5" />
                            </button>

                            {searchOpen && (
                                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-2 bg-background shadow-xl rounded-xl border border-border z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="သတင်းများကို ရှာရန်..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleSearch}
                                        className="flex h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 padauk-regular"
                                    />

                                    {/* Live Results Dropdown */}
                                    {searchQuery.trim().length >= 2 && (
                                        <div className="max-h-64 overflow-y-auto mt-2 flex flex-col gap-1 padauk-regular custom-scrollbar">
                                            {isError ? (
                                                <div className="p-4 text-center text-sm text-red-500 font-medium">
                                                    အမှားအယွင်းဖြစ်ပွားခဲ့ပါသည်
                                                </div>
                                            ) : isSearching ? (
                                                <div className="flex items-center justify-center p-4 text-sm text-slate-500 gap-2 font-medium">
                                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                                    <span>ရှာဖွေနေပါသည်...</span>
                                                </div>
                                            ) : liveResults.length === 0 ? (
                                                <div className="p-4 text-center text-sm text-slate-500 font-medium">
                                                    ရှာဖွေမှု မတွေ့ရှိပါ
                                                </div>
                                            ) : (
                                                <div className="py-1">
                                                    {liveResults.map((news) => (
                                                        <div
                                                            key={news._id}
                                                            onClick={() => handleResultClick(news._id)}
                                                            className="hover:bg-slate-100 p-2.5 rounded-md cursor-pointer transition-colors flex flex-col gap-1.5 group"
                                                        >
                                                            <span className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                                                {news.title}
                                                            </span>
                                                            <span className="inline-block px-1.5 py-0.5 bg-primary/10 border border-primary/20 text-primary rounded text-[10px] uppercase font-bold w-fit tracking-wider">
                                                                {news.category}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <Button asChild className="hidden sm:inline-flex bg-primary text-white hover:bg-primary/90 font-semibold tracking-wide shadow-sm rounded-lg px-4 xl:px-6 text-sm xl:text-base whitespace-nowrap">
                            <Link to="/login">{t("nav.login")}</Link>
                        </Button>

                        {/* Theme toggle removed to revert to original behavior */}

                        {/* Mobile Menu */}
                        <div className="xl:hidden flex items-center">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-slate-700 hover:bg-slate-100">
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[300px] sm:w-[350px] p-6">
                                    <SheetTitle className="sr-only">Main Menu</SheetTitle>
                                    <div className="flex flex-col gap-8 mt-8">
                                        <nav className="flex flex-col gap-4">
                                            {links.map((link) => (
                                                <Link
                                                    key={link.name}
                                                    to={link.path}
                                                    className={`text-lg font-bold transition-colors pb-2 border-b border-slate-100 ${isActive(link.path)
                                                        ? "text-primary border-primary/30"
                                                        : "text-slate-800 hover:text-primary"
                                                        }`}
                                                >
                                                    {link.name}
                                                </Link>
                                            ))}
                                        </nav>
                                        <div className="flex flex-col gap-4 mt-auto">
                                            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold rounded-xl">
                                                <Link to="/login">{t("nav.login")}</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    )
}

