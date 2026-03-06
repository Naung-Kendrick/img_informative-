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
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500 min-h-[70vh]">

            {/* Page Header */}
            <div className="mb-10 text-center">
                <div className="inline-flex items-center gap-2 bg-slate-50 text-[#808080] px-4 py-2 rounded-full text-sm font-bold mb-4">
                    <Mail size={16} />
                    {t("contact.badge")}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 padauk-bold mb-2">
                    {t("contact.title")}
                </h1>
                <p className="text-slate-500 padauk-regular max-w-xl mx-auto">
                    {t("contact.subtitle")}
                </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">

                {/* Left — Contact Info Cards */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-slate-50 text-[#808080] shrink-0">
                                <MapPin size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1 padauk-bold">{t("contact.location")}</h3>
                                <p className="text-slate-500 text-sm padauk-regular">{t("contact.address")}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-slate-50 text-[#808080] shrink-0">
                                <Phone size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1 padauk-bold">{t("contact.phone")}</h3>
                                <p className="text-slate-500 text-sm">+95 9 444 333 555</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-slate-50 text-[#808080] shrink-0">
                                <Mail size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1 padauk-bold">{t("contact.email")}</h3>
                                <p className="text-slate-500 text-sm">[EMAIL_ADDRESS]</p>
                            </div>
                        </div>
                    </div>

                    {/* Office Hours */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-900 mb-3 padauk-bold">{t("contact.officeHours")}</h3>
                        <div className="space-y-2 text-sm padauk-regular">
                            <div className="flex justify-between text-slate-600">
                                <span>{t("contact.days")}</span>
                                <span className="font-semibold text-slate-900">9:00 AM - 4:00 PM</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>{t("contact.weekend")}</span>
                                <span className="font-semibold text-red-500">{t("contact.closed")}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right — Contact Form */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">

                        {success && (
                            <div className="mb-6 flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 animate-in slide-in-from-top duration-300">
                                <CheckCircle2 size={20} className="shrink-0" />
                                <span className="padauk-bold text-sm">{t("contact.success")}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 padauk-bold">
                                        {t("contact.name")} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={t("contact.placeholderName")}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 padauk-bold">
                                        {t("contact.email")} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t("contact.placeholderEmail")}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 padauk-bold">
                                        {t("contact.phone")}
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder={t("contact.placeholderPhone")}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 padauk-bold">
                                        {t("contact.subject")} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder={t("contact.placeholderSubject")}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 padauk-bold">
                                    {t("contact.message")} <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={t("contact.placeholderMessage")}
                                    rows={5}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all resize-none padauk-regular"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full sm:w-auto px-8 py-3.5 font-bold text-white bg-[#808080] border border-[#808080] rounded-xl hover:bg-[#555555] transition-colors flex items-center justify-center gap-2 padauk-bold shadow-md shadow-[#808080]/20 disabled:opacity-60"
                            >
                                {isLoading ? (
                                    <><Loader2 size={18} className="animate-spin" /> {t("contact.sending")}</>
                                ) : (
                                    <><Send size={18} /> {t("contact.send")}</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

