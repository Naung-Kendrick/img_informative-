import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TipTapEditor from "../../components/admin/TipTapEditor";
import { useCreatePageMutation } from "../../store/pageApiSlice";
import { useUploadImageToS3Mutation } from "../../store/newsApiSlice"; // Generic S3 upload
import { Loader2, ArrowLeft, UploadCloud, ImageIcon, X, Hash } from "lucide-react";
import { useModal } from "../../context/ModalContext";

export default function CreatePage() {
    const navigate = useNavigate();
    const { showSuccess, showError } = useModal();
    const [searchParams] = useSearchParams();

    // ── Form State ──────────────────────────────────────────────────────────
    const [title, setTitle] = useState("");
    const [section, setSection] = useState<"services" | "districts" | "">("");
    const [order, setOrder] = useState<number>(0);
    const [content, setContent] = useState("<p>အကြောင်းအရာများကို ဤနေရာတွင် စတင်ရေးသားပါ...</p>");

    useEffect(() => {
        const sectionParam = searchParams.get("section");
        if (sectionParam === "services" || sectionParam === "districts") {
            setSection(sectionParam);
        }
    }, [searchParams]);

    // ── Image State ─────────────────────────────────────────────────────────
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── RTK Query Mutations ─────────────────────────────────────────────────
    const [createPage, { isLoading: isCreating }] = useCreatePageMutation();
    const [uploadImageToS3, { isLoading: isUploading }] = useUploadImageToS3Mutation();
    const isLoading = isCreating || isUploading;

    // ── Handlers ────────────────────────────────────────────────────────────
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showError("မှားယွင်းမှု", "ရွေးချယ်ထားသောဖိုင်သည် ပုံဖိုင် မဟုတ်ပါ။");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showError("မှားယွင်းမှု", "ပုံဖိုင်သည် 10MB ထက် မကြီးသင့်ပါ။");
            return;
        }

        setImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.MouseEvent, status: "Draft" | "Published") => {
        e.preventDefault();

        if (!title.trim()) {
            showError("လိုအပ်ချက်", "စာမျက်နှာခေါင်းစဉ် ထည့်သွင်းပါ။");
            return;
        }
        if (!section) {
            showError("လိုအပ်ချက်", "ကဏ္ဍ (Section) ရွေးချယ်ပါ။");
            return;
        }
        if (!content || content === "<p></p>") {
            showError("လိုအပ်ချက်", "အကြောင်းအရာ ရေးသားပါ။");
            return;
        }

        try {
            let bannerImageUrl = "";

            // ── Step 1: Upload image to S3 (if one was selected) ──────────
            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append("images", imageFile); // API expects 'images' field
                const uploadResult = await uploadImageToS3(uploadFormData).unwrap();
                bannerImageUrl = uploadResult.urls[0];
            }

            // ── Step 2: Create the page (plain JSON) ──────────────
            await createPage({
                title: title.trim(),
                section: section as "services" | "districts",
                content,
                status,
                bannerImage: bannerImageUrl,
                order: order || 0,
            }).unwrap();

            showSuccess("အောင်မြင်ပါသည်", "စာမျက်နှာအသစ် ဖန်တီးမှု အောင်မြင်ပါသည်", () => navigate(`/admin/${section === "services" ? "services" : "districts"}`));

        } catch (err: any) {
            console.error("❌ Failed to create page:", err);
            const message = err?.data?.message || err?.message || "စာမျက်နှာဖန်တီးခြင်း မအောင်မြင်ပါ။";
            showError("မအောင်မြင်ပါ", message);
        }
    };

    return (
        <div className="container mx-auto max-w-5xl py-8 animate-in fade-in duration-500">

            {/* ── Page Header ─────────────────────────────────────────── */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-[#808080] pl-3 padauk-bold">
                        စာမျက်နှာအသစ် ဖန်တီးရန်
                    </h1>
                    <p className="text-slate-500 mt-1 padauk-regular">
                        ဝန်ဆောင်မှု သို့မဟုတ် လူဝင်မှုကြီးကြပ်ရေးရုံးများအတွက် အချက်အလက်စာမျက်နှာ ဖန်တီးပါ။
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="space-y-6">

                    {/* ── Title & Section Row ──────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 padauk-bold">
                                စာမျက်နှာ ခေါင်းစဉ် <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="ခေါင်းစဉ် ရိုက်ထည့်ပါ..."
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular"
                            />
                        </div>

                        {/* Section */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 padauk-bold">
                                ကဏ္ဍ (Section) <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={section}
                                onChange={(e) => setSection(e.target.value as any)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular"
                            >
                                <option value="">ရွေးချယ်ပါ</option>
                                <option value="services">ဝန်ဆောင်မှုများ (Services)</option>
                                <option value="districts">လူဝင်မှုကြီးကြပ်ရေးရုံးများ (Immigration Offices)</option>
                            </select>
                        </div>
                    </div>

                    {/* ── Order Row ─────────────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 padauk-bold flex items-center gap-2">
                                <Hash size={16} className="text-[#808080]" />
                                ဖော်ပြမည့်အစီအစဉ် (Sort Order)
                            </label>
                            <input
                                type="number"
                                value={order}
                                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular"
                                placeholder="ဥပမာ - 1"
                            />
                            <p className="text-[11px] text-slate-400">ငယ်စဉ်ကြီးလိုက် အစီအစဉ်ဖြင့် ပြသမည်။ (၀ သည် အရင်ဆုံးပြမည်)</p>
                        </div>
                    </div>

                    {/* ── Banner Image Upload ───────────────────────────── */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold flex items-center gap-2">
                            <ImageIcon size={16} className="text-[#808080]" />
                            Banner ပုံ (ရွေးချယ်မှုပြု)
                        </label>

                        {imagePreview ? (
                            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                <img loading="lazy"
                                    src={imagePreview}
                                    alt="Banner preview"
                                    className="w-full max-h-64 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-slate-600 hover:text-red-500 hover:bg-white transition-all"
                                >
                                    <X size={16} />
                                </button>
                                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-slate-600 shadow-sm">
                                    {imageFile?.name} ({(imageFile!.size / 1024).toFixed(0)} KB)
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#808080] hover:bg-[#808080]/5 transition-all group"
                            >
                                <UploadCloud size={40} className="mx-auto mb-3 text-slate-300 group-hover:text-[#808080] transition-colors" />
                                <p className="text-slate-500 text-sm padauk-regular">Banner ပုံ ရွေးချယ်ရန် နှိပ်ပါ</p>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                    </div>

                    {/* ── Rich Text Editor ──────────────────────────────── */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold">
                            စာမျက်နှာအကြောင်းအရာ <span className="text-red-500">*</span>
                        </label>
                        <TipTapEditor content={content} onChange={setContent} />
                    </div>

                    {/* ── Action Buttons ─────────────────────────────────── */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, "Draft")}
                            disabled={isLoading}
                            className="px-6 py-3 font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors padauk-regular disabled:opacity-60"
                        >
                            မူကြမ်းအဖြစ် သိမ်းမည်
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, "Published")}
                            disabled={isLoading}
                            className="px-6 py-3 font-semibold text-white bg-[#808080] border border-[#808080] rounded-xl hover:bg-[#555555] transition-colors flex items-center gap-2 padauk-bold shadow-md shadow-[#808080]/20 disabled:opacity-60"
                        >
                            {isLoading && <Loader2 size={18} className="animate-spin" />}
                            {isLoading ? "သိမ်းနေသည်..." : "စာမျက်နှာကို လွှင့်တင်မည်"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

