import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    const { t } = useTranslation();
    return (
        <div className="page-container bg-background min-h-[70vh] flex items-center justify-center px-4 animate-in fade-in duration-500">
            <div className="text-center max-w-md">
                {/* Large 404 number */}
                <div className="relative mb-6">
                    <h1 className="text-[140px] sm:text-[180px] font-black text-secondary leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-card border-2 border-border flex items-center justify-center shadow-xl">
                            <span className="text-4xl">🔍</span>
                        </div>
                    </div>
                </div>

                <h2 className="h2 mb-3">
                    {t("notFound.title")}
                </h2>
                <p className="p-muted mb-8 whitespace-pre-line">
                    {t("notFound.desc")}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to="/"
                        className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 p-small"
                    >
                        <Home size={18} />
                        {t("notFound.home")}
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-8 py-4 bg-secondary text-foreground font-bold rounded-lg border border-border hover:bg-background transition-all p-small"
                    >
                        <ArrowLeft size={18} />
                        {t("notFound.back")}
                    </button>
                </div>
            </div>
        </div>
    );
}

