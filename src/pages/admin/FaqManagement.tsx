import { useState } from "react";
import { useModal } from "../../context/ModalContext";
import { Loader2, Plus, Edit, Trash2, Check, HelpCircle } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import {
    useGetAllFaqsQuery,
    useCreateFaqMutation,
    useUpdateFaqMutation,
    useDeleteFaqMutation
} from "../../store/faqApiSlice";

export default function FaqManagement() {
    const { data: faqsData, isLoading: isFetching } = useGetAllFaqsQuery();
    const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
    const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
    const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();
    const { showSuccess, showError } = useModal();

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [order, setOrder] = useState(0);

    const isLoading = isCreating || isUpdating || isDeleting;

    const resetForm = () => {
        setQuestion("");
        setAnswer("");
        setIsActive(true);
        setOrder(0);
        setEditingId(null);
        setIsAddOpen(false);
    };

    const handleEdit = (faq: any) => {
        setQuestion(faq.question);
        setAnswer(faq.answer);
        setIsActive(faq.isActive);
        setOrder(faq.order);
        setEditingId(faq._id);
        setIsAddOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim() || !answer.trim()) {
            showError("လိုအပ်ချက်", "မေးခွန်းနှင့် အဖြေကို ထည့်သွင်းပါ။");
            return;
        }

        try {
            if (editingId) {
                await updateFaq({
                    id: editingId,
                    data: { question: question.trim(), answer: answer.trim(), isActive, order }
                }).unwrap();
                showSuccess("အောင်မြင်ပါသည်", "FAQ ပြင်ဆင်ခြင်း ပြီးဆုံးပါပြီ။");
            } else {
                await createFaq({ question: question.trim(), answer: answer.trim(), isActive, order }).unwrap();
                showSuccess("အောင်မြင်ပါသည်", "FAQ အသစ်ထည့်သွင်းခြင်း ပြီးဆုံးပါပြီ။");
            }
            resetForm();
        } catch (error: any) {
            console.error("Failed to save FAQ:", error);
            showError("မအောင်မြင်ပါ", "FAQ သိမ်းဆည်းခြင်း မအောင်မြင်ပါ။");
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("ဖျက်မည်ကို သေချာပါသလား? ဤလုပ်ဆောင်ချက်ကို ပြန်ပြင်၍မရပါ။")) {
            deleteFaq(id).unwrap()
                .then(() => showSuccess("အောင်မြင်ပါသည်", "FAQ ဖျက်ခြင်း ပြီးဆုံးပါပြီ။"))
                .catch((err) => {
                    console.error("Failed to delete FAQ:", err);
                    showError("မအောင်မြင်ပါ", "FAQ ဖျက်ခြင်း မအောင်မြင်ပါ။");
                });
        }
    };

    const faqsList = faqsData?.faqs || [];

    return (
        <div className="container mx-auto max-w-5xl py-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 padauk-bold flex items-center gap-2">
                        <HelpCircle className="text-primary" /> FAQ စီမံခန့်ခွဲမှု
                    </h1>
                    <p className="text-secondary font-medium text-sm mt-1 padauk-regular">အမေးများသော မေးခွန်းနှင့် အဖြေများကို ထည့်သွင်းစီမံပါ။</p>
                </div>
                {!isAddOpen && (
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="px-5 py-2.5 font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 padauk-bold shadow-md shadow-primary/20"
                    >
                        <Plus size={18} />
                        FAQ အသစ်ထည့်ရန်
                    </button>
                )}
            </div>

            {isAddOpen && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 animate-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700 padauk-bold">မေးခွန်း (Question) <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="သုံးစွဲသူများ မေးလေ့ရှိသော မေးခွန်းကို ရိုက်ထည့်ပါ..."
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all padauk-regular"
                                />
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700 padauk-bold">အဖြေ (Answer) <span className="text-red-500">*</span></label>
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="ဖော်ပြပါ မေးခွန်းအတွက် ရှင်းလင်းတိကျသော အဖြေကို ရေးသားပါ..."
                                    rows={4}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all padauk-regular resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 padauk-bold">အစီအစဉ် (Order)</label>
                                <input
                                    type="number"
                                    value={order}
                                    onChange={(e) => setOrder(Number(e.target.value))}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all padauk-regular"
                                />
                            </div>

                            <div className="flex items-center space-x-3 mt-8">
                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input
                                        type="checkbox"
                                        name="toggle"
                                        id="toggle-active"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 checked:right-0 checked:border-green-500 transition-all duration-300"
                                    />
                                    <label htmlFor="toggle-active" className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer"></label>
                                </div>
                                <label htmlFor="toggle-active" className="text-sm font-semibold text-slate-700 padauk-bold cursor-pointer">
                                    {isActive ? "Active (ပြသမည့် အခြေအနေ)" : "Inactive (ဖျောက်ထားမည့် အခြေအနေ)"}
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={isLoading}
                                className="px-5 py-2.5 font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors padauk-regular"
                            >
                                မလုပ်ဆောင်ပါ
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-5 py-2.5 font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 padauk-bold shadow-md shadow-primary/20 disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                {editingId ? "ပြင်ဆင်ချက်များ သိမ်းမည်" : "အသစ်သိမ်းမည်"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {isFetching ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100">
                            <Skeleton className="h-6 w-3/4 mb-4" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    ))}
                </div>
            ) : faqsList.length === 0 ? (
                <div className="bg-white border text-slate-500 border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                    <p className="padauk-regular text-lg">FAQ တစ်စုံတစ်ရာ မရှိသေးပါ။</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {faqsList.map((faq) => (
                        <div key={faq._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-bold text-slate-800 padauk-bold">Q: {faq.question}</h3>
                                    <div className="flex items-center gap-2 md:hidden">
                                        <button onClick={() => handleEdit(faq)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(faq._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <p className="text-slate-600 padauk-regular leading-relaxed whitespace-pre-line">
                                    <span className="font-bold mr-1">A:</span>{faq.answer}
                                </p>
                                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100/50 text-[11px] font-bold text-slate-400">
                                    <span>Order: <span className="text-primary">{faq.order}</span></span>
                                    <span className={faq.isActive ? "text-green-500" : "text-slate-400"}>
                                        {faq.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Desktop Actions */}
                            <div className="hidden md:flex flex-col gap-2 min-w-[120px] justify-center border-l items-center border-slate-100 pl-6">
                                <button onClick={() => handleEdit(faq)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 rounded-xl hover:bg-slate-100 hover:text-blue-600 hover:border-blue-200 transition-all padauk-bold"><Edit size={14} /> ပြင်ရန်</button>
                                <button onClick={() => handleDelete(faq._id)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all padauk-bold"><Trash2 size={14} /> ဖျက်ရန်</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
