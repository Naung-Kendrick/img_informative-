import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetAllAnnouncementsQuery, useDeleteAnnouncementMutation, useUpdateAnnouncementMutation, type Announcement } from "../../store/announcementApiSlice";
import type { RootState } from "../../store";
import { Loader2, Plus, Trash2, Calendar, Eye, AlertCircle, FileText, Check } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import { useModal } from "../../context/ModalContext";

export default function AnnouncementsManagement() {
    const { user } = useSelector((state: RootState) => state.auth);
    const { showSuccess, showError } = useModal();
    const role = user?.role ?? 0;

    const { data: announcements, isLoading, isError, refetch } = useGetAllAnnouncementsQuery(undefined, {
        pollingInterval: 10000,
    });
    const [deleteAnnouncement, { isLoading: isDeleting }] = useDeleteAnnouncementMutation();
    const [updateAnnouncement] = useUpdateAnnouncementMutation();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);

    const canDelete = role >= 3;

    const confirmDelete = async () => {
        if (announcementToDelete) {
            try {
                await deleteAnnouncement(announcementToDelete).unwrap();
                setDeleteModalOpen(false);
                setAnnouncementToDelete(null);
                showSuccess("အောင်မြင်ပါသည်", "ထုတ်ပြန်ချက်ကို အောင်မြင်စွာ ဖျက်သိမ်းပြီးပါပြီ");
                refetch();
            } catch (err) {
                console.error("Failed to delete:", err);
                showError("မအောင်မြင်ပါ", "ဖျက်သိမ်းခြင်း မအောင်မြင်ပါ။");
            }
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await updateAnnouncement({ id, data: { status: "Published" } }).unwrap();
            showSuccess("အောင်မြင်ပါသည်", "ထုတ်ပြန်ချက်ကို အတည်ပြုပြီးပါပြီ");
            refetch();
        } catch (err) {
            console.error("Failed to approve:", err);
            showError("မအောင်မြင်ပါ", "အတည်ပြုခြင်း မအောင်မြင်ပါ။");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-primary pl-3 padauk-bold">
                        ထုတ်ပြန်ချက်များ စီမံရန် (Announcements)
                    </h1>
                    <p className="text-slate-500 mt-1 padauk-regular">
                        တရားဝင် ထုတ်ပြန်ချက် စာရွက်စာတမ်းများကို စီမံခန့်ခွဲပါ။
                    </p>
                </div>
                <Link
                    to="/admin/announcements/new"
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm padauk-bold shrink-0"
                >
                    <Plus size={20} />
                    ထုတ်ပြန်ချက်အသစ်တင်မည်
                </Link>
            </div>

            {isLoading ? (
                <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold padauk-bold text-[15px]">
                                <tr>
                                    <th className="px-6 py-4">ခေါင်းစဉ်</th>
                                    <th className="px-6 py-4">ထုတ်ပြန်သည့်ရက်စွဲ</th>
                                    <th className="px-6 py-4">အမှတ်စဉ် (Ref No.)</th>
                                    <th className="px-6 py-4">အခြေအနေ</th>
                                    <th className="px-6 py-4 text-right">လုပ်ဆောင်ချက်များ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[1, 2, 3, 4].map((i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-3/4 mb-2" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-16 rounded-full" /></td>
                                        <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><Skeleton className="h-8 w-8 rounded-lg" /></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : isError ? (
                <div className="text-red-500 font-semibold text-center p-12 bg-red-50 rounded-2xl padauk-bold flex flex-col items-center gap-4">
                    <AlertCircle size={32} />
                    <span>ဒေတာရယူနေစဉ် ချို့ယွင်းချက်ဖြစ်ပေါ်နေပါသည်။</span>
                </div>
            ) : (
                <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold padauk-bold text-[15px]">
                                <tr>
                                    <th className="px-6 py-4">ခေါင်းစဉ်</th>
                                    <th className="px-6 py-4">ထုတ်ပြန်သည့်ရက်စွဲ</th>
                                    <th className="px-6 py-4">အမှတ်စဉ် (Ref No.)</th>
                                    <th className="px-6 py-4">အခြေအနေ</th>
                                    <th className="px-6 py-4 text-right">လုပ်ဆောင်ချက်များ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 padauk-regular">
                                {announcements?.map((item: Announcement) => (
                                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                                                    {item.documentImages && item.documentImages.length > 0 ? (
                                                        <img loading="lazy" src={item.documentImages[0]} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FileText size={18} className="text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="font-semibold text-slate-900 text-base max-w-[350px] truncate" title={item.title}>
                                                    {item.title}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-medium">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={12} className="text-slate-400" />
                                                    <span className="text-sm">{new Date(item.publishedDate).toLocaleDateString("en-GB")}</span>
                                                </div>
                                                <div className="flex items-center gap-2 ml-5">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                        {new Date(item.publishedDate).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">
                                            {item.referenceNumber || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase ${item.status === 'Published' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                item.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                    'bg-slate-50 text-slate-600 border border-slate-200'}`}>
                                                {item.status === 'Published' ? 'လွှင့်တင်ထားသည်' :
                                                    item.status === 'Pending' ? 'အတည်ပြုရန်စောင့်ဆိုင်းဆဲ' :
                                                        'မူကြမ်း'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Approve — Admin/Root only */}
                                                {role >= 2 && item.status === 'Pending' && (
                                                    <button
                                                        onClick={() => handleApprove(item._id)}
                                                        className="p-2 rounded-lg transition-all text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-100"
                                                        title="အတည်ပြုမည်"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                )}
                                                <Link to={`/announcements/${item._id}`} target="_blank" className="p-2 rounded-lg transition-colors text-slate-400 hover:text-emerald-600 hover:bg-emerald-50" title="ကြည့်ရှုရန်">
                                                    <Eye size={18} />
                                                </Link>
                                                {canDelete && (
                                                    <button onClick={() => { setAnnouncementToDelete(item._id); setDeleteModalOpen(true); }} disabled={isDeleting} className="p-2 rounded-lg transition-colors text-slate-400 hover:text-red-600 hover:bg-red-50" title="ဖျက်ပစ်မည်">
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {(!announcements || announcements.length === 0) && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center text-slate-400 padauk-bold">
                                            <div className="flex flex-col items-center gap-3">
                                                <AlertCircle size={40} className="text-slate-200" />
                                                <span>ထုတ်ပြန်ချက်များ မရှိသေးပါ။</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModalOpen && canDelete && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 padauk-regular">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200 border border-slate-200">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 padauk-bold">ဖျက်ပစ်ရန် သေချာပါသလား?</h3>
                        <p className="text-slate-500 text-sm mb-6">ဤလုပ်ဆောင်ချက်ကို ပြန်လည်မပြင်ဆင်နိုင်ပါ။</p>
                        <div className="flex items-center justify-end gap-3 mt-4">
                            <button onClick={() => { setDeleteModalOpen(false); setAnnouncementToDelete(null); }} disabled={isDeleting} className="px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                                မလုပ်ဆောင်ပါ
                            </button>
                            <button onClick={confirmDelete} disabled={isDeleting} className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-200 flex items-center gap-2">
                                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                ဆက်လက်ဖျက်သိမ်းမည်
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
