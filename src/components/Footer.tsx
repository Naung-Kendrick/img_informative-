import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-slate-950 text-slate-300 border-t border-slate-900">
            {/* Main Footer Content */}
            <div className="container-custom py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

                    {/* Column 1: Department Identity */}
                    <div className="flex flex-col gap-6 lg:col-span-1">
                        <div className="flex items-center gap-4">
                            <img src="/logo1-removebg-preview.png" alt="Dept Seal" className="h-14 w-auto grayscale brightness-200 contrast-125" />
                            <div className="flex flex-col">
                                <span className="text-white font-bold leading-tight tracking-tight uppercase text-sm">Immigration Department</span>
                                <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">Ta'ang Land Federal Unit</span>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-400">
                            The official portal for immigration services, news, and policy updates of the Ta'ang Land Federal Unit. Committed to security, transparency, and public service excellence.
                        </p>
                        <div className="flex items-center gap-3">
                            {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                                <a key={idx} href="#" className="h-10 w-10 flex items-center justify-center rounded-sm bg-slate-900 border border-slate-800 hover:bg-primary hover:border-primary text-slate-400 hover:text-white transition-all duration-300">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="flex flex-col gap-8">
                        <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                            Navigation Center
                            <span className="w-8 h-[1px] bg-primary"></span>
                        </h4>
                        <ul className="flex flex-col gap-4">
                            {["home", "activities", "services", "districts", "announcements"].map((item) => (
                                <li key={item}>
                                    <Link to={`/${item === "home" ? "" : item}`} className="text-sm font-semibold hover:text-primary transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-3 h-[1px] bg-primary transition-all duration-300 mr-0 group-hover:mr-2"></span>
                                        {t(`nav.${item}`)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 & 4: Contact & Location */}
                    <div className="flex flex-col gap-8 lg:col-span-2">
                        <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                            Contact Information
                            <span className="w-8 h-[1px] bg-primary"></span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="flex gap-4">
                                <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-sm bg-slate-900 border border-slate-800 text-primary">
                                    <MapPin size={22} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm font-bold text-white uppercase tracking-wider">{t("footer.location")}</span>
                                    <span className="text-sm leading-relaxed text-slate-400">{t("footer.address")}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4 group">
                                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-sm bg-slate-900 border border-slate-800 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <Phone size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{t("footer.phone")}</span>
                                        <span className="text-sm font-bold text-slate-300">+95 9 123 456 789</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-sm bg-slate-900 border border-slate-800 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <Mail size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{t("footer.email")}</span>
                                        <span className="text-sm font-bold text-slate-300">contact@immigration.tlfug.gov</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Ethics & Copyright */}
            <div className="border-t border-slate-900 py-8 bg-slate-950/50">
                <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                        &copy; {new Date().getFullYear()} Ta'ang Land Federal Unit Immigration. All Rights Reserved.
                    </div>
                    <div className="flex gap-8">
                        {["Privacy Policy", "Terms of Service", "Accessibility"].map((policy) => (
                            <a key={policy} href="#" className="text-[11px] font-bold text-slate-600 hover:text-primary uppercase tracking-[0.1em] transition-colors">{policy}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
