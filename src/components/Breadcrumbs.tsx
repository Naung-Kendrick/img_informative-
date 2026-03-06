import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    const { t } = useTranslation();
    return (
        <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-500 mb-6 flex-wrap padauk-regular">
            <Link
                to="/"
                className="flex items-center gap-1 hover:text-[#808080] transition-colors"
                title={t("breadcrumbs.homeTitle")}
            >
                <Home size={14} />
                <span className="hidden sm:inline">{t("breadcrumbs.home")}</span>
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <ChevronRight size={12} className="text-slate-300" />
                    {item.path ? (
                        <Link
                            to={item.path}
                            className="hover:text-[#808080] transition-colors whitespace-nowrap"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-slate-900 font-bold line-clamp-1 padauk-bold max-w-[200px] md:max-w-xs">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
}
