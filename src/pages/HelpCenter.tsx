import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ChevronDown,
    ShieldCheck,
    MessageSquare,
    X,
    Send,
    Headphones,
    User
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
    const [chatOpen, setChatOpen] = useState(false);

    // Chat state
    const [messages, setMessages] = useState([
        { id: 1, text: t("help.chatbot.welcome"), isBot: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const { data: faqsData, isLoading: isFaqsLoading } = useGetAllFaqsQuery();
    const faqsList = faqsData?.faqs?.filter(f => f.isActive).sort((a, b) => a.order - b.order) || [];
    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const userMsg = {
            id: Date.now(),
            text: inputValue,
            isBot: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI response logic
        setTimeout(() => {
            let botResponse = "I apologize, but I don't have information on that specific topic at the moment. Would you like to contact our official support team?";
            const upperInput = inputValue.toLowerCase();

            if (upperInput.includes("hello") || upperInput.includes("hi")) {
                botResponse = "Hello! I am here to help you with any immigration related queries. How can I assist you today?";
            } else if (upperInput.includes("smartcard") || upperInput.includes("identity")) {
                botResponse = t("help.faq.a1");
            } else if (upperInput.includes("visa")) {
                botResponse = t("help.faq.a2");
            } else if (upperInput.includes("household") || upperInput.includes("registration")) {
                botResponse = t("help.faq.a3");
            } else if (upperInput.includes("security") || upperInput.includes("safe")) {
                botResponse = t("help.faq.a4");
            }

            const botMsg = {
                id: Date.now() + 1,
                text: botResponse,
                isBot: true,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10 opacity-50" />
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none select-none">
                    <img src="/photo_2026-03-09_14-35-44-removebg-preview.png" alt="" className="w-[800px] h-auto absolute -top-40 -right-40 rotate-12" />
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
                        <button className="px-10 py-4 bg-foreground text-background rounded-full font-bold hover:bg-slate-800 transition-all active:scale-95 whitespace-nowrap">
                            Contact Support
                        </button>
                    </div>
                </div>
            </section>

            {/* Chatbot Launcher & UI */}
            <div className="fixed bottom-8 right-8 z-50">
                <button
                    onClick={() => setChatOpen(!chatOpen)}
                    className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 ${chatOpen ? "bg-red-500 rotate-90" : "bg-primary hover:scale-110"}`}
                >
                    {chatOpen ? <X className="text-white w-8 h-8" /> : <MessageSquare className="text-white w-8 h-8" />}
                    {!chatOpen && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                        </span>
                    )}
                </button>

                <AnimatePresence>
                    {chatOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
                            className="absolute bottom-20 right-0 w-[400px] h-[600px] max-w-[calc(100vw-4rem)] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
                        >
                            {/* Chat Header */}
                            <div className="bg-primary p-6 text-white flex items-center gap-4 shrink-0">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <ShieldCheck className="w-7 h-7" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-primary rounded-full" />
                                </div>
                                <div>
                                    <h4 className="font-bold tracking-tight">{t("help.chatbot.title")}</h4>
                                    <p className="text-xs text-white/70 font-bold uppercase tracking-widest">{t("help.chatbot.online")}</p>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex gap-3 ${msg.isBot ? "" : "flex-row-reverse"}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.isBot ? "bg-primary/10" : "bg-slate-200"}`}>
                                            {msg.isBot ? <ShieldCheck size={16} className="text-primary" /> : <User size={16} className="text-slate-600" />}
                                        </div>
                                        <div className="flex flex-col gap-1 max-w-[80%]">
                                            <div className={`p-4 rounded-2xl shadow-sm border text-sm leading-relaxed ${msg.isBot
                                                ? "bg-white border-slate-100 rounded-tl-none text-slate-700 font-medium"
                                                : "bg-primary text-white border-primary rounded-tr-none font-bold"
                                                }`}>
                                                {msg.text}
                                            </div>
                                            <span className={`text-[10px] font-bold text-slate-400 uppercase tracking-widest ${msg.isBot ? "text-left" : "text-right"}`}>
                                                {msg.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <ShieldCheck size={16} className="text-primary" />
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex gap-1 items-center">
                                            <span className="w-1.5 h-1.5 bg-slate-100 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <span className="w-1.5 h-1.5 bg-slate-100 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <span className="w-1.5 h-1.5 bg-slate-100 rounded-full animate-bounce" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Chat Input */}
                            <div className="p-6 bg-white border-t border-border shrink-0">
                                <form
                                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                    className="flex items-center gap-3 bg-slate-50 border border-border rounded-2xl p-2 pl-4"
                                >
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={t("help.chatbot.placeholder")}
                                        className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium"
                                    />
                                    <button
                                        type="submit"
                                        className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                                        disabled={!inputValue.trim() || isTyping}
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                                <p className="text-[10px] text-center text-muted-foreground mt-4 font-bold uppercase tracking-widest opacity-50">
                                    Powered by Federal AI Labs
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default HelpCenter;
