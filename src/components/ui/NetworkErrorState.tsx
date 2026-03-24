import { Building } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NetworkErrorState() {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl shadow-sm border border-destructive/20 max-w-3xl mx-auto text-center w-full my-8">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4 mx-auto">
                <Building size={32} />
            </div>
            <h2 className="h4 mb-2">{t("districts.networkError")}</h2>
            <p className="p-muted">{t("districts.networkErrorDesc")}</p>
        </div>
    );
}
