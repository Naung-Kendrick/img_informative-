import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";

interface StatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "success" | "error";
    title: string;
    message: string;
}

export default function StatusModal({ isOpen, onClose, type, title, message }: StatusModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 text-center"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Icon */}
                        <div className="mb-6 flex justify-center">
                            <div className={`p-4 rounded-full ${type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                                {type === 'success' ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
                            </div>
                        </div>

                        {/* Text */}
                        <h3 className="text-xl font-bold text-slate-900 mb-2 padauk-bold">
                            {title}
                        </h3>
                        <p className="text-slate-500 padauk-regular leading-relaxed">
                            {message}
                        </p>

                        {/* Button */}
                        <button
                            onClick={onClose}
                            className={`mt-8 w-full py-3.5 px-6 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-95 ${type === 'success'
                                    ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
                                    : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
                                }`}
                        >
                            {type === 'success' ? 'ကောင်းပါပြီ' : 'ပြန်ကြိုးစားမည်'}
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
