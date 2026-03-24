import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    ChevronDown,
    Headphones,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllFaqsQuery } from "../store/faqApiSlice";

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-border/50 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 flex items-center justify-between text-left group"
            >
                <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors padauk-bold">
                    {question}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 pb-6 text-muted-foreground leading-relaxed padauk-regular">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const HelpCenter = () => {
    const { t } = useTranslation();
    const { data: faqsData, isLoading: isFaqsLoading } = useGetAllFaqsQuery();
    const faqsList = faqsData?.faqs?.filter(f => f.isActive).sort((a, b) => a.order - b.order) || [];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10 opacity-50" />
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none select-none">
                    <img loading="lazy" src="/photo_2026-03-09_14-35-44-removebg-preview.png" alt="" className="w-[800px] h-auto absolute -top-40 -right-40 rotate-12" />
                </div>

                <div className="container-custom relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary-foreground bg-primary/20 backdrop-blur-md border border-white/10 rounded-full uppercase">
                            {t("nav.helpCenter")}
                        </span>
                        <h1 className="h1 text-white mb-6 uppercase tracking-tighter">
                            {t("help.title")}
                        </h1>
                        <p className="p-lead text-white/70 max-w-2xl mx-auto mb-10">
                            {t("help.subtitle")}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24 container-custom">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="h2 mb-4">Frequently Asked Questions</h2>
                        <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
                    </div>

                    <div className="space-y-4">
                        {isFaqsLoading ? (
                            <div className="text-center text-muted-foreground py-10 padauk-regular flex justify-center items-center gap-2">
                                <span className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" /> Loading FAQs...
                            </div>
                        ) : faqsList.length > 0 ? (
                            faqsList.map((faq, idx) => (
                                <motion.div
                                    key={faq._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                >
                                    <FAQItem question={faq.question} answer={faq.answer} />
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center text-muted-foreground padauk-regular py-10 bg-slate-50 rounded-2xl border border-slate-100">
                                FAQ တစ်စုံတစ်ရာ မရှိသေးပါ။
                            </div>
                        )}
                    </div>

                    {/* Contact Support CTA */}
                    <div className="mt-20 p-10 bg-slate-50 rounded-[3rem] border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-primary">
                                <Headphones size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold padauk-bold">{t("help.contactSupport")}</h3>
                                <p className="text-muted-foreground">{t("help.contactDesc")}</p>
                            </div>
                        </div>
                        <Link to="/contact" className="px-10 py-4 bg-foreground text-background rounded-full font-bold hover:bg-slate-800 transition-all active:scale-95 whitespace-nowrap">
                            Contact Support
                        </Link>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default HelpCenter;
