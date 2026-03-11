import {
    useGetAuditLogsQuery,
    useGetAuditLogByIdQuery
} from "../../store/auditLogApiSlice";
import {
    History,
    Search,
    ShieldCheck,
    AlertTriangle,
    Eye,
    ChevronLeft,
    ChevronRight,
    ArrowRightLeft,
    Globe,
    Monitor,
    Shield,
    X,
    Database,
    LogIn,
    CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import { Skeleton } from "../../components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Audit Logs Viewer
 * 🛰️ Professional read-only chronological ledger for system accountability.
 * 🏗️ Features deep-inspection modals for 'before/after' state analysis.
 */
export default function AuditLogs() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

    // 1. RTK Query Hook with pagination & search
    const { data: response, isLoading, isError, isFetching } = useGetAuditLogsQuery({
        page,
        limit: 15,
        search: searchTerm
    });

    // 2. Fetch Detail for Modal
    const { data: detailData } = useGetAuditLogByIdQuery(selectedLogId || "", {
        skip: !selectedLogId
    });

    // 3. Helpers
    const getActionBadge = (action: string) => {
        const base = "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border";
        switch (action) {
            case "CREATE":
                return <span className={cn(base, "bg-emerald-50 text-emerald-700 border-emerald-100")}><CheckCircle2 size={12} /> Created</span>;
            case "UPDATE":
                return <span className={cn(base, "bg-amber-50 text-amber-700 border-amber-100")}><ArrowRightLeft size={12} /> Updated</span>;
            case "DELETE":
                return <span className={cn(base, "bg-rose-50 text-rose-700 border-rose-100")}><AlertTriangle size={12} /> Deleted</span>;
            case "LOGIN":
                return <span className={cn(base, "bg-blue-50 text-blue-700 border-blue-100")}><LogIn size={12} /> Login</span>;
            case "STATUS_CHANGE":
                return <span className={cn(base, "bg-indigo-50 text-indigo-700 border-indigo-100")}><Shield size={12} /> Status</span>;
            default:
                return <span className={cn(base, "bg-slate-50 text-slate-700 border-slate-100")}>{action}</span>;
        }
    };

    if (isError) return (
        <div className="flex h-[80vh] items-center justify-center p-8">
            <div className="text-center space-y-4">
                <ShieldCheck className="h-12 w-12 text-rose-500 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900">Security Breach or Connection Error</h3>
                <p className="text-slate-500">Could not retrieve audit trail. Ensure you have Root permissions.</p>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-700">
            {/* Header section with Stats */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                        <History className="h-12 w-12 text-primary" strokeWidth={3} />
                        Audit Trail
                    </h1>
                    <p className="text-slate-500 font-medium max-w-lg padauk-regular">
                        Chronological record of all administrative actions. This ledger is immutable and serves as the official source of accountability.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search description..."
                            className="bg-white border border-slate-200 pl-11 pr-4 py-3 rounded-2xl w-full md:w-80 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>
            </div>

            {/* Table View */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm relative">
                {isFetching && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-20 flex items-center justify-center">
                        <Skeleton className="h-1 w-full absolute top-0" />
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actor</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Event Description</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Origin</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
                                <th className="px-8 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                Array.from({ length: 10 }).map((_, i) => (
                                    <tr key={i}><td colSpan={6} className="px-8 py-4"><Skeleton className="h-8 w-full rounded-lg" /></td></tr>
                                ))
                            ) : response?.logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-24 text-center">
                                        <Database className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No matching activities found</p>
                                    </td>
                                </tr>
                            ) : (
                                response?.logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-slate-50/80 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-primary font-black text-xs border border-slate-200 overflow-hidden shadow-sm">
                                                    {log.performedBy?.avatar ? (
                                                        <img src={log.performedBy.avatar} className="h-full w-full object-cover" />
                                                    ) : (
                                                        log.actorName?.charAt(0) || "U"
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-slate-900 truncate tracking-tight">{log.actorName}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium truncate">{log.performedBy?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {getActionBadge(log.action)}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="text-[13px] font-bold text-slate-700 leading-tight padauk-bold group-hover:text-primary transition-colors">
                                                    {log.details.description}
                                                </p>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                    {log.resourceType} : {log.resourceId?.slice(-8)}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                                    <Globe size={12} className="text-slate-300" /> {log.ipAddress || "Unknown"}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 max-w-[120px] truncate">
                                                    <Monitor size={12} className="text-slate-300" /> {log.userAgent?.split(' ')[0]}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col text-right">
                                                <span className="text-xs font-bold text-slate-800">{format(new Date(log.createdAt), "dd MMM yyyy")}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{format(new Date(log.createdAt), "HH:mm:ss")}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => setSelectedLogId(log._id)}
                                                className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-90"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Showing {response?.logs.length || 0} / {response?.total || 0} entries
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-primary disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-[11px] font-black text-slate-900 w-12 text-center">
                            {page} / {response?.pages || 1}
                        </span>
                        <button
                            disabled={page === response?.pages}
                            onClick={() => setPage(p => p + 1)}
                            className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-primary disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Forensic Detail Modal */}
            <AnimatePresence>
                {selectedLogId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedLogId(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative bg-white w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Forensic Log Review</h2>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction ID: {selectedLogId}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedLogId(null)}
                                    className="h-10 w-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                                {!detailData ? (
                                    <div className="space-y-4">
                                        <Skeleton className="h-40 w-full rounded-2xl" />
                                        <Skeleton className="h-64 w-full rounded-2xl" />
                                    </div>
                                ) : (
                                    <>
                                        {/* Event Detail Summary */}
                                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-8 justify-between">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</p>
                                                <p className="text-sm font-bold text-slate-800 padauk-bold">{detailData.log.details.description}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource</p>
                                                <p className="text-sm font-bold text-slate-800">{detailData.log.resourceType}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Agent IP</p>
                                                <p className="text-sm font-bold text-slate-800 font-mono tracking-tighter">{detailData.log.ipAddress}</p>
                                            </div>
                                        </div>

                                        {/* State Inspection Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                    Previous State (Before)
                                                </h4>
                                                <div className="bg-slate-900 rounded-2xl p-6 overflow-x-auto min-h-[200px]">
                                                    <pre className="text-[10px] font-mono text-slate-400 leading-relaxed">
                                                        {JSON.stringify(detailData.log.details.before || "No previous state captured", null, 2)}
                                                    </pre>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    Modified State (After)
                                                </h4>
                                                <div className="bg-slate-900 rounded-2xl p-6 overflow-x-auto min-h-[200px] border border-primary/20">
                                                    <pre className="text-[10px] font-mono text-emerald-400 leading-relaxed">
                                                        {JSON.stringify(detailData.log.details.after || "No outcome state captured", null, 2)}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                                            <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                                            <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
                                                Warning: This information represents immutable database records. Unauthorized attempts to alter audit history are tracked.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
