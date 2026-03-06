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
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── RTK Query Mutations ─────────────────────────────────────────────────
    const [createNews, { isLoading: isCreating }] = useCreateNewsMutation();
    const [uploadImageToS3, { isLoading: isUploading }] = useUploadImageToS3Mutation();
    const isLoading = isCreating || isUploading;

    // ── Handlers ────────────────────────────────────────────────────────────
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate type
        if (!file.type.startsWith("image/")) {
            alert("ရွေးချယ်ထားသောဖိုင်သည် ပုံဖိုင် မဟုတ်ပါ။");
            return;
        }

        // Validate size (10 MB cap — matches backend limit)
        if (file.size > 10 * 1024 * 1024) {
            alert("ပုံဖိုင်သည် 10MB ထက် မကြီးသင့်ပါ။");
            return;
        }

        setImageFile(file);

        // Create a local object URL for instant preview
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        // Reset the file input so the same file can be reselected
        if (fileInputRef.current) fileInputRef.current.value = "";
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
            let bannerImageUrl = "";

            // ── Step 1: Upload image to S3 (if one was selected) ──────────
            if (imageFile) {
                const uploadFormData = new FormData();
                // The backend's multer is configured to look for a field named "file"
                uploadFormData.append("file", imageFile);

                // Use RTK Query mutation — auth token is injected automatically by prepareHeaders
                const uploadResult = await uploadImageToS3(uploadFormData).unwrap();
                console.log("✅ S3 upload result:", uploadResult);
                bannerImageUrl = uploadResult.url;
            }

            // ── Step 2: Create the news article (plain JSON) ──────────────
            // express.json() on the backend parses this correctly.
            // bannerImage is the S3 URL string from Step 1 (or empty if no image).
            await createNews({
                title: title.trim(),
                category,
                content,
                status,
                bannerImage: bannerImageUrl,
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
                                <option value="Politics">နိုင်ငံရေး</option>
                                <option value="Economy">စီးပွားရေး</option>
                                <option value="Local">ဒေသတွင်းသတင်း</option>
                                <option value="Activities">လှုပ်ရှားမှုများ</option>
                                <option value="Announcements">ထုတ်ပြန်ချက်များ</option>
                                <option value="HotNews">အထူးသတင်း (Hot News Ticker)</option>
                            </select>
                        </div>
                    </div>

                    {/* ── Banner Image Upload ───────────────────────────── */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold flex items-center gap-2">
                            <ImageIcon size={16} className="text-[#808080]" />
                            Banner ပုံ (ရွေးချယ်မှုပြု)
                        </label>

                        {imagePreview ? (
                            /* Image Preview Card */
                            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                <img
                                    src={imagePreview}
                                    alt="Banner preview"
                                    className="w-full max-h-64 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-slate-600 hover:text-red-500 hover:bg-white transition-all"
                                    title="ပုံဖျက်မည်"
                                >
                                    <X size={16} />
                                </button>
                                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-slate-600 shadow-sm">
                                    {imageFile?.name} ({(imageFile!.size / 1024).toFixed(0)} KB)
                                </div>
                            </div>
                        ) : (
                            /* Drop Zone */
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#808080] hover:bg-[#808080]/5 transition-all group"
                            >
                                <UploadCloud
                                    size={40}
                                    className="mx-auto mb-3 text-slate-300 group-hover:text-[#808080] transition-colors"
                                />
                                <p className="text-slate-500 text-sm padauk-regular">
                                    ပုံဖိုင် ရွေးချယ်ရန် နှိပ်ပါ
                                </p>
                                <p className="text-slate-400 text-xs mt-1">
                                    PNG, JPG, WEBP — 10MB အထိ
                                </p>
                            </div>
                        )}

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            id="news-image"
                            type="file"
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

