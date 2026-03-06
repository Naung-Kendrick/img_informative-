import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetAllContactsQuery, useDeleteContactMutation, useMarkContactAsReadMutation, type ContactMessage } from "../../store/contactApiSlice";
import { Loader2, Trash2, Mail, MailOpen, Eye, Calendar } from "lucide-react";
import type { RootState } from "../../store";

export default function ContactManagement() {
    const { user } = useSelector((state: RootState) => state.auth);
    const userRole = user?.role ?? 0;

    const { data: contacts, isLoading, isError, refetch } = useGetAllContactsQuery();
    const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();
    const [markAsRead] = useMarkContactAsReadMutation();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [contactToDelete, setContactToDelete] = useState<string | null>(null);
    const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);

    const confirmDelete = async () => {
        if (contactToDelete) {
            try {
                await deleteContact(contactToDelete).unwrap();
                setDeleteModalOpen(false);
                setContactToDelete(null);
                refetch();
            } catch (err) {
                console.error("Failed to delete:", err);
                alert("ဖျက်သိမ်းခြင်း မအောင်မြင်ပါ။");
            }
        }
    };

    const handleView = async (contact: ContactMessage) => {
        setViewingMessage(contact);
        // Mark as read if not already
        if (!contact.isRead) {
            try {
                await markAsRead(contact._id).unwrap();
                refetch();
            } catch (err) {
                console.error("Failed to mark as read:", err);
            }
        }
    };

    const unreadCount = contacts?.filter(c => !c.isRead).length || 0;

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-[#808080] pl-3 padauk-bold">
                        ဆက်သွယ်မှုများ စီမံရန်
                    </h1>
                    <p className="text-slate-500 mt-1 padauk-regular">
                        ပြည်သူများထံမှ ဆက်သွယ်ပေးပို့ထားသော မက်ဆေ့ချ်များ။
                    </p>
                </div>
                {unreadCount > 0 && (
                    <div className="flex items-center gap-2 bg-slate-50 text-slate-700 px-4 py-2 rounded-xl border border-slate-200 padauk-regular text-sm font-semibold">
                        <Mail size={16} />
                        မဖတ်ရသေးသော မက်ဆေ့ချ် {unreadCount} ခု
                    </div>
                )}
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center min-h-[40vh]">
                    <Loader2 className="h-10 w-10 text-[#808080] animate-spin" />
                </div>
            ) : isError ? (
                <div className="text-red-500 font-semibold text-center p-8 bg-red-50 rounded-xl padauk-bold">
                    ဒေတာရယူနေစဉ် ချို့ယွင်းချက်ဖြစ်ပေါ်နေပါသည်။
                </div>
            ) : (
                <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold padauk-bold text-[15px]">
                                <tr>
                                    <th className="px-6 py-4 w-8"></th>
                                    <th className="px-6 py-4">အမည်</th>
                                    <th className="px-6 py-4">ခေါင်းစဉ်</th>
                                    <th className="px-6 py-4">အီးမေး</th>
                                    <th className="px-6 py-4">အချိန်</th>
                                    <th className="px-6 py-4 text-right">လုပ်ဆောင်ချက်များ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 padauk-regular">
                                {contacts?.map((item: ContactMessage) => (
                                    <tr key={item._id} className={`transition-colors ${!item.isRead ? 'bg-slate-50/50 font-semibold' : 'hover:bg-slate-50/50'}`}>
                                        <td className="px-4 py-4 text-center">
                                            {item.isRead ? (
                                                <MailOpen size={16} className="text-slate-400" />
                                            ) : (
                                                <Mail size={16} className="text-slate-500" />
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-900 text-base">{item.name}</div>
                                            {item.phone && <div className="text-slate-400 text-xs mt-0.5">{item.phone}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-700 max-w-[200px] truncate" title={item.subject}>{item.subject}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">{item.email}</td>
                                        <td className="px-6 py-4 text-slate-500 text-sm whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                {new Date(item.createdAt).toLocaleDateString("en-GB")}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleView(item)}
                                                    className="p-2 rounded-lg transition-colors text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                                    title="ဖတ်ရှုမည်"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {userRole === 3 && (
                                                    <button
                                                        onClick={() => { setContactToDelete(item._id); setDeleteModalOpen(true); }}
                                                        disabled={isDeleting}
                                                        className="p-2 rounded-lg transition-colors text-red-400 hover:text-red-600 hover:bg-red-50"
                                                        title="ဖျက်ပစ်မည်"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {(!contacts || contacts.length === 0) && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500 padauk-bold">
                                            ဆက်သွယ်မှု မက်ဆေ့ချ်များ မရှိသေးပါ။
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* View Message Modal */}
            {viewingMessage && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-bold text-slate-900 padauk-bold">{viewingMessage.subject}</h3>
                            <button onClick={() => setViewingMessage(null)} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex gap-2">
                                <span className="text-slate-500 font-semibold min-w-20">အမည်:</span>
                                <span className="text-slate-900">{viewingMessage.name}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-slate-500 font-semibold min-w-20">အီးမေး:</span>
                                <span className="text-slate-900">{viewingMessage.email}</span>
                            </div>
                            {viewingMessage.phone && (
                                <div className="flex gap-2">
                                    <span className="text-slate-500 font-semibold min-w-20">ဖုန်း:</span>
                                    <span className="text-slate-900">{viewingMessage.phone}</span>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <span className="text-slate-500 font-semibold min-w-20">အချိန်:</span>
                                <span className="text-slate-900">{new Date(viewingMessage.createdAt).toLocaleString("en-GB")}</span>
                            </div>
                            <div className="pt-3 border-t border-slate-100">
                                <span className="text-slate-500 font-semibold block mb-2">မက်ဆေ့ချ်:</span>
                                <p className="text-slate-800 bg-slate-50 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">
                                    {viewingMessage.message}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setViewingMessage(null)}
                                className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                ပိတ်မည်
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 padauk-regular">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-2 padauk-bold">ဖျက်ပစ်ရန် သေချာပါသလား?</h3>
                        <p className="text-slate-500 text-sm mb-6">ဤမက်ဆေ့ချ်ကို အပြီးတိုင် ဖျက်ပစ်ပါမည်။</p>
                        <div className="flex items-center justify-end gap-3 mt-4">
                            <button onClick={() => { setDeleteModalOpen(false); setContactToDelete(null); }} disabled={isDeleting} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                မလုပ်ဆောင်ပါ
                            </button>
                            <button onClick={confirmDelete} disabled={isDeleting} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                                {isDeleting && <Loader2 size={16} className="animate-spin" />}
                                ဆက်လက်ဖျက်သိမ်းမည်
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

