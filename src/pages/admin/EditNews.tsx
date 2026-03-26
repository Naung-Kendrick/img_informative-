import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import TipTapEditor from "../../components/admin/TipTapEditor";
import { useGetNewsByIdQuery, useUpdateNewsMutation, useUploadImageToS3Mutation } from "../../store/newsApiSlice";
import { useGetAllCategoriesQuery } from "../../store/categoryApiSlice";
import { useGetAllDistrictsQuery } from "../../store/districtApiSlice";
import { Loader2, ArrowLeft, Save, ImageIcon, X, UploadCloud, MapPin, AlertCircle, RotateCcw, PlusCircle } from "lucide-react";
import { useModal } from "../../context/ModalContext";

export default function EditNews() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showSuccess, showError } = useModal();

    const { data: article, isLoading: isFetching } = useGetNewsByIdQuery(id as string, { skip: !id });
    const catQuery = useGetAllCategoriesQuery();
    const districtsQuery = useGetAllDistrictsQuery();
    const { isLoading: isCatLoading } = catQuery;
    const { isLoading: isDistrictsLoading } = districtsQuery;
    const categoriesList = catQuery.data?.categories || [];
    const districtsList = districtsQuery.data || [];

    const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation();
    const [uploadImageToS3, { isLoading: isUploading }] = useUploadImageToS3Mutation();
    const isLoading = isUpdating || isUploading || isFetching || isCatLoading || isDistrictsLoading;

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");

    // District State
    const [district, setDistrict] = useState("");
    const [customDistrict, setCustomDistrict] = useState("");
    const [isCustomDistrict, setIsCustomDistrict] = useState(false);

    // Township State - removed

    const [content, setContent] = useState("");
    const [status, setStatus] = useState<"Draft" | "Published" | "Pending">("Draft");

    // ── Image State ─────────────────────────────────────────────────────────
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync state once data is fetched successfully
    useEffect(() => {
        if (article) {
            setTitle(article.title);
            setCategory(article.category);

            // District logic: check if existing value is in database-fetched list
            const dVal = article.district || "";
            const isInList = districtsList.some(d => d.name === dVal);
            if (dVal && !isInList && districtsList.length > 0) {
                // If we have a list but the value isn't there, it's custom
                setIsCustomDistrict(true);
                setCustomDistrict(dVal);
            } else {
                setDistrict(dVal);
            }


            setContent(article.content);
            setStatus(article.status);
            setImagePreviews(article.images || []);
        }
    }, [article, districtsList]);

    // ── Image Handlers ────────────────────────────────────────────────────────
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        const validFiles = files.filter(file => file.type.startsWith("image/"));
        setImageFiles(prev => [...prev, ...validFiles]);
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemoveImage = (index: number) => {
        const previewToRemove = imagePreviews[index];
        if (previewToRemove.startsWith("blob:")) {
            URL.revokeObjectURL(previewToRemove);
            const localFileIndex = imagePreviews.slice(0, index).filter(p => p.startsWith("blob:")).length;
            setImageFiles(prev => prev.filter((_, i) => i !== localFileIndex));
        }
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !category || !content) {
            showError("အချက်အလက် မပြည့်စုံပါ", "အချက်အလက်အားလုံး ပြည့်စုံစွာ ဖြည့်သွင်းပါ။");
            return;
        }

        try {
            let finalImageUrls = imagePreviews.filter(p => !p.startsWith("blob:"));
            if (imageFiles.length > 0) {
                const uploadFormData = new FormData();
                imageFiles.forEach(file => uploadFormData.append("images", file));
                const uploadResult = await uploadImageToS3(uploadFormData).unwrap();
                finalImageUrls = [...finalImageUrls, ...uploadResult.urls];
            }

            const finalDistrict = isCustomDistrict ? customDistrict : district;
            const finalTownship = township;

            await updateNews({
                id: id as string,
                data: {
                    title,
                    category,
                    content,
                    status,
                    images: finalImageUrls,
                    district: finalDistrict || undefined,
                }
            }).unwrap();
            showSuccess("အောင်မြင်ပါသည်", "သတင်းပြင်ဆင်ခြင်း အောင်မြင်ပြီးပါပြီ", () => navigate("/admin/news"));
        } catch (err) {
            console.error("Failed to update news:", err);
            showError("မအောင်မြင်ပါ", "သတင်းပြင်ဆင်ခြင်း မအောင်မြင်ပါ။");
        }
    };


    if (isFetching) {
        return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="h-10 w-10 text-[#808080] animate-spin" /></div>;
    }

    if (!article) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-slate-800 padauk-bold mb-4">သတင်းရှာမတွေ့ပါ</h2>
                <Link to="/admin/news" className="text-[#808080] underline padauk-regular">သတင်းစီမံခန့်ခွဲမှုစာမျက်နှာသို့ ပြန်သွားမည်</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-5xl py-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate("/admin/news")} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"><ArrowLeft size={24} /></button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-[#808080] pl-3 padauk-bold">သတင်း ပြင်ဆင်ရန်</h1>
                        <p className="text-slate-500 mt-1 padauk-regular text-sm">ရေးသားပြီးသား သတင်းအချက်အလက်များကို ပြန်လည်မွမ်းမံပါ။</p>
                    </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${status === 'Published' ? 'bg-green-50 text-green-700 border-green-200' : status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    ယခုအခြေအနေ: {status === 'Published' ? 'လွှင့်တင်ထားသည်' : status === 'Pending' ? 'အတည်ပြုရန်စောင့်ဆိုင်းဆဲ' : 'မူကြမ်း'}
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 padauk-bold">သတင်းခေါင်းစဉ် <span className="text-red-500">*</span></label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 padauk-bold">ကဏ္ဍ (Category)</label>
                                <div className="relative">
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        disabled={isCatLoading}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular disabled:opacity-50 appearance-none"
                                    >
                                        <option value="">{isCatLoading ? "Loading..." : "ရွေးချယ်ပါ"}</option>
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
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 padauk-bold">အခြေအနေပြောင်းရန်</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all font-semibold">
                                    <option value="Draft">Draft (မူကြမ်း)</option>
                                    <option value="Pending">Pending (အတည်ပြုရန်)</option>
                                    <option value="Published">Published (လွှင့်မည်)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {/* District */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-slate-700 padauk-bold flex items-center gap-2">
                                    <MapPin size={16} className="text-[#808080]" />
                                    ရုံးခွဲ (Immigration Office)
                                </label>
                                <button onClick={() => { setIsCustomDistrict(!isCustomDistrict); setDistrict(""); setCustomDistrict(""); }} className="text-[10px] text-[#808080] hover:underline font-bold flex items-center gap-1">
                                    {isCustomDistrict ? <><RotateCcw size={10} /> Default List</> : <><PlusCircle size={10} /> Custom Add</>}
                                </button>
                            </div>
                            <div className="relative">
                                {isCustomDistrict ? (
                                    <input type="text" value={customDistrict} onChange={(e) => setCustomDistrict(e.target.value)} placeholder="ရုံးခွဲအမည် ရိုက်ထည့်ပါ..." className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular" />
                                ) : (
                                    <select
                                        value={district}
                                        onChange={(e) => { setDistrict(e.target.value) }}
                                        disabled={isDistrictsLoading}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all padauk-regular cursor-pointer disabled:opacity-50 appearance-none"
                                    >
                                        <option value="">{isDistrictsLoading ? "Loading..." : "ရုံးခွဲ ရွေးချယ်ပါ"}</option>
                                        {[...districtsList].sort((a,b) => a.name.localeCompare(b.name)).map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
                                    </select>
                                )}
                                {districtsQuery.error && <div className="text-red-500 text-[10px] mt-1">Error loading districts</div>}
                            </div>
                        </div>

                        </div>

                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold flex items-center gap-2"><ImageIcon size={16} className="text-[#808080]" />သတင်းဓာတ်ပုံများ</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {imagePreviews.map((src, index) => (
                                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                                    <img loading="lazy" src={src} alt="" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><X size={14} /></button>
                                    {src.startsWith("blob:") && <div className="absolute bottom-0 inset-x-0 bg-blue-600/80 text-[8px] text-white py-0.5 text-center font-bold uppercase">New</div>}
                                </div>
                            ))}
                            <div onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#808080] hover:bg-[#808080]/5 transition-all group"><UploadCloud size={24} className="text-slate-300 group-hover:text-[#808080] mb-1" /><span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 uppercase">Add Image</span></div>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
                    </div>

                    <div className="space-y-2 min-h-[400px]">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold">သတင်းအပြည့်အစုံ <span className="text-red-500">*</span></label>
                        {content && <TipTapEditor content={content} onChange={setContent} />}
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
                        <button onClick={() => navigate("/admin/news")} className="px-6 py-3 font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors padauk-regular">မလုပ်ဆောင်ပါ</button>
                        <button onClick={handleSubmit} disabled={isLoading} className="px-6 py-3 font-semibold text-white bg-green-600 border border-green-600 rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 padauk-bold shadow-md shadow-green-600/20 disabled:opacity-60">{isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}{isLoading ? "သိမ်းဆည်းနေသည်..." : "ပြင်ဆင်ထားချက်များကို သိမ်းမည်"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
