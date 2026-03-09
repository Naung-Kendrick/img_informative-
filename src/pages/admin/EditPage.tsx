import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import TipTapEditor from "../../components/admin/TipTapEditor";
import { useGetPageByIdQuery, useUpdatePageMutation } from "../../store/pageApiSlice";
import { useUploadImageToS3Mutation } from "../../store/newsApiSlice"; // Generic S3 upload
import { Loader2, ArrowLeft, Save, Hash, ImageIcon, X, UploadCloud } from "lucide-react";

export default function EditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: page, isLoading: isFetching } = useGetPageByIdQuery(id as string, { skip: !id });
    const [updatePage, { isLoading: isUpdating }] = useUpdatePageMutation();
    const [uploadImageToS3, { isLoading: isUploading }] = useUploadImageToS3Mutation();
    const isLoading = isUpdating || isUploading || isFetching;

    const [title, setTitle] = useState("");
    const [section, setSection] = useState<"services" | "districts">("services");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState<"Draft" | "Published" | "Pending">("Draft");
    const [order, setOrder] = useState<number>(0);

    // ── Image State ─────────────────────────────────────────────────────────
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync state once data is fetched successfully
    useEffect(() => {
        if (page) {
            setTitle(page.title);
            setSection(page.section);
            setContent(page.content);
            setStatus(page.status);
            setOrder(page.order || 0);
            setImagePreview(page.bannerImage || null);
        }
    }, [page]);

    // ── Image Handlers ────────────────────────────────────────────────────────
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("ရွေးချယ်ထားသောဖိုင်သည် ပုံဖိုင် မဟုတ်ပါ။");
            return;
        }

        setImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        // If we had a local blob, revoke it
        if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }
        // Let's either show the old image or none? 
        // If we want they can "delete" the image too.
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) {
            alert("အချက်အလက်အားလုံး ပြည့်စုံစွာ ဖြည့်သွင်းပါ။");
            return;
        }

        try {
            let bannerImageUrl = imagePreview || "";

            // ── Step 1: Upload NEW image to S3 if selected ──────────
            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append("images", imageFile);
                const uploadResult = await uploadImageToS3(uploadFormData).unwrap();
                bannerImageUrl = uploadResult.urls[0];
            }

            // ── Step 2: Update Page ───────────────────────────────────
            await updatePage({
                id: id as string,
                data: { title, section, content, status, order, bannerImage: bannerImageUrl }
            }).unwrap();

            // Redirect back to the correct management section
            navigate(`/admin/${section}`);
        } catch (err) {
            console.error("Failed to update page:", err);
            alert("ပြင်ဆင်ခြင်း မအောင်မြင်ပါ။");
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 text-[#808080] animate-spin" />
            </div>
        );
    }

    if (!page) {
        return (
            <div className="text-center py-20 animate-in fade-in">
                <h2 className="text-2xl font-bold text-slate-800 padauk-bold mb-4">စာမျက်နှာရှာမတွေ့ပါ</h2>
                <Link to="/admin" className="text-[#808080] underline font-medium padauk-regular">
                    ပင်မစာမျက်နှာသို့ ပြန်သွားမည်
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-5xl py-8 animate-in fade-in duration-500">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-[#808080] pl-3 padauk-bold">
                            စာမျက်နှာ ပြင်ဆင်ရန်
                        </h1>
                        <p className="text-slate-500 mt-1 padauk-regular text-sm">
                            ရေးသားပြီးသား အချက်အလက်များကို ပြန်လည်မွမ်းမံပါ။
                        </p>
                    </div>
                </div>

                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${status === 'Published' ? 'bg-green-50 text-green-700 border-green-200' : status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    ယခုအခြေအနေ: {status === 'Published' ? 'လွှင့်တင်ထားသည်' : status === 'Pending' ? 'အတည်ပြုရန်စောင့်ဆိုင်းဆဲ' : 'မူကြမ်း'}
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="space-y-6">

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
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Section */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 padauk-bold">
                                    ကဏ္ဍ (Section)
                                </label>
                                <select
                                    value={section}
                                    onChange={(e) => setSection(e.target.value as any)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular"
                                >
                                    <option value="services">ဝန်ဆောင်မှုများ (Services)</option>
                                    <option value="districts">ခရိုင်များ (Districts)</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 padauk-bold">
                                    အခြေအနေ
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all font-semibold"
                                >
                                    <option value="Draft">Draft (မူကြမ်း)</option>
                                    <option value="Pending">Pending (အတည်ပြုရန်)</option>
                                    <option value="Published">Published (လွှင့်မည်)</option>
                                </select>
                            </div>
                        </div>
                    </div>

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
                            />
                        </div>
                    </div>

                    {/* ── Banner Image Update ───────────────────────────── */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold flex items-center gap-2">
                            <ImageIcon size={16} className="text-[#808080]" />
                            Banner ပုံ (Banner Image)
                        </label>

                        {imagePreview ? (
                            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-w-md">
                                <img
                                    src={imagePreview}
                                    alt="Banner preview"
                                    className="w-full max-h-48 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-slate-600 hover:text-red-500 hover:bg-white transition-all"
                                >
                                    <X size={16} />
                                </button>
                                {imageFile && (
                                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-slate-600 shadow-sm">
                                        ပုံအသစ် - {imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#808080] hover:bg-[#808080]/5 transition-all group max-w-md"
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

                    <div className="space-y-2 min-h-[400px]">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold">
                            စာမျက်နှာအကြောင်းအရာ <span className="text-red-500">*</span>
                        </label>
                        {content !== undefined && <TipTapEditor content={content} onChange={setContent} />}
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors padauk-regular"
                        >
                            မလုပ်ဆောင်ပါ
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="px-6 py-3 font-semibold text-white bg-green-600 border border-green-600 rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 padauk-bold shadow-md shadow-green-600/20 disabled:opacity-60"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {isLoading ? "သိမ်းဆည်းနေသည်..." : "ပြင်ဆင်ထားချက်များကို သိမ်းမည်"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
