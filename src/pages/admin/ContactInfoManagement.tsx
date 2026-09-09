import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import {
    useGetContactInfoQuery,
    useUpdateContactInfoMutation
} from "../../store/contactInfoApiSlice";
import {
    Save,
    MapPin,
    Phone,
    Mail,
    Facebook,
    MessageCircle, // for Viber
    Send, // for Telegram
    Clock,
    Globe,
    Loader2,
    Building2,
    CheckCircle2
} from "lucide-react";
import { useModal } from "../../context/ModalContext";

export default function ContactInfoManagement() {
    const { user } = useSelector((state: RootState) => state.auth);
    const { showSuccess, showError } = useModal();
    const canEdit = (user?.role ?? 0) >= 2;

    const { data: contactInfo, isLoading } = useGetContactInfoQuery();
    const [updateContactInfo, { isLoading: isUpdating }] = useUpdateContactInfoMutation();

    const [formData, setFormData] = useState({
        address_en: "",
        address_mm: "",
        phone: "",
        email: "",
        facebook: "",
        telegram: "",
        viber: "",
        working_hours_en: "",
        working_hours_mm: "",
        map_embed_url: ""
    });

    useEffect(() => {
        if (contactInfo) {
            setFormData({
                address_en: contactInfo.address_en || "",
                address_mm: contactInfo.address_mm || "",
                phone: contactInfo.phone || "",
                email: contactInfo.email || "",
                facebook: contactInfo.facebook || "",
                telegram: contactInfo.telegram || "",
                viber: contactInfo.viber || "",
                working_hours_en: contactInfo.working_hours_en || "",
                working_hours_mm: contactInfo.working_hours_mm || "",
                map_embed_url: contactInfo.map_embed_url || ""
            });
        }
    }, [contactInfo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateContactInfo(formData).unwrap();
            showSuccess("အောင်မြင်ပါသည်", "ဆက်သွယ်ရန် အချက်အလက်များကို သိမ်းဆည်းပြီးပါပြီ။");
        } catch (err: any) {
            showError("မအောင်မြင်ပါ", err?.data?.message || "Failed to update contact information");
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-blue-500" size={36} />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white padauk-bold flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Building2 size={20} />
                        </div>
                        <span>လိပ်စာနှင့် ဆက်သွယ်ရန် အချက်အလက်များ</span>
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1 padauk-regular">
                        ဝက်ဘ်ဆိုက်အောက်ခြေ (Footer) တွင် ဖော်ပြထားသော ရုံးချုပ်လိပ်စာ၊ ဖုန်းနံပါတ်၊ အီးမေးလ်နှင့် လူမှုကွန်ရက်များကို စီမံခန့်ခွဲပါ။
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Basic Contact Info Card */}
                <div className="bg-[#0e1627] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
                        <div className="p-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white padauk-bold">ရုံးချုပ် လိပ်စာနှင့် ဆက်သွယ်ရန်</h2>
                            <p className="text-xs text-slate-400">လိပ်စာ၊ ဖုန်းနံပါတ်နှင့် အီးမေးလ်</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-5">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2 padauk-bold">
                                    <MapPin size={14} className="text-blue-400" /> ရုံးချုပ်လိပ်စာ (မြန်မာ)
                                </label>
                                <textarea
                                    name="address_mm"
                                    value={formData.address_mm}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full bg-[#090e1a] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all padauk-regular resize-none"
                                    placeholder="ဥပမာ။ တအာင်းပြည်၊ နမ့်ဆန်မြို့နယ်..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
                                    <MapPin size={14} className="text-blue-400" /> Headquarter Address (English)
                                </label>
                                <textarea
                                    name="address_en"
                                    value={formData.address_en}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full bg-[#090e1a] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                                    placeholder="e.g. Ta'ang Land Headquarter..."
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2 padauk-bold">
                                    <Phone size={14} className="text-emerald-400" /> ဖုန်းနံပါတ် (Phone Number)
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-[#090e1a] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="+95 9 123 456 789"
                                    required
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2 padauk-bold">
                                    <Mail size={14} className="text-sky-400" /> တရားဝင် အီးမေးလ် (Official Email)
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-[#090e1a] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="info@taanglandimmigration.org"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Social Media & Working Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Social Media Links */}
                    <div className="bg-[#0e1627] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
                            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
                                <Globe size={20} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white padauk-bold">လူမှုကွန်ရက် လင့်ခ်များ</h2>
                                <p className="text-xs text-slate-400">Facebook, Telegram, Viber</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
                                    <Facebook size={14} className="text-blue-500" /> Facebook Page URL
                                </label>
                                <input
                                    type="text"
                                    name="facebook"
                                    value={formData.facebook}
                                    onChange={handleChange}
                                    className="w-full bg-[#090e1a] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
                                    <Send size={14} className="text-[#0088cc]" /> Telegram Channel URL
                                </label>
                                <input
                                    type="text"
                                    name="telegram"
                                    value={formData.telegram}
                                    onChange={handleChange}
                                    className="w-full bg-[#090e1a] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="https://t.me/..."
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
                                    <MessageCircle size={14} className="text-[#7360f2]" /> Viber Community URL
                                </label>
                                <input
                                    type="text"
                                    name="viber"
                                    value={formData.viber}
                                    onChange={handleChange}
                                    className="w-full bg-[#090e1a] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="https://invite.viber.com/..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Working Hours & Map */}
                    <div className="bg-[#0e1627] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/80">
                            <div className="p-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white padauk-bold">ရုံးချိန်နှင့် တည်နေရာ</h2>
                                <p className="text-xs text-slate-400">ရုံးဖွင့်ချိန်များနှင့် Google Maps Embed</p>
                            </div>
                        </div>

                        <div className="space-y-4 flex-grow">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-2 padauk-bold">ရုံးချိန် (မြန်မာ)</label>
                                <input
                                    type="text"
                                    name="working_hours_mm"
                                    value={formData.working_hours_mm}
                                    onChange={handleChange}
                                    className="w-full bg-[#090e1a] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all padauk-regular"
                                    placeholder="ဥပမာ။ တနင်္လာ မှ သောကြာ (၉:၀၀ နံနက် မှ ၄:၀၀ ညနေ)"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-2">Working Hours (English)</label>
                                <input
                                    type="text"
                                    name="working_hours_en"
                                    value={formData.working_hours_en}
                                    onChange={handleChange}
                                    className="w-full bg-[#090e1a] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="e.g. Mon - Fri (9:00 AM - 4:00 PM)"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-2">Google Map Embed URL</label>
                                <input
                                    type="text"
                                    name="map_embed_url"
                                    value={formData.map_embed_url}
                                    onChange={handleChange}
                                    className="w-full bg-[#090e1a] border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                                    placeholder="https://www.google.com/maps/embed?pb=..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit / Action Bar */}
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        <span>သိမ်းဆည်းပြီးပါက ပင်မဝက်ဘ်ဆိုက် Footer တွင် ချက်ချင်းပြောင်းလဲဖော်ပြမည်ဖြစ်ပါသည်။</span>
                    </div>

                    <button
                        type="submit"
                        disabled={isUpdating || !canEdit}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none padauk-bold"
                    >
                        {isUpdating ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <Save size={16} />
                        )}
                        <span>အချက်အလက် သိမ်းဆည်းမည်</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
