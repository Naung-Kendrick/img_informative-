import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetAllNewsQuery } from "../store/newsApiSlice";
import { Search as SearchIcon, X, Calendar, ArrowRight, Loader2 } from "lucide-react";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const { data: allNews = [], isLoading } = useGetAllNewsQuery();

    // Filter published news by query
    const results = useMemo(() => {
        return query.trim().length >= 2
            ? allNews.filter(
                (n) =>
                    n.status === "Published" &&
                    (n.title.toLowerCase().includes(query.toLowerCase()) ||
                        n.category.toLowerCase().includes(query.toLowerCase()) ||
                        (n.author?.name || "").toLowerCase().includes(query.toLowerCase()))
            ).slice(0, 8) // Max 8 results
            : [];
    }, [query, allNews]);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setQuery("");
            setSelectedIndex(-1);
        }
    }, [isOpen]);

    // Reset selection when query changes
    useEffect(() => {
        setSelectedIndex(-1);
    }, [query]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }

            if (results.length > 0) {
                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
                } else if (e.key === "Enter") {
                    if (selectedIndex >= 0 && selectedIndex < results.length) {
                        e.preventDefault();
                        navigate(`/news/${results[selectedIndex]._id}`);
                        onClose();
                    } else if (query.trim().length >= 2) {
                        // User pressed enter without selecting, you could navigate to a full search page if one existed
                    }
                }
            }
        };

        if (isOpen) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose, results, selectedIndex, navigate, query]);

    // Scroll selected item into view
    useEffect(() => {
        if (selectedIndex >= 0) {
            const el = document.getElementById(`search-result-${selectedIndex}`);
            if (el) el.scrollIntoView({ block: "nearest" });
        }
    }, [selectedIndex]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.7)] border border-slate-800 ring-1 ring-white/5 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-8 duration-300 ease-out"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80 bg-slate-900/50">
                    <SearchIcon size={22} className="text-primary shrink-0 drop-shadow-sm" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t("searchModal.placeholder")}
                        className="flex-1 bg-transparent text-white text-[17px] sm:text-lg focus:outline-none padauk-regular placeholder:text-slate-500/80 tracking-wide"
                    />
                    {query && (
                        <button onClick={() => setQuery("")} className="text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors p-1.5 rounded-md">
                            <X size={16} />
                        </button>
                    )}
                    <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-1 bg-slate-800/80 text-slate-400 text-[10px] font-mono font-bold rounded-md border border-slate-700 shadow-sm uppercase tracking-wider">
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div className="max-h-[55vh] overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-4">
                            <Loader2 size={32} className="text-primary animate-spin" />
                            <p className="text-sm text-slate-400 padauk-regular animate-pulse">Searching...</p>
                        </div>
                    ) : query.trim().length < 2 ? (
                        <div className="py-20 flex flex-col justify-center items-center text-slate-500">
                            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex flex-col items-center justify-center mb-4 border border-slate-700/50 shadow-inner">
                                <SearchIcon size={28} className="text-slate-400 opacity-80" />
                            </div>
                            <p className="padauk-regular text-[15px] opacity-90 tracking-wide">{t("searchModal.hint")}</p>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="py-20 flex flex-col justify-center items-center text-slate-400">
                            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-700/50 shadow-inner">
                                <X size={28} className="text-slate-500" />
                            </div>
                            <p className="padauk-bold text-lg text-slate-300 mb-1">{t("searchModal.noResults")}</p>
                            <p className="padauk-regular text-sm text-slate-500">
                                {t("searchModal.noResultsDesc")} <span className="text-primary">"{query}"</span>
                            </p>
                        </div>
                    ) : (
                        <div className="py-2">
                            <p className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/50 bg-slate-900/20">
                                {results.length} {t("searchModal.found")}
                            </p>
                            <div className="p-2 space-y-1">
                                {results.map((news, index) => (
                                    <Link
                                        key={news._id}
                                        id={`search-result-${index}`}
                                        to={`/news/${news._id}`}
                                        onClick={onClose}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${selectedIndex === index
                                            ? "bg-slate-800/80 ring-1 ring-inset ring-primary/40 shadow-lg"
                                            : "hover:bg-slate-800/40 transparent"
                                            }`}
                                    >
                                        {/* Thumbnail */}
                                        {news.images && news.images.length > 0 ? (
                                            <div className="relative shrink-0 overflow-hidden rounded-lg shadow-sm border border-slate-700/50">
                                                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                                                <img loading="lazy"
                                                    src={news.images[0]}
                                                    alt=""
                                                    className="w-16 h-12 object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-12 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/50 shadow-inner">
                                                <SearchIcon size={16} className="text-slate-500" />
                                            </div>
                                        )}

                                        {/* Text */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <p className={`text-[15px] font-bold padauk-bold line-clamp-1 transition-colors ${selectedIndex === index ? "text-white" : "text-slate-300 group-hover:text-white"
                                                }`}>
                                                {news.title}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1.5 text-[11px] font-medium text-slate-400">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${selectedIndex === index
                                                    ? "bg-primary/20 text-primary border-primary/30"
                                                    : "bg-slate-800 text-slate-400 border-slate-700 group-hover:text-primary group-hover:border-primary/20"
                                                    }`}>
                                                    {news.category}
                                                </span>
                                                <span className="flex items-center gap-1.5 opacity-80">
                                                    <Calendar size={11} className={selectedIndex === index ? "text-primary" : ""} />
                                                    {new Date(news.createdAt).toLocaleDateString("en-GB")}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 shrink-0 ${selectedIndex === index ? "bg-primary shadow-md shadow-primary/20 text-white" : "bg-transparent text-slate-600 group-hover:text-slate-400 group-hover:bg-slate-700/50"
                                            }`}>
                                            <ArrowRight size={16} className={selectedIndex === index ? "translate-x-0.5" : ""} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer hint */}
                <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="padauk-regular flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary/80 animate-pulse"></span>
                        Powered by RTK Query
                    </span>
                    <span className="hidden sm:flex items-center gap-2">
                        {t("searchModal.navigationHint")}
                        <div className="flex items-center gap-1">
                            <span className="flex items-center justify-center w-4 h-4 rounded bg-slate-800 border border-slate-700 text-[8px] font-mono leading-none">↑</span>
                            <span className="flex items-center justify-center w-4 h-4 rounded bg-slate-800 border border-slate-700 text-[8px] font-mono leading-none">↓</span>
                            <span className="flex items-center justify-center h-4 px-1.5 rounded bg-slate-800 border border-slate-700 text-[8px] font-mono leading-none uppercase">Enter</span>
                        </div>
                    </span>
                </div>
            </div>
        </div>
    );
}
