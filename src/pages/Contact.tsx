import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSubmitContactMutation } from "../store/contactApiSlice";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";

/**
 * Public Contact page with a working submission form.
 * Posts to /contacts (public endpoint).
 */
export default function Contact() {
    const { t } = useTranslation();
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
        <div className="bg-[#f8fafc] min-h-screen py-16 animate-in fade-in duration-500">
            <div className="container-custom">
                {/* Page Header: Official Inquiries */}
                <div className="mb-16 border-b border-slate-200 pb-10 flex flex-col items-center text-center">
                    <div className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                        <span className="w-12 h-[1px] bg-primary/40"></span>
                        Official Communication
                        <span className="w-12 h-[1px] bg-primary/40"></span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-none">
                        {t("contact.title")}
                    </h1>
                    <p className="text-slate-500 text-sm font-medium max-w-2xl leading-relaxed">
                        {t("contact.subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
                    {/* Left: Departmental Information */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-slate-950 text-white p-8 rounded-sm shadow-xl relative overflow-hidden">
                            <h3 className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                <MapPin size={14} />
                                Head Office
                            </h3>
                            <div className="space-y-8 relative z-10">
                                <div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Primary Address</div>
                                    <p className="text-sm font-medium leading-relaxed text-slate-300">
                                        {t("contact.address")}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Official Hotlines</div>
                                        <div className="flex flex-col gap-2 font-bold text-white tracking-wide">
                                            <span>+95 9 444 333 555</span>
                                            <span>+95 9 111 222 333</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Electronic Mail</div>
                                        <p className="font-bold text-primary tracking-wide">[EMAIL_ADDRESS]</p>
                                    </div>
                                </div>
                            </div>
                            <img src="/logo1-removebg-preview.png" alt="" className="absolute -bottom-10 -right-10 w-48 opacity-[0.05] grayscale invert rotate-12 pointer-events-none" />
                        </div>

                        {/* Administrative Hours */}
                        <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm">
                            <h3 className="text-slate-900 text-xs font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Send size={14} className="text-primary" />
                                Support Schedule
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-50">
                                    <span className="text-slate-500 font-bold uppercase tracking-widest">{t("contact.days")}</span>
                                    <span className="font-bold text-slate-900">09:00 - 16:00</span>
                                </div>
                                <div className="flex justify-between items-center text-xs pb-1">
                                    <span className="text-slate-500 font-bold uppercase tracking-widest">{t("contact.weekend")}</span>
                                    <span className="font-bold text-red-600 uppercase tracking-widest">{t("contact.closed")}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Submission Portal */}
                    <div className="lg:col-span-8">
                        <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-sm shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)]">
                            <h3 className="text-slate-900 text-lg font-bold mb-8 tracking-tight">Formal Inquiry Form</h3>

                            {success && (
                                <div className="mb-10 flex items-center gap-4 bg-primary/5 text-primary p-6 rounded-sm border border-primary/20 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <CheckCircle2 size={24} className="shrink-0" />
                                    <div>
                                        <p className="font-bold text-sm uppercase tracking-widest mb-1">Submission Successful</p>
                                        <p className="text-xs font-medium opacity-80">{t("contact.success")}</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            Full Representative Name <span className="text-primary">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder={t("contact.placeholderName")}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-sm px-5 py-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            Verification Email <span className="text-primary">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={t("contact.placeholderEmail")}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-sm px-5 py-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            Contact Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder={t("contact.placeholderPhone")}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-sm px-5 py-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            Inquiry Subject <span className="text-primary">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder={t("contact.placeholderSubject")}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-sm px-5 py-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        Detailed Messsage / Statement <span className="text-primary">*</span>
                                    </label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={t("contact.placeholderMessage")}
                                        rows={6}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-sm px-5 py-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none text-sm font-medium"
                                    />
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full md:w-auto px-12 py-5 font-bold text-white bg-primary hover:bg-primary/90 border border-primary rounded-sm transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/10 disabled:opacity-60"
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
                    </div>
                </div>
            </div>
        </div>
    );
}

