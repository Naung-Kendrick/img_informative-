import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TipTapEditor from "../../components/admin/TipTapEditor";
import { useCreateNewsMutation, useUploadImageToS3Mutation } from "../../store/newsApiSlice";
import { useGetAllCategoriesQuery } from "../../store/categoryApiSlice";
import { useGetAllDistrictsQuery } from "../../store/districtApiSlice";
import { Loader2, ArrowLeft, UploadCloud, ImageIcon, X, MapPin, PlusCircle, RotateCcw, AlertCircle, Calendar } from "lucide-react";
import { useModal } from "../../context/ModalContext";
import { addWatermarkToImage } from "../../lib/watermark";
import { embedDateInContent } from "../../lib/dateUtils";

export default function CreateNews() {
    const navigate = useNavigate();
    const { showSuccess, showError } = useModal();

    // ── Form State ──────────────────────────────────────────────────────────
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");

    // District State
    const [district, setDistrict] = useState("");
    const [customDistrict, setCustomDistrict] = useState("");
    const [isCustomDistrict, setIsCustomDistrict] = useState(false);


    const [content, setContent] = useState("<p>သတင်းအကြောင်းအရာများကို ဤနေရာတွင် စတင်ရေးသားပါ...</p>");
    const [createdAt, setCreatedAt] = useState(new Date().toISOString().split("T")[0]);

    // ── Image State ─────────────────────────────────────────────────────────
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── RTK Query Mutations ─────────────────────────────────────────────────
    const [createNews, { isLoading: isCreating }] = useCreateNewsMutation();
    const [uploadImageToS3, { isLoading: isUploading }] = useUploadImageToS3Mutation();
    const catQuery = useGetAllCategoriesQuery();
    const districtsQuery = useGetAllDistrictsQuery();
    const { isLoading: isCatLoading } = catQuery;
    const { isLoading: isDistrictsLoading } = districtsQuery;

    const isLoading = isCreating || isUploading || isCatLoading || isDistrictsLoading;
    const categoriesList = catQuery.data?.categories || [];
    const districtsList = districtsQuery.data || [];

    // ── Handlers ────────────────────────────────────────────────────────────
    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length === 0) return;

        if (imageFiles.length + selectedFiles.length > 5) {
            showError("ပမာဏ များပြားနေပါသည်", "အများဆုံး ပုံ ၅ ပုံသာ တင်နိုင်ပါသည်။");
            return;
        }

        const validFiles: File[] = [];
        const validPreviews: string[] = [];

        for (const file of selectedFiles) {
            if (!file.type.startsWith("image/")) {
                showError("မှားယွင်းမှု", `${file.name} သည် ပုံဖိုင် မဟုတ်ပါ။`);
                continue;
            }
            if (file.size > 10 * 1024 * 1024) {
                showError("ဖိုင်အရွယ်အစား ကြီးလွန်းသည်", `${file.name} သည် 10MB ထက် ကြီးနေပါသည်။`);
                continue;
            }

            try {
                // Apply watermark
                const watermarkedFile = await addWatermarkToImage(file);
                validFiles.push(watermarkedFile);
                validPreviews.push(URL.createObjectURL(watermarkedFile));
            } catch (err) {
                console.error("Watermark failed:", err);
                validFiles.push(file);
                validPreviews.push(URL.createObjectURL(file));
            }
        }

        setImageFiles((prev) => [...prev, ...validFiles]);
        setImagePreviews((prev) => [...prev, ...validPreviews]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemoveImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.MouseEvent, status: "Draft" | "Published") => {
        e.preventDefault();

        if (!title.trim()) { showError("လိုအပ်ချက်", "သတင်းခေါင်းစဉ် ထည့်သွင်းပါ။"); return; }
        if (!category) { showError("လိုအပ်ချက်", "ကဏ္ဍ ရွေးချယ်ပါ။"); return; }
        if (!content || content === "<p></p>") { showError("လိုအပ်ချက်", "သတင်းအကြောင်းအရာ ရေးသားပါ။"); return; }

        try {
            let bannerImageUrls: string[] = [];
            if (imageFiles.length > 0) {
                const uploadFormData = new FormData();
                imageFiles.forEach((file) => uploadFormData.append("images", file));
                const uploadResult = await uploadImageToS3(uploadFormData).unwrap();
                bannerImageUrls = uploadResult.urls;
            }

            // Determine final values
            const finalDistrict = isCustomDistrict ? customDistrict : district;
            const customIsoDate = new Date(createdAt).toISOString();
            const persistentContent = embedDateInContent(content, customIsoDate);

            await createNews({
                title: title.trim(),
                category,
                content: persistentContent,
                status,
                images: bannerImageUrls,
                district: finalDistrict || undefined,
                createdAt: customIsoDate,
                publishedDate: customIsoDate,
            }).unwrap();

            showSuccess(
                "အောင်မြင်ပါသည်",
                status === "Published" ? "သတင်းကို အောင်မြင်စွာ လွှင့်တင်ပြီးပါပြီ" : "သတင်းကို မူကြမ်းအဖြစ် သိမ်းဆည်းပြီးပါပြီ",
                () => navigate("/admin/news")
            );
        } catch (err: any) {
            console.error("❌ Failed to post news:", err);
            showError("မအောင်မြင်ပါ", err?.data?.message || err?.message || "သတင်းတင်ခြင်း မအောင်မြင်ပါ။");
        }
    };

    return (
        <div className="container mx-auto max-w-5xl py-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate("/admin/news")} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 padauk-bold">
                                သတင်းခေါင်းစဉ် <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="ခေါင်းစဉ် ရိုက်ထည့်ပါ..."
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular"
                            />
                        </div>

                    <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 padauk-bold">
                                ကဏ္ဍ (Category) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    disabled={isCatLoading}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular disabled:opacity-50 appearance-none"
                                >
                                    <option value="">{isCatLoading ? "Loading Categories..." : "ရွေးချယ်ပါ"}</option>
                                    <option value="HotNews" className="font-bold text-amber-600 bg-amber-50">🔥 အထူးသတင်းများ (Ticker)</option>
                                    {categoriesList.map(cat => (
                                        <option key={cat._id} value={cat.slug}>{cat.title}</option>
                                    ))}
                                </select>
                                {catQuery.error && (
                                    <div className="flex items-center gap-1 text-red-500 text-[10px] mt-1">
                                        <AlertCircle size={10} /> ဖွင့်၍မရပါ
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 padauk-bold flex items-center gap-2">
                                <Calendar size={16} className="text-[#808080]" />
                                သတင်းတင်သည့်ရက်စွဲ (Published Date)
                            </label>
                            <input
                                type="date"
                                value={createdAt}
                                onChange={(e) => setCreatedAt(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular cursor-pointer"
                            />
                        </div>

                        {/* District Row ── inside same grid */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-slate-700 padauk-bold flex items-center gap-2">
                                    <MapPin size={16} className="text-[#808080]" />
                                    ရုံးခွဲ (Immigration Office)
                                </label>
                                <button
                                    onClick={() => {
                                        setIsCustomDistrict(!isCustomDistrict);
                                        setDistrict("");
                                        setCustomDistrict("");
                                    }}
                                    className="text-[10px] text-[#808080] hover:underline font-bold flex items-center gap-1"
                                >
                                    {isCustomDistrict ? <><RotateCcw size={10} /> Default List</> : <><PlusCircle size={10} /> Custom Add</>}
                                </button>
                            </div>

                            <div className="relative">
                                {isCustomDistrict ? (
                                    <input
                                        type="text"
                                        value={customDistrict}
                                        onChange={(e) => setCustomDistrict(e.target.value)}
                                        placeholder="ရုံးခွဲအမည် ရိုက်ထည့်ပါ..."
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular"
                                    />
                                ) : (
                                    <select
                                        value={district}
                                        onChange={(e) => {
                                            setDistrict(e.target.value);
                                        }}
                                        disabled={isDistrictsLoading}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular cursor-pointer disabled:opacity-50 appearance-none"
                                    >
                                        <option value="">{isDistrictsLoading ? "Loading..." : "ရုံးခွဲ ရွေးချယ်ပါ"}</option>
                                        {[...districtsList].sort((a,b) => a.name.localeCompare(b.name)).map(d => (
                                            <option key={d._id} value={d.name}>{d.name}</option>
                                        ))}
                                    </select>
                                )}
                                {districtsQuery.error && (
                                    <div className="flex items-center gap-1 text-red-500 text-[10px] mt-1">
                                        <AlertCircle size={10} /> ရုံးခွဲများ ရယူ၍မရပါ
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold flex items-center gap-2">
                            <ImageIcon size={16} className="text-[#808080]" />
                            သတင်းဓာတ်ပုံများ (အများဆုံး ၅ ပုံ)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                    <img loading="lazy" src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-slate-600 hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            {imageFiles.length < 5 && (
                                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-[#808080] hover:bg-[#808080]/5 transition-all group">
                                    <UploadCloud size={24} className="mb-2 text-slate-300 group-hover:text-[#808080] transition-colors" />
                                    <p className="text-slate-500 text-[10px] padauk-regular">ထပ်တိုးရန်</p>
                                </div>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold">
                            သတင်းအပြည့်အစုံ <span className="text-red-500">*</span>
                        </label>
                        <TipTapEditor content={content} onChange={setContent} />
                    </div>

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
