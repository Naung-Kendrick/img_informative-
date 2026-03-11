import { Trash2, X } from "lucide-react";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    isDeleting?: boolean;
}

export default function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title = "မှတ်ချက်ကို ဖျက်ရန် သေချာပါသလား?",
    description = "ဤမှတ်ချက်ကို ဖျက်ပြီးပါက ပြန်လည်ရယူနိုင်မည် မဟုတ်ပါ။",
    isDeleting = false
}: ConfirmDeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with sophisticated blur */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div
                className="relative w-full max-w-[400px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200"
            >
                {/* Header/Close */}
                <div className="flex justify-end p-4 absolute top-0 right-0 z-10">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all active:scale-90"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-8 pb-10">
                    {/* Visual Indicator - Sophisticated Red Accent */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-inner border border-rose-100/50">
                            <Trash2 size={28} strokeWidth={2} />
                        </div>
                    </div>

                    {/* Typography Layout */}
                    <div className="text-center space-y-3 mb-10">
                        <h3 className="text-xl font-bold text-slate-900 padauk-bold leading-tight px-4">
                            {title}
                        </h3>
                        {description && (
                            <p className="text-slate-500 padauk-regular text-sm leading-relaxed px-6">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Re-using app's button system for consistency */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all active:scale-95 padauk-bold text-sm order-2 sm:order-1"
                        >
                            မလုပ်တော့ပါ
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 px-6 py-3 rounded-xl bg-[#1e3a8a] text-white font-bold hover:bg-[#1e3a8a]/90 transition-all active:scale-95 shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 group padauk-bold text-sm order-1 sm:order-2"
                        >
                            {isDeleting ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Trash2 size={16} />
                                    ဖျက်မည်
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
