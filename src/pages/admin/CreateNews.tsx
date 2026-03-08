import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TipTapEditor from "../../components/admin/TipTapEditor";
import { useCreateNewsMutation, useUploadImageToS3Mutation } from "../../store/newsApiSlice";
import { Loader2, ArrowLeft, UploadCloud, ImageIcon, X } from "lucide-react";

export default function CreateNews() {
    const navigate = useNavigate();

    // ── Form State ──────────────────────────────────────────────────────────
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("<p>သတင်းအကြောင်းအရာများကို ဤနေရာတွင် စတင်ရေးသားပါ...</p>");

    // ── Image State ─────────────────────────────────────────────────────────
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── RTK Query Mutations ─────────────────────────────────────────────────
    const [createNews, { isLoading: isCreating }] = useCreateNewsMutation();
    const [uploadImageToS3, { isLoading: isUploading }] = useUploadImageToS3Mutation();
    const isLoading = isCreating || isUploading;

    // ── Handlers ────────────────────────────────────────────────────────────
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length === 0) return;

        // Limit to 5 images total
        if (imageFiles.length + selectedFiles.length > 5) {
            alert("အများဆုံး ပုံ ၅ ပုံသာ တင်နိုင်ပါသည်။");
            return;
        }

        const validFiles: File[] = [];
        const validPreviews: string[] = [];

        selectedFiles.forEach((file) => {
            // Validate type
            if (!file.type.startsWith("image/")) {
                alert(`${file.name} သည် ပုံဖိုင် မဟုတ်ပါ။`);
                return;
            }

            // Validate size (10 MB cap)
            if (file.size > 10 * 1024 * 1024) {
                alert(`${file.name} သည် 10MB ထက် ကြီးနေပါသည်။`);
                return;
            }

            validFiles.push(file);
            validPreviews.push(URL.createObjectURL(file));
        });

        setImageFiles((prev) => [...prev, ...validFiles]);
        setImagePreviews((prev) => [...prev, ...validPreviews]);

        // Reset input value to allow re-selecting same file after removal
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemoveImage = (index: number) => {
        // Revoke URL to prevent memory leaks
        URL.revokeObjectURL(imagePreviews[index]);

        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    /**
     * Main submit handler.
     *
     * Strategy:
     *   1. Build a FormData containing all fields INCLUDING the image file.
     *   2. The backend's `createNews` controller reads text fields from `req.body`
     *      — BUT multipart requests populate req.body differently.
     *
     *   Since our backend currently receives JSON for createNews and a separate
     *   /upload endpoint for the image, we use a TWO-STEP approach:
     *     Step 1 → POST /news/upload   → returns S3 URL
     *     Step 2 → POST /news          → sends JSON with the returned URL
     *
     *   This keeps the backend clean and avoids rewriting the createNews controller.
     */
    const handleSubmit = async (e: React.MouseEvent, status: "Draft" | "Published") => {
        e.preventDefault();

        if (!title.trim()) {
            alert("သတင်းခေါင်းစဉ် ထည့်သွင်းပါ။");
            return;
        }
        if (!category) {
            alert("ကဏ္ဍ ရွေးချယ်ပါ။");
            return;
        }
        if (!content || content === "<p></p>") {
            alert("သတင်းအကြောင်းအရာ ရေးသားပါ။");
            return;
        }

        try {
            let bannerImageUrls: string[] = [];

            // ── Step 1: Upload images to S3 (if selected) ──────────
            if (imageFiles.length > 0) {
                const uploadFormData = new FormData();
                // The backend's multer is configured to look for a field named "images"
                imageFiles.forEach((file) => {
                    uploadFormData.append("images", file);
                });

                // Use RTK Query mutation
                const uploadResult = await uploadImageToS3(uploadFormData).unwrap();
                console.log("✅ S3 upload results:", uploadResult);
                bannerImageUrls = uploadResult.urls;
            }

            // ── Step 2: Create the news article (plain JSON) ──────────────
            await createNews({
                title: title.trim(),
                category,
                content,
                status,
                images: bannerImageUrls,
            }).unwrap();

            // ── Step 3: Redirect on success ────────────────────────────────
            navigate("/admin/news");

        } catch (err: any) {
            console.error("❌ Failed to post news:", err);
            const message = err?.data?.message || err?.message || "သတင်းတင်ခြင်း မအောင်မြင်ပါ။";
            alert(message);
        }
    };

    return (
        <div className="container mx-auto max-w-5xl py-8 animate-in fade-in duration-500">

            {/* ── Page Header ─────────────────────────────────────────── */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate("/admin/news")}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-[#808080] pl-3 padauk-bold">
                        သတင်းအသစ် ဖန်တီးရန်
                    </h1>
                    <p className="text-slate-500 mt-1 padauk-regular">
                        ဝက်ဘ်ဆိုက်တွင် ဖော်ပြမည့် သတင်းအချက်အလက်များကို ရေးသားပါ။
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="space-y-6">

                    {/* ── Title & Category Row ──────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 padauk-bold">
                                သတင်းခေါင်းစဉ် <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="news-title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="ခေါင်းစဉ် ရိုက်ထည့်ပါ..."
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular"
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 padauk-bold">
                                ကဏ္ဍ (Category) <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="news-category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular"
                            >
                                <option value="">ရွေးချယ်ပါ</option>
                                <option value="Activities">လှုပ်ရှားမှုများ</option>
                                <option value="Services">ဝန်ဆောင်မှုများ</option>
                                <option value="Districts">ခရိုင်များ</option>
                                <option value="Announcements">ထုတ်ပြန်ချက်နှင့် ညွှန်ကြားချက်များ (Announcement & Directives)</option>
                                <option value="About">ဌာနအကြောင်း</option>
                                <option value="Contact">ဆက်သွယ်ရန်</option>
                                <option value="HotNews">အထူးသတင်း (Hot News Ticker)</option>
                            </select>
                        </div>
                    </div>

                    {/* ── Banner Image Upload ───────────────────────────── */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold flex items-center gap-2">
                            <ImageIcon size={16} className="text-[#808080]" />
                            သတင်းဓာတ်ပုံများ (အများဆုံး ၅ ပုံ)
                        </label>

                        {/* Image Preview Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-slate-600 hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                        title="ပုံဖျက်မည်"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}

                            {/* Drop Zone / Add Button */}
                            {imageFiles.length < 5 && (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-[#808080] hover:bg-[#808080]/5 transition-all group"
                                >
                                    <UploadCloud
                                        size={24}
                                        className="mb-2 text-slate-300 group-hover:text-[#808080] transition-colors"
                                    />
                                    <p className="text-slate-500 text-[10px] padauk-regular">
                                        ထပ်တိုးရန်
                                    </p>
                                </div>
                            )}
                        </div>

                        {imageFiles.length === 0 && (
                            <p className="text-slate-400 text-xs mt-1">
                                PNG, JPG, WEBP — 10MB အထိ (၅ ပုံအထိ တင်နိုင်သည်)
                            </p>
                        )}

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            id="news-image"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                    </div>

                    {/* ── Rich Text Editor ──────────────────────────────── */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold">
                            သတင်းအပြည့်အစုံ <span className="text-red-500">*</span>
                        </label>
                        <TipTapEditor content={content} onChange={setContent} />
                    </div>

                    {/* ── Action Buttons ─────────────────────────────────── */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, "Draft")}
                            disabled={isLoading}
                            className="px-6 py-3 font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors padauk-regular disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            မူကြမ်းအဖြစ် သိမ်းမည်
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, "Published")}
                            disabled={isLoading}
                            className="px-6 py-3 font-semibold text-white bg-[#808080] border border-[#808080] rounded-xl hover:bg-[#555555] transition-colors flex items-center gap-2 padauk-bold shadow-md shadow-[#808080]/20 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading && <Loader2 size={18} className="animate-spin" />}
                            {isLoading ? "တင်နေသည်..." : "လွှင့်တင်မည်"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

