import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSubmitContactMutation } from "../store/contactApiSlice";
import { useGetContactInfoQuery } from "../store/contactInfoApiSlice";
import { MapPin, Send, Loader2, CheckCircle2, Clock, Phone, Mail } from "lucide-react";

/**
 * Public Contact page with a working submission form.
 * Posts to /contacts (public endpoint).
 */
export default function Contact() {
    const { t, i18n } = useTranslation();
    const { data: info } = useGetContactInfoQuery();
    const currentLang = i18n.language || "mm";

    const [submitContact, { isLoading }] = useSubmitContactMutation();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
            alert(t("contact.requiredFields"));
            return;
        }

        try {
            await submitContact({ name, email, phone, subject, message }).unwrap();
            setSuccess(true);
            // Reset form
            setName(""); setEmail(""); setPhone(""); setSubject(""); setMessage("");

            // Auto-dismiss success after 5s
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            console.error("Failed to submit:", err);
            const msg = err?.data?.message || t("contact.error");
            alert(msg);
        }
    };

    return (
        <div className="page-container bg-background animate-in fade-in duration-500">
            <div className="container-custom section-padding pb-32">
                {/* Page Header */}
                <div className="mb-16 text-center max-w-2xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/20">
                        <Send size={14} />
                        Official Communication
                    </div>
                    <h1 className="h1 mb-8 relative inline-block pb-4">
                        {t("contact.title")}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-primary/30 rounded-full"></div>
                    </h1>
                    <p className="p-lead mt-6">
                        {t("contact.subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
                    {/* Left: Departmental Information */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-primary text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>

                            <h3 className="p-small text-white/70 mb-10 flex items-center gap-2">
                                <MapPin size={16} />
                                Head Office Information
                            </h3>

                            <div className="space-y-10 relative z-10">
                                <div>
                                    <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-3">Primary Physical Address</div>
                                    <p className="text-base font-bold leading-relaxed text-white padauk-bold">
                                        {info ? (currentLang === 'en' ? info.address_en : info.address_mm) : t("contact.address")}
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 bg-white/10 rounded-xl">
                                            <Phone size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Official Hotline</div>
                                            <div className="font-bold text-white text-lg tracking-wide">
                                                {info?.phone || "+95 9 444 333 555"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 bg-white/10 rounded-xl">
                                            <Mail size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Electronic Mail</div>
                                            <p className="font-bold text-white text-lg tracking-wide uppercase break-all">
                                                {info?.email || "info@immigration.tlfug.gov"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <img src="/logo1-removebg-preview.png" alt="" className="absolute -bottom-10 -right-10 w-48 opacity-[0.08] grayscale invert rotate-12 pointer-events-none" />
                        </div>

                        {/* Administrative Hours */}
                        <div className="bg-card border border-border p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="p-small text-foreground/70 mb-8 flex items-center gap-2">
                                <Clock size={16} className="text-primary" />
                                Support Schedule
                            </h3>
                            <div className="space-y-5">
                                <div className="flex flex-col gap-2 pb-1 border-b border-border pb-5">
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Administrative Hours</span>
                                    <span className="text-sm font-bold text-foreground padauk-bold">
                                        {info ? (currentLang === 'en' ? info.working_hours_en : info.working_hours_mm) : "Mon - Fri, 09:00 - 16:00"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center bg-destructive/5 p-4 rounded-xl border border-destructive/10">
                                    <span className="text-[10px] text-destructive/70 font-bold uppercase tracking-widest">{t("contact.weekend")}</span>
                                    <span className="text-xs font-bold text-destructive uppercase tracking-widest">{t("contact.closed")}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Submission Portal & Map */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        <div className="bg-card border border-border p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border-t-[6px] border-t-primary">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                                <h3 className="h3">Formal Inquiry Form</h3>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-3 py-1 bg-secondary rounded-full">Secure Transmission</div>
                            </div>

                            {success && (
                                <div className="mb-10 flex items-center gap-4 bg-green-50 text-green-700 p-8 rounded-2xl border border-green-200 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <CheckCircle2 size={32} className="shrink-0" />
                                    <div>
                                        <p className="font-bold text-sm uppercase tracking-widest mb-1">Transmission Successful</p>
                                        <p className="p-small opacity-80">{t("contact.success")}</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="p-small text-muted-foreground">
                                            Full Representative Name <span className="text-primary">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder={t("contact.placeholderName")}
                                            className="w-full bg-background border border-border text-foreground rounded-lg px-5 py-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="p-small text-muted-foreground">
                                            Verification Email <span className="text-primary">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={t("contact.placeholderEmail")}
                                            className="w-full bg-background border border-border text-foreground rounded-lg px-5 py-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="p-small text-muted-foreground">
                                            Contact Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder={t("contact.placeholderPhone")}
                                            className="w-full bg-background border border-border text-foreground rounded-lg px-5 py-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="p-small text-muted-foreground">
                                            Inquiry Subject <span className="text-primary">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder={t("contact.placeholderSubject")}
                                            className="w-full bg-background border border-border text-foreground rounded-lg px-5 py-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="p-small text-muted-foreground">
                                        Detailed Messsage / Statement <span className="text-primary">*</span>
                                    </label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={t("contact.placeholderMessage")}
                                        rows={6}
                                        className="w-full bg-background border border-border text-foreground rounded-lg px-5 py-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none text-sm font-medium"
                                    />
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full md:w-auto px-12 py-5 font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-all flex items-center justify-center gap-3 p-small shadow-xl shadow-primary/10 disabled:opacity-60"
                                    >
                                        {isLoading ? (
                                            <><Loader2 size={16} className="animate-spin" /> Processing Inquiry...</>
                                        ) : (
                                            <><Send size={16} /> Submit Formal Inquiry</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {info?.map_embed_url && (
                            <div className="bg-card border border-border overflow-hidden rounded-[2.5rem] shadow-lg h-[400px]">
                                <iframe
                                    src={info.map_embed_url}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Office Location"
                                ></iframe>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

