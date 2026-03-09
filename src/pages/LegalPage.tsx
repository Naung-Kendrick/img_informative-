import { useParams, Link, useLocation } from "react-router-dom";
import { Shield, Scale, Accessibility as AccessibilityIcon, ArrowLeft, Download, ExternalLink, ScrollText } from "lucide-react";

const LegalPage = () => {
    const { type: paramType } = useParams();
    const location = useLocation();

    // Determine type from either param or direct path mapping
    const type = paramType || location.pathname.split("/").pop();

    const getLegalContent = () => {
        switch (type) {
            case "privacy-policy":
                return {
                    title: "Privacy & Data Protection Policy",
                    subtitle: "In accordance with Section 12 (Data Sovereignty) of the 2025 Immigration Laws.",
                    icon: <Shield className="w-8 h-8 text-primary" />,
                    content: (
                        <div className="space-y-8 padauk-regular">
                            <section>
                                <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4 padauk-bold">
                                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">01</span>
                                    Authority of the State
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Under the <strong className="text-foreground">Ta'ang Land Federal Immigration Act of 2025</strong>, the Department reserves the absolute right to collect, store, and process personal identification data, including but not limited to biometrics (facial recognition, fingerprinting), genealogical records, and geographic movement logs. This data is considered a national security asset.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4 padauk-bold">
                                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">02</span>
                                    Citizen Responsibilities
                                </h3>
                                <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                                    <li>Citizens and residents are legally mandated to provided accurate, non-fraudulent information at all times (Section 4, Clause B).</li>
                                    <li>Any change in residency, marital status, or primary contact information must be updated via this portal within 48 hours.</li>
                                    <li>Failure to report changes constitutes an administrative offense punishable under Section 89 of the Penal Code.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4 padauk-bold">
                                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">03</span>
                                    Data Sharing & Security
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Your data may be synchronized with the Federal Ministry of Security and Local District Councils for the purpose of law enforcement and administrative service delivery. The Department utilizes military-grade encryption to protect all digital identities against external cyber-threats.
                                </p>
                            </section>

                            <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl italic text-primary/80 text-sm">
                                "The security of the individual's data is secondary only to the security of the Federal Unit." — Preamble, 2025 Departmental Manual.
                            </div>
                        </div>
                    )
                };

            case "terms-of-service":
                return {
                    title: "Portal Terms of Service",
                    subtitle: "Legal agreement governing the usage of Federal Digital Assets (v2025.1).",
                    icon: <Scale className="w-8 h-8 text-primary" />,
                    content: (
                        <div className="space-y-8 padauk-regular">
                            <section>
                                <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4 padauk-bold">
                                    Federal Digital Conduct
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    By accessing this portal, users agree to abide by the <strong className="text-foreground">Federal Digital Ethics Code</strong>. The portal is provided as a government service for law-abiding citizens. Any attempt to reverse-engineer, scrape, or perform unauthorized penetration testing on this infrastructure is a federal crime.
                                </p>
                            </section>

                            <section className="bg-foreground/[0.02] p-6 rounded-2xl border border-border">
                                <h4 className="font-bold text-foreground mb-3 uppercase tracking-widest text-xs">Article 4: Right of Refusal</h4>
                                <p className="text-sm text-muted-foreground italic">
                                    The Ta'ang Land Federal Unit Government Of Immigration Department reserves the right to terminate access to digital services for any user suspected of affiliation with non-recognized entities or those found in violation of Section 66 (Anti-state propaganda) of the Civil Code.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-foreground mb-4 padauk-bold">User Obligations</h3>
                                <p className="text-muted-foreground mb-4">Users are responsible for the security of their login credentials. Any action taken via a verified account is legally attributed to the account holder.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 border border-border rounded-xl">
                                        <span className="block font-bold text-foreground text-sm mb-1">Authenticity</span>
                                        <span className="text-xs text-muted-foreground text-pretty">Users must use their legal name as registered in the Federal Database.</span>
                                    </div>
                                    <div className="p-4 border border-border rounded-xl">
                                        <span className="block font-bold text-foreground text-sm mb-1">Non-Transferability</span>
                                        <span className="text-xs text-muted-foreground text-pretty">Government portal accounts cannot be shared with third parties.</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )
                };

            case "accessibility":
                return {
                    title: "Accessibility Standards",
                    subtitle: "Ensuring digital equality for all citizens under the 2025 Inclusion Mandate.",
                    icon: <AccessibilityIcon className="w-8 h-8 text-primary" />,
                    content: (
                        <div className="space-y-8 padauk-regular">
                            <section>
                                <h3 className="text-xl font-bold text-foreground mb-4 padauk-bold">Inclusion Commitment</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    The Ta'ang Land Immigration Department recognizes that information is a right. Under the <strong className="text-foreground">2025 Digital Equity Initiative</strong>, this portal is designed to be accessible to citizens of all physical and cognitive abilities.
                                </p>
                            </section>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="flex gap-4 p-5 rounded-2xl bg-secondary/50 border border-border items-start">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary"><ScrollText size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-foreground text-sm">Multilingual Support</h4>
                                        <p className="text-xs text-muted-foreground mt-1">Full support for Ta'ang (Palaung), Myanmar, and English languages to ensure no citizen is left behind.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-5 rounded-2xl bg-secondary/50 border border-border items-start">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary"><AccessibilityIcon size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-foreground text-sm">Assistive Technologies</h4>
                                        <p className="text-xs text-muted-foreground mt-1">Compatibility with screen readers, keyboard navigation, and high-contrast modes.</p>
                                    </div>
                                </div>
                            </div>

                            <section className="pt-8 border-t border-border">
                                <h3 className="text-lg font-bold text-foreground mb-2 padauk-bold">Reporting Failures</h3>
                                <p className="text-sm text-muted-foreground">
                                    If you encounter an accessibility barrier, please report it via our <Link to="/contact" className="text-primary hover:underline">Contact Center</Link>. Reports are audited monthly by the Federal Inclusion Council.
                                </p>
                            </section>
                        </div>
                    )
                };

            default:
                return { title: "Legal Documents", subtitle: "", content: null, icon: null };
        }
    };

    const legal = getLegalContent();

    if (!legal.content) return <div className="container-custom py-20">Document Not Found</div>;

    return (
        <main className="bg-background min-h-screen pt-28 pb-20">
            <div className="container-custom max-w-4xl">
                {/* Header Section */}
                <div className="relative mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors mb-6 uppercase tracking-widest">
                        <ArrowLeft size={14} /> Back to Portal
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="p-5 bg-card border border-border rounded-[2rem] shadow-sm">
                            {legal.icon}
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2 block">Official State Document</span>
                            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase italic">{legal.title}</h1>
                            <p className="text-muted-foreground mt-2 text-lg">{legal.subtitle}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8 bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
                        {/* Legal Watermark Background */}
                        <div className="absolute top-20 right-[-10%] opacity-[0.03] pointer-events-none select-none -rotate-12">
                            <img src="/photo_2026-03-09_14-35-44-removebg-preview.png" alt="" className="w-96 h-auto" />
                        </div>

                        <div className="relative z-10">
                            {legal.content}
                        </div>

                        <div className="mt-16 pt-8 border-t border-dashed border-border flex flex-wrap gap-6 items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Verified Legal Version: 2025.1
                            </div>
                            <div>Last Reviewed: March 09, 2026</div>
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-foreground text-background p-8 rounded-[2rem] shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <h4 className="text-sm font-bold mb-4 flex items-center gap-2 relative z-10 tracking-widest uppercase">
                                <Download size={16} /> Document Tools
                            </h4>
                            <div className="space-y-3 relative z-10">
                                <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-between">
                                    Download PDF <ExternalLink size={14} />
                                </button>
                                <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-between">
                                    Print Document <ExternalLink size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm">
                            <h4 className="text-[10px] font-bold text-primary mb-6 uppercase tracking-widest">Related Statutes</h4>
                            <ul className="space-y-4">
                                {["Immigration Act 2025", "Cyber Sovereignty Law", "Federal Data Accord"].map((law) => (
                                    <li key={law} className="text-xs font-bold text-foreground/70 hover:text-primary cursor-pointer flex items-center gap-2 transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/30"></div>
                                        {law}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LegalPage;
