import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, Loader2, Flag } from 'lucide-react';
import { useCreateReportMutation } from '../store/reportApiSlice';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    newsId: string;
    newsTitle: string;
}

const REPORT_REASONS = [
    "အမုန်းစကားများ (Hate Speech)",
    "သတင်းအမှားများ (Misinformation)",
    "အကြမ်းဖက်မှု လှုံ့ဆော်ခြင်း (Violence)",
    "မူပိုင်ခွင့်ချိုးဖောက်ခြင်း (Copyright)",
    "အခြားအကြောင်းအရာ (Other)"
];

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, newsId, newsTitle }) => {
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [createReport, { isLoading }] = useCreateReportMutation();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason) return;

        try {
            await createReport({ newsId, reason, details }).unwrap();
            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                setReason("");
                setDetails("");
                onClose();
            }, 3000);
        } catch (error) {
            console.error("Failed to submit report:", error);
            alert("Report တင်သွင်းမှု မအောင်မြင်ပါ။ နောက်မှ ပြန်လည်ကြိုးစားပေးပါ။");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                            <Flag size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 padauk-bold">သတင်းအား တိုင်ကြားရန်</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {isSubmitted ? (
                    <div className="p-12 text-center animate-in fade-in zoom-in duration-500">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={40} />
                            </div>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-2 padauk-bold">တင်သွင်းမှု အောင်မြင်ပါသည်</h4>
                        <p className="text-slate-500 padauk-regular">သင်၏ တိုင်ကြားမှုကို စီမံခန့်ခွဲသူများမှ အမြန်ဆုံး စစ်ဆေးသွားမည် ဖြစ်ပါသည်။</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Reported Item</p>
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                <p className="text-sm font-bold text-slate-700 line-clamp-2 leading-relaxed">{newsTitle}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">တိုင်ကြားလိုသည့် အကြောင်းအရင်း</label>
                            <div className="grid grid-cols-1 gap-2">
                                {REPORT_REASONS.map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setReason(r)}
                                        className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${reason === r
                                                ? "bg-primary/5 border-primary text-primary ring-2 ring-primary/20"
                                                : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                            }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">အသေးစိတ် အချက်အလက် (Optional)</label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="အသေးစိတ် ရေးသားရန်..."
                                className="w-full h-32 px-4 py-3 rounded-2xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none text-sm"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                            >
                                မလုပ်တော့ပါ
                            </button>
                            <button
                                type="submit"
                                disabled={!reason || isLoading}
                                className="flex-[2] px-6 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <AlertTriangle size={18} />}
                                အစီရင်ခံစာ ပို့မည်
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ReportModal;
