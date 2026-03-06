import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
    const { t } = useTranslation()
    return (
        <footer className="w-full bg-slate-900 pt-16 pb-8 text-slate-200 border-t border-slate-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 border-b border-slate-800 pb-12 mb-8">

                    {/* Logo & About */}
                    <div className="flex flex-col gap-6">
                        <Link to="/" className="flex items-center gap-3 w-fit">
                            <img src="/logo2-removebg-preview.png" alt="logo2" className="h-11 w-16 bg-transparent" />
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-400 font-medium">Ta'ang Land Federal Unit Government of Immigration</span>
                            </div>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            {t("footer.about")}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-primary text-slate-400 hover:text-white transition-all duration-300">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-primary text-slate-400 hover:text-white transition-all duration-300">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-primary text-slate-400 hover:text-white transition-all duration-300">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-5">
                        <h3 className="text-lg font-bold text-white mb-2 relative inline-block">
                            {t("footer.quickLinks")}
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
                        </h3>
                        <ul className="flex flex-col gap-3">
                            <li>
                                <Link to="/" className="text-slate-400 hover:text-primary hover:translate-x-1 inline-block transition-all duration-300 text-sm font-medium">{t("nav.home")}</Link>
                            </li>
                            <li>
                                <Link to="/activities" className="text-slate-400 hover:text-primary hover:translate-x-1 inline-block transition-all duration-300 text-sm font-medium">{t("nav.activities")}</Link>
                            </li>
                            <li>
                                <Link to="/services" className="text-slate-400 hover:text-primary hover:translate-x-1 inline-block transition-all duration-300 text-sm font-medium">{t("nav.services")}</Link>
                            </li>
                            <li>
                                <Link to="/districts" className="text-slate-400 hover:text-primary hover:translate-x-1 inline-block transition-all duration-300 text-sm font-medium">{t("nav.districts")}</Link>
                            </li>
                            <li>
                                <Link to="/announcements" className="text-slate-400 hover:text-primary hover:translate-x-1 inline-block transition-all duration-300 text-sm font-medium">{t("nav.announcements")}</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-5 lg:col-span-2">
                        <h3 className="text-lg font-bold text-white mb-2 relative inline-block">
                            {t("footer.contact")}
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-800">
                                <MapPin className="text-primary shrink-0 mt-1" size={24} />
                                <div className="flex flex-col gap-1 text-sm">
                                    <span className="font-bold text-white">{t("footer.location")}</span>
                                    <span className="text-slate-400">{t("footer.address")}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-slate-800 text-primary">
                                        <Phone size={18} />
                                    </div>
                                    <div className="flex flex-col text-sm">
                                        <span className="text-slate-400 font-medium tracking-wider">+95 9 123 456 789</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-slate-800 text-primary">
                                        <Mail size={18} />
                                    </div>
                                    <div className="flex flex-col text-sm">
                                        <span className="text-slate-400 font-medium">info@taangnews.org</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Copyright */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 text-center tracking-wider">
                    <p>{t("footer.copyright")}</p>
                    <div className="flex gap-6">
                        <Link to="#" className="hover:text-white transition-colors">{t("footer.privacy")}</Link>
                        <Link to="#" className="hover:text-white transition-colors">{t("footer.terms")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
