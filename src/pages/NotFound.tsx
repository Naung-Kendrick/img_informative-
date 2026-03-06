import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    const { t } = useTranslation();
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 animate-in fade-in duration-500">
            <div className="text-center max-w-md">
                {/* Large 404 number */}
                <div className="relative mb-6">
                    <h1 className="text-[140px] sm:text-[180px] font-black text-slate-100 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-slate-50 border-2 border-[#808080]/20 flex items-center justify-center">
                            <span className="text-4xl">🔍</span>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 padauk-bold mb-3">
                    {t("notFound.title")}
                </h2>
                <p className="text-slate-500 padauk-regular mb-8 leading-relaxed whitespace-pre-line">
                    {t("notFound.desc")}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to="/"
                        className="flex items-center gap-2 px-6 py-3 bg-[#808080] text-white font-bold rounded-xl hover:bg-[#555555] transition-colors shadow-md shadow-[#808080]/20 padauk-bold"
                    >
                        <Home size={18} />
                        {t("notFound.home")}
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors padauk-bold"
                    >
                        <ArrowLeft size={18} />
                        {t("notFound.back")}
                    </button>
                </div>
            </div>
        </div>
    );
}

