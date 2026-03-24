import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateDistrictMutation } from "../../store/districtApiSlice";
import { Loader2, ArrowLeft, Save, UploadCloud, X, MapPin, Phone, Link as LinkIcon, Building, UserCircle } from "lucide-react";
import { useModal } from "../../context/ModalContext";

export default function CreateDistrict() {
    const navigate = useNavigate();
    const { showSuccess, showError } = useModal();
    const [createDistrict, { isLoading: isCreating }] = useCreateDistrictMutation();

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [officerInCharge, setOfficerInCharge] = useState("");
    const [mapUrl, setMapUrl] = useState("");

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);



    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showError("မှားယွင်းမှု", `${file.name} သည် ပုံဖိုင် မဟုတ်ပါ။`);
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !address || !phone || !imageFile) {
            showError("လိုအပ်ချက်", "ခရိုင်အမည်၊ လိပ်စာ၊ ဖုန်းနံပါတ် နှင့် ဓာတ်ပုံတို့ကို မဖြစ်မနေ ထည့်သွင်းပါ။");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("coverImage", imageFile);
            formData.append("name", name);
            formData.append("address", address);
            formData.append("phone", phone);
            if (officerInCharge) formData.append("officerInCharge", officerInCharge);
            if (mapUrl) formData.append("mapUrl", mapUrl);

            await createDistrict(formData).unwrap();

            showSuccess("အောင်မြင်ပါသည်", "ရုံးခွဲအသစ် ထည့်သွင်းပြီးပါပြီ", () => navigate("/admin/districts"));
        } catch (err: any) {
            console.error(err);
            showError("မအောင်မြင်ပါ", err?.data?.message || "ထည့်သွင်းခြင်း မအောင်မြင်ပါ");
        }
    };

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate("/admin/districts")}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-[#808080] pl-3 padauk-bold">
                        ရုံးခွဲ အသစ်ထည့်ရန်
                    </h1>
                    <p className="text-slate-500 mt-1 padauk-regular">
                        ရုံးခွဲအသစ်များ၏ အချက်အလက်များကို ဖြည့်သွင်းပါ။
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold">ရုံးခွဲအမည် / ရုံးအမည် <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Building size={18} className="absolute left-3 top-3.5 text-slate-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="ဥပမာ။ နမ့်ဆန်မြို့နယ်ရုံး"
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular font-semibold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold">လိပ်စာ <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <MapPin size={18} className="absolute left-3 top-3.5 text-slate-400" />
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="ရုံးတည်နေရာ အပြည့်အစုံ..."
                                rows={3}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold">ဖုန်းနံပါတ် <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Phone size={18} className="absolute left-3 top-3.5 text-slate-400" />
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="09xxxxxxxxx"
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold">တာဝန်ခံအရာရှိ (Officer in Charge)</label>
                        <div className="relative">
                            <UserCircle size={18} className="absolute left-3 top-3.5 text-slate-400" />
                            <input
                                type="text"
                                value={officerInCharge}
                                onChange={(e) => setOfficerInCharge(e.target.value)}
                                placeholder="ဥပမာ။ ဦး/ဒေါ် ..."
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold">Google Map URL (Optional)</label>
                        <div className="relative">
                            <LinkIcon size={18} className="absolute left-3 top-3.5 text-slate-400" />
                            <input
                                type="url"
                                value={mapUrl}
                                onChange={(e) => setMapUrl(e.target.value)}
                                placeholder="https://maps.app.goo.gl/..."
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all p-small"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 mt-6 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="px-6 py-3 font-bold text-white bg-[#808080] rounded-xl hover:bg-[#555555] flex items-center gap-2 transition-all shadow-md shadow-[#808080]/20 disabled:opacity-50 padauk-bold"
                        >
                            {isCreating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {isCreating ? "သိမ်းဆည်းနေသည်..." : "ရုံးခွဲအသစ် သိမ်းဆည်းမည်"}
                        </button>
                    </div>
                </div>

                <div className="w-full lg:w-[400px]">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full">
                        <h3 className="font-semibold text-slate-800 mb-4 block">ရုံး/မြေပုံ ဓာတ်ပုံ <span className="text-red-500">*</span></h3>

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageSelect}
                            ref={fileInputRef}
                        />

                        {!imagePreview ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full aspect-[16/9] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-50/80 hover:border-[#808080] flex flex-col items-center justify-center cursor-pointer group transition-all"
                            >
                                <UploadCloud size={32} className="text-slate-300 mb-2 group-hover:text-[#808080] transition-colors" />
                                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 padauk-bold uppercase tracking-wider">ရုံးပုံ ရွေးချယ်ရန် နှိပ်ပါ</span>
                            </div>
                        ) : (
                            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden group border border-slate-200 shadow-sm">
                                <img loading="lazy" src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
