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
    Twitter,
    Instagram,
    Clock,
    Globe,
    Loader2,
    Info
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
        twitter: "",
        instagram: "",
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
                twitter: contactInfo.twitter || "",
                instagram: contactInfo.instagram || "",
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
            <Loader2 className="animate-spin text-primary" size={48} />
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500 max-w-5xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 border-l-8 border-primary pl-4 padauk-bold">
                        ဆက်သွယ်ရန် အချက်အလက်များ
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg padauk-regular">
                        ဝက်ဘ်ဆိုက်အောက်ခြေ (Footer) နှင့် ဆက်သွယ်ရန်စာမျက်နှာရှိ အချက်အလက်များကို ပြင်ဆင်ပါ။
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Contact Info */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow ring-1 ring-slate-100">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                            <Info size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 padauk-bold">အခြေခံ အချက်အလက်များ</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <MapPin size={18} className="text-primary" /> လိပ်စာ (မြန်မာ)
                                </label>
                                <textarea
                                    name="address_mm"
                                    value={formData.address_mm}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all padauk-regular resize-none"
                                    placeholder="မြန်မာဘာသာဖြင့် လိပ်စာထည့်ပါ"
                                    required
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <MapPin size={18} className="text-primary" /> Address (English)
                                </label>
                                <textarea
                                    name="address_en"
                                    value={formData.address_en}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                    placeholder="Enter address in English"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <Phone size={18} className="text-primary" /> ဖုန်းနံပါတ် (Phone)
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="+95 9 ..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <Mail size={18} className="text-primary" /> အီးမေးလ် (Email)
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="example@mail.com"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media & Working Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow ring-1 ring-slate-100">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                            <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-600">
                                <Globe size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 padauk-bold">လူမှုကွန်ရက် လင့်ခ်များ</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <Facebook size={18} className="text-blue-600" /> Facebook URL
                                </label>
                                <input
                                    type="text"
                                    name="facebook"
                                    value={formData.facebook}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <Twitter size={18} className="text-sky-500" /> Twitter URL
                                </label>
                                <input
                                    type="text"
                                    name="twitter"
                                    value={formData.twitter}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                                    placeholder="https://twitter.com/..."
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <Instagram size={18} className="text-pink-600" /> Instagram URL
                                </label>
                                <input
                                    type="text"
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow ring-1 ring-slate-100 flex flex-col">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                            <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-600">
                                <Clock size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 padauk-bold">ရုံးချိန်များ</h2>
                        </div>

                        <div className="space-y-6 flex-grow">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 padauk-bold">ရုံးချိန် (မြန်မာ)</label>
                                <input
                                    type="text"
                                    name="working_hours_mm"
                                    value={formData.working_hours_mm}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all padauk-regular"
                                    placeholder="ဥပမာ။ တနင်္လာ မှ သောကြာ (၉:၀၀ နံနက် မှ ၄:၀၀ ညနေ)"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Working Hours (English)</label>
                                <input
                                    type="text"
                                    name="working_hours_en"
                                    value={formData.working_hours_en}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    placeholder="e.g. Mon - Fri (9:00 AM - 4:00 PM)"
                                />
                            </div>
                            <div className="pt-4">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Google Map Embed URL</label>
                                <input
                                    type="text"
                                    name="map_embed_url"
                                    value={formData.map_embed_url}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                                    placeholder="https://www.google.com/maps/embed?pb=..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 pb-12">
                    <button
                        type="submit"
                        disabled={isUpdating || !canEdit}
                        className="flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale padauk-bold disabled:pointer-events-none"
                    >
                        {isUpdating ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <Save size={24} />
                        )}
                        အချက်အလက်များကို သိမ်းဆည်းမည်
                    </button>
                </div>
            </form>
        </div>
    );
}
