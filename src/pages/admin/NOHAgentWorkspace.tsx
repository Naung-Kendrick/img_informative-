import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    useGetAllReportsQuery,
    useUpdateReportStatusMutation,
    useDeleteReportMutation,
    useMarkReportAsReadMutation,
} from "../../store/reportApiSlice";
import type { Report } from "../../store/reportApiSlice";
import {
    Inbox,
    Search,
    CheckCircle2,
    XCircle,
    User,
    AlertTriangle,
    ExternalLink,
    MoreVertical,
    Trash2,
    Flag,
    ShieldAlert,
    MessageSquare,
    Send
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import { Skeleton } from "../../components/ui/skeleton";
import { LoadingButton } from "../../components/feedback/loading-button";
import { useModal } from "../../context/ModalContext";

/**
 * NOH Agent Workspace
 * 🚀 Specialized "Inbox" style workspace for high-efficiency report processing.
 * 🏗️ Two-column split-pane layout (Queue + Detail).
 */
export default function NOHAgentWorkspace() {
    const { showSuccess, showError } = useModal();
    // 1. RTK Query Hooks
    const { data: reports, isLoading, isError } = useGetAllReportsQuery();
    const [updateStatus, { isLoading: isUpdating }] = useUpdateReportStatusMutation();
    const [markAsRead] = useMarkReportAsReadMutation();
    const [deleteReport] = useDeleteReportMutation();

    // 2. Component State
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"Pending" | "Resolved" | "Dismissed">("Pending");
    const [searchQuery, setSearchQuery] = useState("");

    // 3. Derived Data & Filtering
    const filteredReports = useMemo(() => {
        if (!reports) return [];
        return reports
            .filter(r => r.status === activeTab)
            .filter(r =>
                r.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.news?.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [reports, activeTab, searchQuery]);

    const selectedReport = useMemo(() =>
        reports?.find(r => r._id === selectedId),
        [reports, selectedId]
    );

    // 4. Handlers
    const handleSelectAction = async (report: Report) => {
        setSelectedId(report._id);
        if (!report.isRead) {
            try {
                await markAsRead(report._id).unwrap();
            } catch (err) {
                console.error("Failed to mark as read", err);
            }
        }
    };

    const handleUpdateStatusAction = async (status: 'Resolved' | 'Dismissed' | 'Pending') => {
        if (!selectedId) return;
        try {
            await updateStatus({ id: selectedId, status }).unwrap();
            showSuccess("အောင်မြင်ပါသည်", `စီစစ်မှုအခြေအနေကို ${status} သို့ ပြောင်းလဲပြီးပါပြီ`);
            // If it moved out of the current tab, clear selection
            if (activeTab !== status) {
                setSelectedId(null);
            }
        } catch (err: any) {
            showError("မအောင်မြင်ပါ", err.data?.message || "ပြင်ဆင်ခြင်း မအောင်မြင်ပါ။");
        }
    };

    const handleDeleteAction = async () => {
        if (!selectedId) return;
        // Optimization: Use a confirm dialog from modal context if we have one, 
        // but for now let's just use the toast replacement and keep window.confirm for now if no choice.
        if (!window.confirm("Are you sure you want to permanently delete this report?")) return;
        try {
            await deleteReport(selectedId).unwrap();
            showSuccess("အောင်မြင်ပါသည်", "အစီရင်ခံစာကို ဖျက်သိမ်းပြီးပါပြီ");
            setSelectedId(null);
        } catch (err: any) {
            showError("မအောင်မြင်ပါ", "ဖျက်သိမ်းခြင်း မအောင်မြင်ပါ။");
        }
    };

    // Helper to infer priority for UI polish
    const getPriority = (reason: string) => {
        const highPriorityThemes = ["hate", "violence", "spam", "scam", "harassment"];
        return highPriorityThemes.some(theme => reason.toLowerCase().includes(theme)) ? "High" : "Normal";
    };

    if (isError) return (
        <div className="flex h-[80vh] items-center justify-center p-8">
            <div className="text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900">Failed to load workspace</h3>
                <p className="text-slate-500">Please check your connection and try again.</p>
            </div>
        </div>
    );

    return (
        <div className="flex h-[calc(100vh-140px)] bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-sm animate-in fade-in duration-500">
            {/* LEFT PANE: Queue (1/3) */}
            <div className="w-1/3 flex flex-col border-r border-slate-200 bg-white shadow-sm z-10">
                {/* Header & Tabs */}
                <div className="p-6 border-b border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
                            <Inbox className="h-5 w-5 text-primary" />
                            Agent Queue
                        </h2>
                        <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                            {filteredReports.length} Items
                        </span>
                    </div>

                    <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                        {(['Pending', 'Resolved', 'Dismissed'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setSelectedId(null); }}
                                className={cn(
                                    "flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all",
                                    activeTab === tab
                                        ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                                        : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter queue..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        />
                    </div>
                </div>

                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="p-4 space-y-3">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                            ))}
                        </div>
                    ) : filteredReports.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-slate-400 p-8 text-center">
                            <CheckCircle2 size={32} className="mb-3 opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest">No reports in {activeTab}</p>
                        </div>
                    ) : (
                        <div className="p-2 space-y-1">
                            {filteredReports.map((report) => {
                                const priority = getPriority(report.reason);
                                return (
                                    <motion.button
                                        key={report._id}
                                        onClick={() => handleSelectAction(report)}
                                        whileTap={{ scale: 0.98 }}
                                        className={cn(
                                            "w-full text-left p-4 rounded-2xl transition-all relative group",
                                            selectedId === report._id
                                                ? "bg-primary/5 ring-1 ring-primary/20 shadow-inner"
                                                : "hover:bg-slate-50"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md",
                                                priority === "High" ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500"
                                            )}>
                                                {priority}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                {format(new Date(report.createdAt), "h:mm a")}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1 mb-1 padauk-bold">
                                            {report.reason}
                                        </h4>
                                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                            {report.details || "No additional details provided."}
                                        </p>
                                        {selectedId === report._id && (
                                            <motion.div
                                                layoutId="active-indicator"
                                                className="absolute left-0 top-4 bottom-4 w-1 bg-primary rounded-full"
                                            />
                                        )}
                                        {!report.isRead && (
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT PANE: Detail View (2/3) */}
            <div className="flex-1 flex flex-col bg-white">
                <AnimatePresence mode="wait">
                    {!selectedReport ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex-1 flex flex-col items-center justify-center p-12 text-center"
                        >
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <ShieldAlert className="h-10 w-10 text-slate-200" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-300 tracking-tight mb-2">Workspace Idle</h3>
                            <p className="text-slate-400 max-w-xs text-sm leading-relaxed">
                                Select a report from the queue on the left to begin verification and processing.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={selectedReport._id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 flex flex-col overflow-hidden"
                        >
                            {/* Toolbar */}
                            <div className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-slate-50/50">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Flag className="h-3.5 w-3.5" />
                                        ID: {selectedReport._id.slice(-6)}
                                    </h3>
                                    <div className="h-4 w-px bg-slate-200" />
                                    <span className={cn(
                                        "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider",
                                        selectedReport.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                            selectedReport.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                                                'bg-slate-100 text-slate-700'
                                    )}>
                                        {selectedReport.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleDeleteAction}
                                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <div className="h-4 w-px bg-slate-200 mx-1" />
                                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12 bg-white">
                                {/* Section: Reason */}
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight padauk-bold">
                                        {selectedReport.reason}
                                    </h2>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium padauk-regular">
                                        {selectedReport.details || "The user provided no additional context for this report."}
                                    </p>
                                </div>

                                {/* Section: Reported Item Bridge */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <MessageSquare className="h-3.5 w-3.5" /> Reported Content
                                        </p>
                                        <h4 className="font-bold text-slate-800 line-clamp-2 padauk-bold">
                                            {selectedReport.news?.title || "Original Content Title"}
                                        </h4>
                                        <Link
                                            to={`/news/${selectedReport.news?._id}`}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 text-xs font-bold text-primary group"
                                        >
                                            Inspect Original <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </Link>
                                    </div>

                                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <User className="h-3.5 w-3.5" /> Reporter Identity
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm border-2 border-white shadow-sm overflow-hidden">
                                                {selectedReport.reporter?.avatar ? (
                                                    <img loading="lazy" src={selectedReport.reporter.avatar} className="object-cover h-full w-full" />
                                                ) : (
                                                    selectedReport.reporter?.name?.charAt(0) || "U"
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-slate-800 truncate padauk-bold">{selectedReport.reporter?.name || "Anonymous User"}</p>
                                                <p className="text-[10px] text-slate-400 truncate font-medium tracking-tight">Verified via Cloud ID</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Timeline */}
                                <div className="pt-8 border-t border-slate-50">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Process Timeline</p>
                                    <div className="relative pl-6 space-y-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                                        <div className="relative">
                                            <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white shadow-sm" />
                                            <p className="text-xs font-bold text-slate-800">Report Received</p>
                                            <p className="text-[10px] text-slate-400">{format(new Date(selectedReport.createdAt), "MMMM d, yyyy 'at' h:mm a")}</p>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-white shadow-sm" />
                                            <p className="text-xs font-bold text-slate-800">Opened by Agent</p>
                                            <p className="text-[10px] text-slate-400">Just now</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Bar */}
                            <div className="h-24 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between px-12">
                                <div className="flex gap-3">
                                    <LoadingButton
                                        isSuccess={selectedReport.status === 'Resolved'}
                                        isLoading={isUpdating && selectedReport.status !== 'Resolved'}
                                        onClick={() => handleUpdateStatusAction('Resolved')}
                                        successText="Resolved"
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-11 px-8 font-bold"
                                    >
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Resolve Report
                                    </LoadingButton>

                                    <LoadingButton
                                        isSuccess={selectedReport.status === 'Dismissed'}
                                        isLoading={isUpdating && selectedReport.status !== 'Dismissed'}
                                        onClick={() => handleUpdateStatusAction('Dismissed')}
                                        variant="outline"
                                        successText="Dismissed"
                                        className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 rounded-2xl h-11 px-8 font-bold"
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject Case
                                    </LoadingButton>
                                </div>

                                <button className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-widest px-4 py-2 hover:bg-primary/5 rounded-xl">
                                    <Send className="h-4 w-4" />
                                    Forward to Admin
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
