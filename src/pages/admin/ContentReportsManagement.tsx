import { useMemo } from "react";
import {
    useGetAllReportsQuery,
    useMarkReportAsReadMutation,
    useUpdateReportStatusMutation,
    useDeleteReportMutation
} from "../../store/reportApiSlice";
import {
    Flag,
    Loader2,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Clock,
    Trash2,
    ExternalLink,
    MessageSquare,
    Check
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ContentReportsManagement() {
    const { data: reports, isLoading, isError } = useGetAllReportsQuery();
    const [markAsRead] = useMarkReportAsReadMutation();
    const [updateStatus] = useUpdateReportStatusMutation();
    const [deleteReport] = useDeleteReportMutation();

    const stats = useMemo(() => {
        if (!reports) return { pending: 0, resolved: 0, total: 0 };
        return {
            pending: reports.filter(r => r.status === 'Pending').length,
            resolved: reports.filter(r => r.status === 'Resolved').length,
            total: reports.length
        };
    }, [reports]);

    const handleMarkRead = async (id: string) => {
        try {
            await markAsRead(id).unwrap();
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await updateStatus({ id, status }).unwrap();
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("ဤတိုင်ကြားစာကို ဖျက်ရန် သေချာပါသလား?")) return;
        try {
            await deleteReport(id).unwrap();
        } catch (error) {
            console.error("Failed to delete report:", error);
        }
    };

    if (isLoading) return <div className="flex justify-center p-20"><Loader2 size={40} className="animate-spin text-primary" /></div>;

    if (isError) return (
        <div className="flex flex-col items-center justify-center p-20 text-red-500 gap-4 bg-red-50 rounded-3xl border border-red-100 mx-4">
            <AlertCircle size={48} />
            <h3 className="font-bold text-xl padauk-bold text-center">အချက်အလက်များ ရယူရာတွင် ချို့ယွင်းချက်ဖြစ်ပေါ်နေပါသည်။</h3>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 border-l-8 border-rose-500 pl-4 padauk-bold flex items-center gap-3">
                        <Flag className="text-rose-500" size={32} />
                        တိုင်ကြားစာများ စီမံခန့်ခွဲမှု
                    </h1>
                    <p className="text-slate-500 mt-2 padauk-regular font-medium">
                        အသုံးပြုသူများမှ ပေးပို့ထားသော သတင်းတိုင်ကြားစာများကို စစ်ဆေးပြီး အရေးယူဆောင်ရွက်ပါ။
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending</p>
                        <p className="text-xl font-black text-rose-600 leading-none">{stats.pending}</p>
                    </div>
                    <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
                        <p className="text-xl font-black text-slate-800 leading-none">{stats.total}</p>
                    </div>
                </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
                {reports?.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-20 text-center flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                            <CheckCircle2 size={48} />
                        </div>
                        <p className="text-slate-400 font-bold padauk-bold text-lg">တိုင်ကြားစာများ မရှိသေးပါ။</p>
                    </div>
                ) : (
                    reports?.map((report) => (
                        <div
                            key={report._id}
                            className={`group relative bg-white border border-slate-200 rounded-3xl p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 ${!report.isRead ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                            onClick={() => !report.isRead && handleMarkRead(report._id)}
                        >
                            {!report.isRead && (
                                <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary rounded-full border-4 border-slate-50 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                                {/* Reason & Status */}
                                <div className="lg:col-span-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${report.status === 'Pending' ? 'bg-rose-100 text-rose-600' :
                                            report.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                            {report.status === 'Pending' ? <Clock size={12} /> :
                                                report.status === 'Resolved' ? <Check size={12} /> :
                                                    <XCircle size={12} />}
                                            {report.status}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            {new Date(report.createdAt).toLocaleDateString("en-GB")} - {new Date(report.createdAt).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', hour12: true })}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 padauk-bold leading-tight mb-2">
                                        {report.reason}
                                    </h3>
                                    {report.details && (
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600 italic padauk-regular leading-relaxed">
                                            "{report.details}"
                                        </div>
                                    )}
                                </div>

                                {/* Reported Article */}
                                <div className="lg:col-span-4 border-l border-slate-100 pl-6">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <MessageSquare size={12} /> Reported Content
                                    </p>
                                    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
                                        <h4 className="text-[13px] font-bold text-slate-700 padauk-bold line-clamp-2 mb-3 leading-snug">
                                            {report.news?.title || "Deleted/Unknown News"}
                                        </h4>
                                        <Link
                                            to={`/news/${report.news?._id}`}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 text-[10px] font-black text-primary hover:text-primary/80 uppercase tracking-wider transition-colors"
                                        >
                                            View Original <ExternalLink size={12} />
                                        </Link>
                                    </div>
                                </div>

                                {/* Reporter */}
                                <div className="lg:col-span-2 border-l border-slate-100 pl-6">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Reporter</p>
                                    <div className="flex items-center gap-3">
                                        {report.reporter?.avatar ? (
                                            <img src={report.reporter.avatar} className="w-10 h-10 rounded-full border-2 border-slate-100 object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-sm border-2 border-slate-100">
                                                {report.reporter?.name?.charAt(0) || '?'}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-800 truncate padauk-bold">{report.reporter?.name || "နှိုင်းမဲ့ အသုံးပြုသူ"}</p>
                                            <p className="text-[10px] text-slate-400 truncate font-medium">{report.reporter?.email || "Guest"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="lg:col-span-2 flex lg:flex-col items-center justify-end gap-2 pr-2">
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleUpdateStatus(report._id, 'Resolved')}
                                            className={`p-2 rounded-xl border transition-all ${report.status === 'Resolved' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-200 hover:text-emerald-500'}`}
                                            title="Resolved"
                                        >
                                            <CheckCircle2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(report._id, 'Dismissed')}
                                            className={`p-2 rounded-xl border transition-all ${report.status === 'Dismissed' ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-800 hover:text-slate-800'}`}
                                            title="Dismiss"
                                        >
                                            <XCircle size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(report._id)}
                                            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:border-rose-200 hover:text-rose-500 transition-all"
                                            title="Delete permanent"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
