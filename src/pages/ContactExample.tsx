import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, User, MessageSquare, Send } from "lucide-react";
import { useModal } from "../context/ModalContext";

// Micro-Interaction Components
import { MotionPage, MotionStaggerItem } from "../components/feedback/MotionPage";
import { InteractiveCard } from "../components/feedback/InteractiveCard";
import { LoadingButton } from "../components/feedback/loading-button";

/**
 * Example Contact Form displaying the Micro-Interactions & State Feedback System.
 * 🏗️ Built like a premium Stripe/Vercel dashboard form.
 */
export default function ContactExample() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const { showSuccess, showError } = useModal();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            showError("လိုအပ်ချက်", "Please fill in all required fields.");
            return;
        }

        setStatus("loading");

        // Simulate API Call
        try {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate random success/failure for demonstration
                    if (Math.random() > 0.1) resolve(true);
                    else reject(new Error("Network Error"));
                }, 1500);
            });

            setStatus("success");
            showSuccess("ကျေးဇူးတင်ပါတယ်", "Thank you! Your message has been sent.");
            setFormData({ name: "", email: "", message: "" });

            // Revert button to idle after 3s
            setTimeout(() => setStatus("idle"), 3000);
        } catch (err: any) {
            setStatus("error");
            showError("မအောင်မြင်ပါ", err.message || "Failed to send message.");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <MotionPage className="container mx-auto px-4 py-12 max-w-2xl">
            <MotionStaggerItem>
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
                        Get in Touch
                    </h1>
                    <p className="text-slate-500">
                        Have questions? We'd love to hear from you.
                    </p>
                </div>
            </MotionStaggerItem>

            <MotionStaggerItem>
                <InteractiveCard className="bg-white p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Input Groups */}
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    Full Name
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        disabled={status === "loading"}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        disabled={status === "loading"}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">
                                    Your Message
                                </label>
                                <div className="relative group">
                                    <MessageSquare className="absolute left-3 top-4 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                    <textarea
                                        rows={4}
                                        placeholder="How can we help?"
                                        disabled={status === "loading"}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <LoadingButton
                                type="submit"
                                isLoading={status === "loading"}
                                isSuccess={status === "success"}
                                successText="Sent Successfully!"
                                className="w-full h-12 bg-slate-900 hover:bg-black text-white font-bold text-base shadow-xl"
                            >
                                <Send size={18} className="mr-2" />
                                Send Message
                            </LoadingButton>
                        </div>

                        {status === "error" && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center text-sm font-bold text-rose-600"
                            >
                                Failed to send. Please check your connection.
                            </motion.p>
                        )}
                    </form>
                </InteractiveCard>
            </MotionStaggerItem>

            {/* Trust Badge Section */}
            <MotionStaggerItem>
                <div className="mt-12 flex flex-col items-center justify-center gap-4 text-slate-400">
                    <p className="text-xs font-bold uppercase tracking-widest">Powered by Premium UI System</p>
                    <div className="flex gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                        <div className="h-4 w-12 bg-slate-200 rounded animate-pulse" />
                        <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                        <div className="h-4 w-14 bg-slate-200 rounded animate-pulse" />
                    </div>
                </div>
            </MotionStaggerItem>
        </MotionPage>
    );
}
