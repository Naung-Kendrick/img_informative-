import { useState, useEffect, useRef } from "react";
import {
    useGetAboutContentQuery,
    useSaveAboutContentMutation
} from "../../store/aboutApiSlice";
import { useUploadImageToS3Mutation } from "../../store/newsApiSlice";
import { Loader2, UploadCloud, ImageIcon, X, Save } from "lucide-react";
import { useModal } from "../../context/ModalContext";

export default function AboutManagement() {
    const { data, isLoading: isFetching } = useGetAboutContentQuery({});
    const [saveAboutContent, { isLoading: isSaving }] = useSaveAboutContentMutation();
    const [uploadImageToS3, { isLoading: isUploading }] = useUploadImageToS3Mutation();
    const { showSuccess, showError } = useModal();

    const isLoading = isSaving || isUploading || isFetching;

    // ── Form State ──────────────────────────────────────────────────────────
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [policy, setPolicy] = useState("");
    const [objective, setObjective] = useState("");
    const [duty, setDuty] = useState("");
    const [mainTasks, setMainTasks] = useState("");
    const [uniformDescription, setUniformDescription] = useState("");
    const [uniform1Name, setUniform1Name] = useState("");
    const [uniform2Name, setUniform2Name] = useState("");

    // ── Image State ─────────────────────────────────────────────────────────
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [uniform1ImageFile, setUniform1ImageFile] = useState<File | null>(null);
    const [uniform1ImagePreview, setUniform1ImagePreview] = useState<string>("");
    const fileInput1Ref = useRef<HTMLInputElement>(null);

    const [uniform2ImageFile, setUniform2ImageFile] = useState<File | null>(null);
    const [uniform2ImagePreview, setUniform2ImagePreview] = useState<string>("");
    const fileInput2Ref = useRef<HTMLInputElement>(null);

    // Initialize state from existing data
    useEffect(() => {
        if (data?.about) {
            setTitle(data.about.title || "");
            setDescription(data.about.description || "");
            setPolicy(data.about.policy || "");
            setObjective(data.about.objective || "");
            setDuty(data.about.duty || "");
            setMainTasks(data.about.mainTasks || "");
            setImagePreview(data.about.imageUrl || "");
            setUniformDescription(data.about.uniformDescription || "");
            setUniform1Name(data.about.uniform1Name || "");
            setUniform2Name(data.about.uniform2Name || "");
            setUniform1ImagePreview(data.about.uniform1Image || "");
            setUniform2ImagePreview(data.about.uniform2Image || "");
        }
    }, [data]);

    // ── Handlers ────────────────────────────────────────────────────────────
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate type & size (10 MB cap)
        if (!file.type.startsWith("image/")) {
            showError("မှားယွင်းသော ဖိုင်အမျိုးအစား", `${file.name} သည် ပုံဖိုင် မဟုတ်ပါ။`);
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            showError("ဖိုင်အရွယ်အစား ကြီးလွန်းသည်", `${file.name} သည် 10MB ထက် ကြီးနေပါသည်။`);
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleUniformImageSelect = (e: React.ChangeEvent<HTMLInputElement>, setFile: any, setPreview: any, ref: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            showError("မှားယွင်းသော ဖိုင်အမျိုးအစား", "ပုံဖိုင် မဟုတ်ပါ။");
            return;
        }
        setFile(file);
        setPreview(URL.createObjectURL(file));
        if (ref.current) ref.current.value = "";
    };

    const handleRemoveImage = () => {
        if (imageFile) URL.revokeObjectURL(imagePreview);
        setImageFile(null);
        setImagePreview(""); 
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim() || !policy.trim() || !objective.trim() || !duty.trim() || !mainTasks.trim()) {
            showError("အချက်အလက် မပြည့်စုံပါ", "အချက်အလက်အားလုံး ပြည့်စုံစွာ ထည့်သွင်းပါ။");
            return;
        }

        try {
            let finalImageUrl = imagePreview; 
            let finalUniform1Image = uniform1ImagePreview;
            let finalUniform2Image = uniform2ImagePreview;

            // Step 1: Upload images
            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append("images", imageFile); 
                const uploadResult = await uploadImageToS3(uploadFormData).unwrap();
                if (uploadResult?.urls?.length > 0) finalImageUrl = uploadResult.urls[0];
            }
            if (uniform1ImageFile) {
                const fd = new FormData();
                fd.append("images", uniform1ImageFile); 
                const res = await uploadImageToS3(fd).unwrap();
                if (res?.urls?.length > 0) finalUniform1Image = res.urls[0];
            }
            if (uniform2ImageFile) {
                const fd = new FormData();
                fd.append("images", uniform2ImageFile); 
                const res = await uploadImageToS3(fd).unwrap();
                if (res?.urls?.length > 0) finalUniform2Image = res.urls[0];
            }

            // Step 2: Save About Content
            await saveAboutContent({
                title: title.trim(),
                description: description.trim(),
                policy: policy.trim(),
                objective: objective.trim(),
                duty: duty.trim(),
                mainTasks: mainTasks.trim(),
                imageUrl: finalImageUrl,
                uniformDescription: uniformDescription.trim(),
                uniform1Name: uniform1Name.trim(),
                uniform2Name: uniform2Name.trim(),
                uniform1Image: finalUniform1Image,
                uniform2Image: finalUniform2Image,
            }).unwrap();

            showSuccess("အောင်မြင်ပါသည်", "ဌာနအကြောင်း အချက်အလက်များ အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ။");
            
            setImageFile(null);
            setUniform1ImageFile(null);
            setUniform2ImageFile(null);
            setImagePreview(finalImageUrl);
            setUniform1ImagePreview(finalUniform1Image);
            setUniform2ImagePreview(finalUniform2Image);

        } catch (err: any) {
            console.error("❌ Failed to save about content:", err);
            const message = err?.data?.message || err?.message || "သိမ်းဆည်းခြင်း မအောင်မြင်ပါ။";
            showError("မအောင်မြင်ပါ", message);
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

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold">
                            ဆောင်ရွက်လျက်ရှိသော လုပ်ငန်းတာဝန် (Responsibilities) <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={duty}
                            onChange={(e) => setDuty(e.target.value)}
                            rows={4}
                            placeholder="ဆောင်ရွက်လျက်ရှိသော လုပ်ငန်းတာဝန်များကို ရေးသားပါ..."
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all padauk-regular resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold">
                            အဓိကလုပ်ငန်းတာဝန်ကြီး(၂)ရပ် (Main Tasks) <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={mainTasks}
                            onChange={(e) => setMainTasks(e.target.value)}
                            rows={4}
                            placeholder="အဓိကလုပ်ငန်းတာဝန်ကြီး(၂)ရပ်ကို ရေးသားပါ..."
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all padauk-regular resize-none"
                        />
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
                                <img loading="lazy"
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

                {/* ── UNIFORM SECTIONS ───────────────────────────── */}
                <div className="space-y-6 pt-6 border-t border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 padauk-bold">Department Uniform (ဌာနဝတ်စုံ)</h2>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 padauk-bold">
                            ဝတ်စုံ ဖော်ပြချက် (Uniform Description)
                        </label>
                        <textarea
                            value={uniformDescription}
                            onChange={(e) => setUniformDescription(e.target.value)}
                            rows={3}
                            placeholder="Standard-issue uniforms of the Immigration Department..."
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all padauk-regular resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Uniform 1 */}
                        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-700 padauk-bold">Uniform 1</h3>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600">အမည် (Name)</label>
                                <input
                                    type="text"
                                    value={uniform1Name}
                                    onChange={(e) => setUniform1Name(e.target.value)}
                                    placeholder="Field Service Uniform — TI - 0010"
                                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all padauk-regular"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600">ပုံ (Image)</label>
                                {uniform1ImagePreview ? (
                                    <div className="relative group w-full aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 bg-white">
                                        <img src={uniform1ImagePreview} className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => { setUniform1ImagePreview(""); setUniform1ImageFile(null); }} className="absolute top-2 right-2 p-1.5 bg-white shadow-md rounded-full text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div onClick={() => fileInput1Ref.current?.click()} className="w-full aspect-[3/4] border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary bg-white">
                                        <UploadCloud size={20} className="mb-2 text-slate-300" />
                                        <p className="text-slate-500 text-[10px] padauk-regular">ပုံရွေးရန်</p>
                                    </div>
                                )}
                                <input ref={fileInput1Ref} type="file" accept="image/*" onChange={(e) => handleUniformImageSelect(e, setUniform1ImageFile, setUniform1ImagePreview, fileInput1Ref)} className="hidden" />
                            </div>
                        </div>

                        {/* Uniform 2 */}
                        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-700 padauk-bold">Uniform 2</h3>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600">အမည် (Name)</label>
                                <input
                                    type="text"
                                    value={uniform2Name}
                                    onChange={(e) => setUniform2Name(e.target.value)}
                                    placeholder="Field Service Uniform — TI-0099"
                                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all padauk-regular"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-600">ပုံ (Image)</label>
                                {uniform2ImagePreview ? (
                                    <div className="relative group w-full aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 bg-white">
                                        <img src={uniform2ImagePreview} className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => { setUniform2ImagePreview(""); setUniform2ImageFile(null); }} className="absolute top-2 right-2 p-1.5 bg-white shadow-md rounded-full text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div onClick={() => fileInput2Ref.current?.click()} className="w-full aspect-[3/4] border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary bg-white">
                                        <UploadCloud size={20} className="mb-2 text-slate-300" />
                                        <p className="text-slate-500 text-[10px] padauk-regular">ပုံရွေးရန်</p>
                                    </div>
                                )}
                                <input ref={fileInput2Ref} type="file" accept="image/*" onChange={(e) => handleUniformImageSelect(e, setUniform2ImageFile, setUniform2ImagePreview, fileInput2Ref)} className="hidden" />
                            </div>
                        </div>
                    </div>
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
