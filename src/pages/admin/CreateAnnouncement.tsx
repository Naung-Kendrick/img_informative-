import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateAnnouncementMutation, useUploadAnnouncementImageToS3Mutation } from "../../store/announcementApiSlice";
import { Loader2, ArrowLeft, Save, UploadCloud, X, FileText } from "lucide-react";

export default function CreateAnnouncement() {
    const navigate = useNavigate();

    const [createAnnouncement, { isLoading: isCreating }] = useCreateAnnouncementMutation();
    const [uploadImage, { isLoading: isUploading }] = useUploadAnnouncementImageToS3Mutation();

    const [title, setTitle] = useState("");
    const [publishedDate, setPublishedDate] = useState("");
    const [referenceNumber, setReferenceNumber] = useState("");

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const validFiles: File[] = [];
        const validPreviews: string[] = [];

        for (const file of files) {
            if (!file.type.startsWith("image/")) {
                alert(`"${file.name}" သည် ဓာတ်ပုံဖိုင်မဟုတ်ပါ။`);
                continue;
            }
            if (file.size > 10 * 1024 * 1024) {
                alert(`"${file.name}" ပမာဏသည် 10MB ထက်ကျော်လွန်နေပါသည်။`);
                continue;
            }
            validFiles.push(file);
            validPreviews.push(URL.createObjectURL(file));
        }

        if (imageFiles.length + validFiles.length > 10) {
            alert("စာမျက်နှာ ၁၀ မျက်နှာထက် ပိုမရွေးချယ်နိုင်ပါ။");
            return;
        }

        setImageFiles(prev => [...prev, ...validFiles]);
        setImagePreviews(prev => [...prev, ...validPreviews]);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemoveImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            const up = [...prev];
            URL.revokeObjectURL(up[index]);
            up.splice(index, 1);
            return up;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !publishedDate || imageFiles.length === 0) {
            alert("ခေါင်းစဉ်၊ ရက်စွဲနှင့် စာရွက်စာတမ်း ဓာတ်ပုံတို့ကို မဖြစ်မနေ ဖြည့်သွင်းပါ။");
            return;
        }

        try {
            // Step 1: Upload images
            const formData = new FormData();
            imageFiles.forEach(file => {
                formData.append("documentImages", file);
            });

            const uploadResult = await uploadImage(formData).unwrap();

            // Step 2: Create announcement
            await createAnnouncement({
                title,
                publishedDate,
                referenceNumber,
                documentImages: uploadResult.urls,
            }).unwrap();

            navigate("/admin/announcements");
        } catch (err: any) {
            console.error("Failed to create announcement:", err);
            alert(err?.data?.message || "ထုတ်ပြန်ချက်အသစ်တင်ခြင်း မအောင်မြင်ပါ။");
        }
    };

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/admin/announcements")}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                        title="နောက်သို့"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-primary pl-3 padauk-bold">
                            ထုတ်ပြန်ချက်အသစ်တင်ရန်
                        </h1>
                        <p className="text-slate-500 mt-1 padauk-regular text-sm">
                            တရားဝင် A4 စာရွက်စာတမ်းများကို ဒီဂျစ်တယ်ပုံစံဖြင့် သိမ်းဆည်းပါ။
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">

                {/* Left Column: Form Fields */}
                <div className="flex-1 space-y-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-fit">

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold block">
                            ခေါင်းစဉ် <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="ထုတ်ပြန်ချက် ခေါင်းစဉ် ရိုက်ထည့်ပါ"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all padauk-regular"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 padauk-bold block">
                                ထုတ်ပြန်သည့်ရက်စွဲ <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={publishedDate}
                                onChange={(e) => setPublishedDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 padauk-bold block">
                                အမှတ်စဉ် (Reference No.)
                            </label>
                            <input
                                type="text"
                                value={referenceNumber}
                                onChange={(e) => setReferenceNumber(e.target.value)}
                                placeholder="ဥပမာ။ အထက/၀၀၁"
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all padauk-regular"
                            />
                        </div>
                    </div>

                    <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100 italic padauk-regular flex items-start gap-3 leading-relaxed mt-4">
                        <FileText size={20} className="text-primary shrink-0 mt-0.5" />
                        မှတ်ချက်။ ထုတ်ပြန်ချက်များတွင် စာသားအပြည့်အစုံ ရိုက်ထည့်ရန် မလိုပါ။ လိုအပ်သော ခေါင်းစဉ်နှင့် ရည်ညွှန်းအမှတ်စဉ်များကိုသာ ထည့်သွင်းပြီး မူရင်း A4 စာရွက်ပုံစံကို ဓာတ်ပုံဖြင့်သာ တိုက်ရိုက် လွှင့်တင်ရမည် ဖြစပါသည်။
                    </p>

                    <div className="flex items-center justify-end gap-4 pt-6 mt-8 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/announcements")}
                            className="px-6 py-2.5 font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all padauk-regular"
                        >
                            မလုပ်ဆောင်ပါ
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating || isUploading}
                            className="px-6 py-2.5 font-semibold text-white bg-primary border border-primary rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 padauk-bold shadow-md shadow-primary/20 disabled:opacity-50"
                        >
                            {(isCreating || isUploading) ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {(isCreating || isUploading) ? "သိမ်းဆည်းနေသည်..." : "ထုတ်ပြန်ချက်ကို သိမ်းမည်"}
                        </button>
                    </div>

                </div>

                {/* Right Column: A4 Portrait Upload */}
                <div className="w-full lg:w-[400px] shrink-0">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full flex flex-col items-center">
                        <div className="flex items-center justify-between w-full mb-4">
                            <h3 className="font-semibold text-slate-800 padauk-bold text-left">
                                စာရွက်စာတမ်းများ <span className="text-red-500">*</span>
                            </h3>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                {imageFiles.length} / 10
                            </span>
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageSelect}
                            ref={fileInputRef}
                        />

                        {/* A4 Portrait Preview Area */}
                        {imagePreviews.length === 0 && (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full aspect-[1/1.414] rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-primary transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden shadow-inner group relative mb-4"
                            >
                                <div className="absolute inset-4 border border-slate-200 bg-white shadow-sm flex flex-col items-center justify-center transition-all group-hover:shadow-md">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <UploadCloud size={32} className="text-primary" />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-700 padauk-bold text-center">
                                        ပုံရွေးချယ်ရန် နှိပ်ပါ
                                    </p>
                                    <p className="text-xs text-slate-500 mt-2 padauk-regular text-center px-4">
                                        (Portrait A4 ပုံစံ ဓာတ်ပုံများ ရွေးချယ်ပါ)
                                    </p>
                                </div>
                            </div>
                        )}

                        {imagePreviews.length > 0 && (
                            <div className="w-full grid grid-cols-2 gap-3 mb-4 max-h-[500px] overflow-y-auto p-1">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="w-full flex flex-col items-center relative group">
                                        <div className="w-full aspect-[1/1.414] rounded-lg shadow-sm border border-slate-200 overflow-hidden relative bg-white flex items-center justify-center">
                                            <img
                                                src={preview}
                                                alt={`Document Page ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Action overlay */}
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="w-9 h-9 bg-red-500 text-white rounded-lg flex items-center justify-center shadow-xl hover:bg-red-600 transition-colors"
                                                    title="ဖျက်မည်"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                            <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] font-bold px-1.5 rounded-sm">
                                                {index + 1}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {imagePreviews.length > 0 && imagePreviews.length < 10 && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-3 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-slate-600 font-semibold padauk-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors mt-auto"
                            >
                                <UploadCloud size={18} /> နောက်ထပ်စာမျက်နှာ ထည့်ရန်
                            </button>
                        )}
                    </div>
                </div>

            </form >
        </div >
    );
}
