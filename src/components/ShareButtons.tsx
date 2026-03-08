import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Facebook, Send, Copy, Check } from "lucide-react";

interface ShareButtonsProps {
    url: string;
    title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const shareUrl = encodeURIComponent(url);
    const shareTitle = encodeURIComponent(title);

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        telegram: `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`,
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-4 py-8 border-t border-border mt-12">
            <h4 className="text-sm font-bold text-foreground padauk-bold">{t("shareButtons.title")}</h4>
            <div className="flex items-center gap-3">
                <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                    title={t("shareButtons.shareFacebook")}
                >
                    <Facebook size={20} />
                </a>
                <a
                    href={shareLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#229ED9] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                    title={t("shareButtons.shareTelegram")}
                >
                    <Send size={20} />
                </a>
                <button
                    onClick={copyToClipboard}
                    className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md ${copied ? "bg-emerald-500 text-white" : "bg-secondary text-muted-foreground hover:bg-muted"
                        }`}
                    title={t("shareButtons.copyLink")}
                >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
            </div>
            {copied && (
                <p className="text-xs text-emerald-600 padauk-regular animate-in fade-in slide-in-from-left-2">
                    {t("shareButtons.linkCopied")}
                </p>
            )}
        </div>
    );
}
