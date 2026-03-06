import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetPagesBySectionQuery, useDeletePageMutation, type Page } from "../../store/pageApiSlice";
import type { RootState } from "../../store";
import { Loader2, Plus, Edit, Trash2, Calendar, Eye, AlertCircle } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";

interface PageManagementProps {
    section: 'services' | 'districts';
    title: string;
    subtitle: string;
    emptyText: string;
}

/**
 * Reusable CMS Page Management component for Services and Districts.
 * Permissions: Staff=create | Admin=create,edit | Root Admin=create,edit,delete
 */
export default function PageManagement({ section, title, subtitle, emptyText }: PageManagementProps) {
    const { user } = useSelector((state: RootState) => state.auth);
    const role = user?.role ?? 0;

    const { data: pages, isLoading, isError, refetch } = useGetPagesBySectionQuery(section);
    const [deletePage, { isLoading: isDeleting }] = useDeletePageMutation();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [pageToDelete, setPageToDelete] = useState<string | null>(null);

    // Permission flags
    const canEdit = role >= 2;
    const canDelete = role >= 3;

    const confirmDelete = async () => {
        if (pageToDelete) {
            try {
                await deletePage({ id: pageToDelete, section }).unwrap();
                setDeleteModalOpen(false);
                setPageToDelete(null);
                refetch();
            } catch (err) {
                console.error("Failed to delete:", err);
                alert("ဖျက်သိမ်းခြင်း မအောင်မြင်ပါ။");
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-[#808080] pl-3 padauk-bold">
                        {title}
                    </h1>
                    <p className="text-slate-500 mt-1 padauk-regular">{subtitle}</p>
                </div>
                <Link
                    to={`/admin/pages/new?section=${section}`}
                    className="flex items-center gap-2 bg-[#808080] hover:bg-[#555555] text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm padauk-bold shrink-0"
                >
                    <Plus size={20} />
                    အသစ်ထည့်မည်
                </Link>
            </div>

            {isLoading ? (
                <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold padauk-bold text-[15px]">
                                <tr>
                                    <th className="px-6 py-4">ခေါင်းစဉ်</th>
                                    <th className="px-6 py-4">အခြေအနေ</th>
                                    <th className="px-6 py-4">အစီအစဉ်</th>
                                    <th className="px-6 py-4">အချိန်</th>
                                    <th className="px-6 py-4 text-right">လုပ်ဆောင်ချက်များ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[1, 2, 3].map((i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-4 w-1/4" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-8 w-24 rounded-full" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-10" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
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
                                    <th className="px-6 py-4">အခြေအနေ</th>
                                    <th className="px-6 py-4">အစီအစဉ်</th>
                                    <th className="px-6 py-4">အချိန်</th>
                                    <th className="px-6 py-4 text-right">လုပ်ဆောင်ချက်များ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 padauk-regular">
                                {pages?.map((item: Page) => (
                                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900 text-base max-w-[350px] truncate" title={item.title}>
                                                {item.title}
                                            </div>
                                            <div className="text-slate-500 text-xs mt-1">
                                                By {item.author?.name || "Admin"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase ${item.status === 'Published' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}>
                                                {item.status === 'Published' ? 'လွှင့်တင်ထားသည်' : 'မူကြမ်း'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-mono text-sm">
                                            #{item.order}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(item.createdAt || Date.now()).toLocaleDateString("en-GB")}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/${section}/${item._id}`} target="_blank" className="p-2 rounded-lg transition-colors text-slate-400 hover:text-emerald-600 hover:bg-emerald-50" title="ကြည့်ရှုရန်">
                                                    <Eye size={18} />
                                                </Link>
                                                {canEdit && (
                                                    <Link to={`/admin/pages/edit/${item._id}`} className="p-2 rounded-lg transition-colors text-slate-400 hover:text-blue-600 hover:bg-blue-50" title="ပြင်ဆင်ရန်">
                                                        <Edit size={18} />
                                                    </Link>
                                                )}
                                                {canDelete && (
                                                    <button onClick={() => { setPageToDelete(item._id); setDeleteModalOpen(true); }} disabled={isDeleting} className="p-2 rounded-lg transition-colors text-slate-400 hover:text-red-600 hover:bg-red-50" title="ဖျက်ပစ်မည်">
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {(!pages || pages.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-slate-400 padauk-bold">
                                            <div className="flex flex-col items-center gap-3">
                                                <AlertCircle size={40} className="text-slate-200" />
                                                <span>{emptyText}</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Modal — Root Admin only */}
            {deleteModalOpen && canDelete && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 padauk-regular">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200 border border-slate-200">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 padauk-bold">ဖျက်ပစ်ရန် သေချာပါသလား?</h3>
                        <p className="text-slate-500 text-sm mb-6">ဤလုပ်ဆောင်ချက်ကို ပြန်လည်မပြင်ဆင်နိုင်ပါ။</p>
                        <div className="flex items-center justify-end gap-3 mt-4">
                            <button onClick={() => { setDeleteModalOpen(false); setPageToDelete(null); }} disabled={isDeleting} className="px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
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

