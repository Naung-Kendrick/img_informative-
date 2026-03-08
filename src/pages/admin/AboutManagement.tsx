import { useState, useEffect, useRef } from "react";
import {
    useGetAboutContentQuery,
    useSaveAboutContentMutation
} from "../../store/aboutApiSlice";
import { useUploadImageToS3Mutation } from "../../store/newsApiSlice";
import { Loader2, UploadCloud, ImageIcon, X, Save } from "lucide-react";

export default function AboutManagement() {
    const { data, isLoading: isFetching } = useGetAboutContentQuery({});
    const [saveAboutContent, { isLoading: isSaving }] = useSaveAboutContentMutation();
    const [uploadImageToS3, { isLoading: isUploading }] = useUploadImageToS3Mutation();

    const isLoading = isSaving || isUploading || isFetching;

    // ── Form State ──────────────────────────────────────────────────────────
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [policy, setPolicy] = useState("");
    const [objective, setObjective] = useState("");

    // ── Image State ─────────────────────────────────────────────────────────
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize state from existing data
    useEffect(() => {
        if (data?.about) {
            setTitle(data.about.title || "");
            setDescription(data.about.description || "");
            setPolicy(data.about.policy || "");
            setObjective(data.about.objective || "");
            setImagePreview(data.about.imageUrl || "");
        }
    }, [data]);

    // ── Handlers ────────────────────────────────────────────────────────────
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate type & size (10 MB cap)
        if (!file.type.startsWith("image/")) {
            alert(`${file.name} သည် ပုံဖိုင် မဟုတ်ပါ။`);
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert(`${file.name} သည် 10MB ထက် ကြီးနေပါသည်။`);
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemoveImage = () => {
        if (imageFile) URL.revokeObjectURL(imagePreview);
        setImageFile(null);
        setImagePreview(""); // Revert to empty or maybe we should keep the old one? Let's just set empty so they can delete it.
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim() || !policy.trim() || !objective.trim()) {
            alert("အချက်အလက်အားလုံး ပြည့်စုံစွာ ထည့်သွင်းပါ။");
            return;
        }

        try {
            let finalImageUrl = imagePreview; // Default to existing preview (either S3 URL or empty)

            // Step 1: Upload image if a new local file was selected
            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append("images", imageFile); // API expects 'images' field

                const uploadResult = await uploadImageToS3(uploadFormData).unwrap();
                if (uploadResult?.urls?.length > 0) {
                    finalImageUrl = uploadResult.urls[0];
                }
            }

            // Step 2: Save About Content
            await saveAboutContent({
                title: title.trim(),
                description: description.trim(),
                policy: policy.trim(),
                objective: objective.trim(),
                imageUrl: finalImageUrl,
            }).unwrap();

            alert("ဌာနအကြောင်း အချက်အလက်များ အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ။");
            // After save, the imageFile state should ideally be cleared since it's now uploaded and tracked via URL
            setImageFile(null);
            setImagePreview(finalImageUrl);

        } catch (err: any) {
            console.error("❌ Failed to save about content:", err);
            const message = err?.data?.message || err?.message || "သိမ်းဆည်းခြင်း မအောင်မြင်ပါ။";
            alert(message);
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl py-8 animate-in fade-in duration-500">
            {/* ── Page Header ─────────────────────────────────────────── */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-primary pl-3 padauk-bold">
                    ဌာနအကြောင်း စီမံရန် (About Us)
                </h1>
                <p className="text-slate-500 mt-1 padauk-regular">
                    ပင်မစာမျက်နှာနှင့် ဌာနအကြောင်းစာမျက်နှာတွင် ဖော်ပြမည့် ဌာန၏ အချက်အလက်များကို ရေးသားပါ။
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">

                {/* ── Text Fields ──────────────────────────── */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold flex items-center justify-between">
                            <span>ခေါင်းစဉ်အမည် (Title) <span className="text-red-500">*</span></span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="လူဝင်မှုကြီးကြပ်ရေးဌာန အကြောင်း"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all padauk-regular"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold">
                            မိတ်ဆက်အကြောင်းအရာ (Description) <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="တအာင်းပြည်နယ်၏ လုံခြုံရေး၊ စီမံခန့်ခွဲရေး..."
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all padauk-regular resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 padauk-bold">
                                ဌာန၏ မူဝါဒ (Policy) <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={policy}
                                onChange={(e) => setPolicy(e.target.value)}
                                rows={4}
                                placeholder="လူဝင်မှုကြီးကြပ်ရေး၊ နိုင်ငံခြားသားထိန်းသိမ်းရေး..."
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all padauk-regular resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 padauk-bold">
                                အဓိက ရည်မှန်းချက်များ (Objectives) <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={objective}
                                onChange={(e) => setObjective(e.target.value)}
                                rows={4}
                                placeholder="တရားမဝင် ဝင်ရောက်နေထိုင်မှုများကို တားဆီးရန်..."
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all padauk-regular resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Image Upload ───────────────────────────── */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                    <label className="text-sm font-semibold text-slate-700 padauk-bold flex items-center gap-2">
                        <ImageIcon size={16} className="text-primary" />
                        ကိုယ်စားပြု ဓာတ်ပုံ (Featured Image)
                    </label>

                    <div className="flex gap-4 items-start mt-2">
                        {imagePreview ? (
                            <div className="relative group w-48 aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0 shadow-sm">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover transition-transform duration-300"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-slate-600 hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                    title="ပုံဖျက်မည်"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-48 aspect-[4/3] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group shrink-0"
                            >
                                <UploadCloud size={24} className="mb-2 text-slate-300 group-hover:text-primary transition-colors" />
                                <p className="text-slate-500 text-[10px] padauk-regular">ပုံထည့်မည်</p>
                            </div>
                        )}

                        <div className="text-slate-400 text-xs mt-2 self-center">
                            အကြံပြုအရွယ်အစား: 800x600px (4:3 Aspect Ratio)<br />
                            အများဆုံးဖိုင်အရွယ်အစား: 10MB
                        </div>
                    </div>

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                    />
                </div>

                {/* ── Action Buttons ─────────────────────────────────── */}
                <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-slate-100">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 font-semibold text-white bg-primary border border-primary rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 padauk-bold shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {isLoading ? "သိမ်းဆည်းနေသည်..." : "သိမ်းဆည်းမည်"}
                    </button>
                </div>

            </form>
        </div>
    );
}
