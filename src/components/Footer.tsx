import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { useGetContactInfoQuery } from "../store/contactInfoApiSlice"

const Footer = () => {
    const { t, i18n } = useTranslation();
    const { data: info } = useGetContactInfoQuery();
    const currentLang = i18n.language || "mm";

    return (
        <footer className="bg-foreground text-background/80 border-t border-background/10">
            {/* Main Footer Content */}
            <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mx-auto max-w-[1920px] py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

                    {/* Column 1: Department Identity */}
                    <div className="flex flex-col gap-6 lg:col-span-1">
                        <div className="flex items-center gap-4">
                            <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white/20 shrink-0">
                                <img src="/photo_2026-03-09_14-35-44-removebg-preview.png" alt="Dept Seal" className="h-16 w-16 object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-background font-bold leading-tight tracking-tight uppercase text-sm">Immigration Department</span>
                                <span className="p-small text-primary">Ta'ang Land Federal Unit Government</span>
                            </div>
                        </div>
                        <p className="p-muted text-background/60 leading-relaxed">
                            The official portal for immigration services, news, and policy updates of the Ta'ang Land Federal Unit Government. Committed to security, transparency, and public service excellence.
                        </p>
                        <div className="flex items-center gap-3">
                            {info?.facebook && (
                                <a href={info.facebook} target="_blank" rel="noreferrer" className="h-10 w-10 flex items-center justify-center rounded-sm bg-background/5 border border-background/10 hover:bg-primary hover:border-primary text-background/50 hover:text-background transition-all duration-300">
                                    <Facebook size={18} />
                                </a>
                            )}
                            {info?.twitter && (
                                <a href={info.twitter} target="_blank" rel="noreferrer" className="h-10 w-10 flex items-center justify-center rounded-sm bg-background/5 border border-background/10 hover:bg-primary hover:border-primary text-background/50 hover:text-background transition-all duration-300">
                                    <Twitter size={18} />
                                </a>
                            )}
                            {info?.instagram && (
                                <a href={info.instagram} target="_blank" rel="noreferrer" className="h-10 w-10 flex items-center justify-center rounded-sm bg-background/5 border border-background/10 hover:bg-primary hover:border-primary text-background/50 hover:text-background transition-all duration-300">
                                    <Instagram size={18} />
                                </a>
                            )}
                            {!info && [Facebook, Twitter, Instagram].map((Icon, idx) => (
                                <a key={idx} href="#" className="h-10 w-10 flex items-center justify-center rounded-sm bg-background/5 border border-background/10 hover:bg-primary hover:border-primary text-background/50 hover:text-background transition-all duration-300">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="flex flex-col gap-8">
                        <h4 className="text-background p-small flex items-center gap-2">
                            Navigation Center
                            <span className="w-8 h-[1px] bg-primary"></span>
                        </h4>
                        <ul className="flex flex-col gap-4">
                            {["home", "activities", "services", "districts", "announcements", "help-center"].map((item) => (
                                <li key={item}>
                                    <Link to={`/${item === "home" ? "" : item}`} className="text-sm font-semibold hover:text-primary transition-colors flex items-center group">
                                        <span className="w-0 group-hover:w-3 h-[1px] bg-primary transition-all duration-300 mr-0 group-hover:mr-2"></span>
                                        {t(`nav.${item === "help-center" ? "helpCenter" : item}`)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 & 4: Contact & Location */}
                    <div className="flex flex-col gap-8 lg:col-span-2">
                        <h4 className="text-background p-small flex items-center gap-2">
                            Contact Information
                            <span className="w-8 h-[1px] bg-primary"></span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="flex gap-4">
                                <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-sm bg-background/5 border border-background/10 text-primary">
                                    <MapPin size={22} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm font-bold text-background uppercase tracking-wider">{t("footer.location")}</span>
                                    <span className="text-sm leading-relaxed text-background/60">
                                        {info ? (currentLang === 'en' ? info.address_en : info.address_mm) : t("footer.address")}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4 group">
                                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-sm bg-background/5 border border-background/10 text-primary group-hover:bg-primary group-hover:text-background transition-all">
                                        <Phone size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="p-small text-background/40">{t("footer.phone")}</span>
                                        <span className="text-sm font-bold text-background/80">{info?.phone || "+95 9 123 456 789"}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-sm bg-background/5 border border-background/10 text-primary group-hover:bg-primary group-hover:text-background transition-all">
                                        <Mail size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="p-small text-background/40">{t("footer.email")}</span>
                                        <span className="text-sm font-bold text-background/80">{info?.email || "contact@immigration.tlfug.gov"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Ethics & Copyright */}
            <div className="border-t border-background/10 py-8 bg-black/20">
                <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mx-auto max-w-[1920px] flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="p-small text-background/40">
                        &copy; {new Date().getFullYear()} Ta'ang Land Federal Unit Government Of Immigration Department. All Rights Reserved.
                    </div>
                    <div className="flex gap-8">
                        <Link to="/privacy-policy" className="p-small text-background/40 hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link to="/terms-of-service" className="p-small text-background/40 hover:text-primary transition-colors">Terms of Service</Link>
                        <Link to="/accessibility" className="p-small text-background/40 hover:text-primary transition-colors">Accessibility</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
