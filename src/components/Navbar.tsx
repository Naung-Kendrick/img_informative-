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
        <header className="sticky top-0 z-40 w-full border-b border-border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-300">
            <div className="container-custom">
                <div className="flex h-20 items-center justify-between gap-8">

                    {/* Left: Department Emblem & Identity */}
                    <div className="flex items-center gap-4 flex-shrink-0 min-w-0">
                        <img src="/logo1-removebg-preview.png" alt="Dept Emblem" className="h-12 w-auto flex-shrink-0" />
                        <Link to="/" className="flex flex-col min-w-0 group">
                            <span className="text-base lg:text-lg font-bold leading-tight text-foreground tracking-tight truncate xl:whitespace-normal group-hover:text-primary transition-colors">
                                တအာင်းပြည် ဖက်ဒရယ်ယူနစ် အစိုးရ လူဝင်မှုကြီးကြပ်‌ရေး ဌာန
                            </span>
                            <span className="text-[11px] lg:text-[12px] text-muted-foreground font-semibold tracking-wider uppercase truncate xl:whitespace-normal">
                                Ta'ang Land Federal Unit Government of Immigration
                            </span>
                        </Link>
                    </div>

                    {/* Center: Authoritative Navigation */}
                    <nav className="hidden xl:flex items-center gap-1">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-4 py-2 rounded-sm text-[14px] font-semibold tracking-wide transition-all ${isActive(link.path)
                                    ? "text-primary bg-primary/5"
                                    : "text-foreground/70 hover:text-primary hover:bg-slate-50"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right: Functional Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Search Module */}
                        <div className="hidden sm:flex relative items-center" ref={searchRef}>
                            <div className={`flex items-center overflow-hidden transition-all duration-300 rounded-lg border ${searchOpen ? 'w-64 border-primary px-3' : 'w-10 border-transparent'}`}>
                                <Search size={18} className="text-muted-foreground shrink-0 cursor-pointer" onClick={() => setSearchOpen(!searchOpen)} />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search News..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    className={`ml-2 h-9 bg-transparent border-none focus:ring-0 text-sm w-full transition-opacity ${searchOpen ? 'opacity-100' : 'opacity-0'}`}
                                />
                            </div>
                            {/* Live Results Dropdown */}
                            {searchOpen && searchQuery.trim().length >= 2 && (
                                <div className="absolute right-0 top-full mt-2 w-80 bg-white shadow-2xl rounded-sm border border-border z-50 p-2 animate-in fade-in slide-in-from-top-2">
                                    {isSearching ? (
                                        <div className="p-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                                            <Loader2 size={14} className="animate-spin" /> Searching...
                                        </div>
                                    ) : liveResults.length === 0 ? (
                                        <div className="p-4 text-center text-xs text-muted-foreground italic">No results found.</div>
                                    ) : (
                                        <div className="flex flex-col gap-1">
                                            {liveResults.map((news) => (
                                                <button key={news._id} onClick={() => handleResultClick(news._id)} className="text-left p-3 hover:bg-slate-50 rounded-sm transition-colors border-b last:border-0 border-slate-100">
                                                    <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">{news.category}</div>
                                                    <div className="text-sm font-bold text-foreground leading-tight line-clamp-2">{news.title}</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Language Selector */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-primary hover:bg-primary/5">
                                    <Languages className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32 rounded-sm border-border shadow-2xl">
                                <DropdownMenuItem onClick={() => toggleLanguage('mm')} className="font-bold text-sm cursor-pointer hover:bg-primary/5 hover:text-primary py-2.5">မြန်မာ</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleLanguage('en')} className="font-bold text-sm cursor-pointer hover:bg-primary/5 hover:text-primary py-2.5">ENGLISH</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden sm:block" />

                        <Button asChild className="hidden sm:inline-flex bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-widest text-xs px-6 rounded-sm shadow-md transition-all active:scale-95">
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

