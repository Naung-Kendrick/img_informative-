import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetUsersQuery, useUpdateUserRoleMutation, useUpdateUserStatusMutation, useDeleteUserMutation } from "../../store/usersApiSlice";
import type { RootState } from "../../store";
import { Loader2, Trash2, UserCog, User as UserIcon, ShieldCheck, ShieldAlert, AlertCircle } from "lucide-react";
import type { User } from "../../store/authSlice";
import { Skeleton } from "../../components/ui/skeleton";
import { useModal } from "../../context/ModalContext";

const ROLES = [
    { value: 0, label: "အသုံးပြုသူ", eng: "Regular User" },
    { value: 1, label: "ဝန်ထမ်း", eng: "Staff" },
    { value: 2, label: "စီမံခန့်ခွဲသူ", eng: "Admin" },
    { value: 3, label: "Root_Admin", eng: "Root Admin" },
];

export default function UserManagement() {
    const { user: currentUser } = useSelector((state: RootState) => state.auth);
    const { showSuccess, showError } = useModal();

    // RoleGuard in App.tsx handles access control; this is a safety fallback
    if (!currentUser) return null;

    // RTK Query Hooks
    const { data: users, isLoading, isError, refetch } = useGetUsersQuery();
    const [updateUserRole, { isLoading: isUpdating }] = useUpdateUserRoleMutation();
    const [updateUserStatus, { isLoading: isStatusUpdating }] = useUpdateUserStatusMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const handleRoleChange = async (userId: string, newRole: number) => {
        try {
            await updateUserRole({ userId, role: newRole }).unwrap();
            showSuccess("အောင်မြင်ပါသည်", "ရာထူး ပြောင်းလဲပြီးပါပြီ");
            refetch();
        } catch (err) {
            console.error("Failed to update role:", err);
            showError("မအောင်မြင်ပါ", "ရာထူးပြင်ဆင်ခြင်း မအောင်မြင်ပါ။");
        }
    };

    const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
        if (currentUser.role !== 3) return;
        if (currentUser._id === userId) {
            showError("ကန့်သတ်ချက်", "မိမိအကောင့်၏ အခြေအနေကို ပြောင်းလဲ၍မရပါ။");
            return;
        }

        try {
            await updateUserStatus({ userId, active: !currentStatus }).unwrap();
            showSuccess("အောင်မြင်ပါသည်", "အသုံးပြုသူအခြေအနေ ပြောင်းလဲခဲ့ပြီးပါပြီ");
            refetch();
        } catch (err) {
            console.error("Failed to update status:", err);
            showError("မအောင်မြင်ပါ", "အခြေအနေပြောင်းလဲခြင်း မအောင်မြင်ပါ။");
        }
    };

    const confirmDelete = async () => {
        if (userToDelete) {
            try {
                await deleteUser(userToDelete).unwrap();
                setDeleteModalOpen(false);
                setUserToDelete(null);
                showSuccess("အောင်မြင်ပါသည်", "အကောင့်ကို အောင်မြင်စွာ ဖျက်သိမ်းပြီးပါပြီ");
                refetch();
            } catch (err) {
                console.error("Failed to delete user:", err);
                showError("မအောင်မြင်ပါ", "အကောင့်ဖျက်သိမ်းခြင်း မအောင်မြင်ပါ။");
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-primary pl-3 padauk-bold">
                        အသုံးပြုသူများ စီမံခန့်ခွဲခြင်း
                    </h1>
                    <p className="text-slate-500 mt-1 padauk-regular">
                        အဖွဲ့ဝင်များ၏ ရာထူးများကို သတ်မှတ်ခြင်းနှင့် အကောင့်များကို စီမံခန့်ခွဲပါ။
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden auto-cols-auto">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold padauk-bold">
                                <tr>
                                    <th className="px-6 py-4">အသုံးပြုသူ</th>
                                    <th className="px-6 py-4">အခြေအနေ</th>
                                    <th className="px-6 py-4">နောက်ဆုံးဝင်ရောက်မှု</th>
                                    <th className="px-6 py-4">ရာထူး</th>
                                    <th className="px-6 py-4 text-right">လုပ်ဆောင်ချက်များ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[1, 2, 3, 4].map((i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><div className="flex gap-3 items-center"><Skeleton className="h-10 w-10 rounded-full" /><div><Skeleton className="h-5 w-32 mb-1" /><Skeleton className="h-4 w-48" /></div></div></td>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-5 w-24 rounded-lg" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-10 w-32 rounded-lg" /></td>
                                        <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : isError ? (
                <div className="text-red-500 font-semibold text-center p-12 bg-red-50 rounded-2xl padauk-bold flex flex-col items-center gap-4">
                    <AlertCircle size={32} />
                    <span>အသုံးပြုသူစာရင်း ရယူနေစဉ် ချို့ယွင်းချက်ဖြစ်ပေါ်နေပါသည်။</span>
                </div>
            ) : (
                <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold padauk-bold text-[15px]">
                                <tr>
                                    <th className="px-6 py-4">အသုံးပြုသူ</th>
                                    <th className="px-6 py-4">အခြေအနေ</th>
                                    <th className="px-6 py-4">နောက်ဆုံးဝင်ရောက်မှု</th>
                                    <th className="px-6 py-4">ရာထူး</th>
                                    <th className="px-6 py-4 text-right">လုပ်ဆောင်ချက်များ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 padauk-regular">
                                {users?.map((user: User) => {
                                    const isSelf = currentUser._id === user._id;
                                    const isTargetHigherOrEqual = user.role >= currentUser.role;
                                    const canManageRole = currentUser.role === 3 || (!isSelf && !isTargetHigherOrEqual && currentUser.role === 2);
                                    const canDelete = currentUser.role === 3 && !isSelf;

                                    return (
                                        <tr key={user._id} className="hover:bg-slate-50/50 transition-all duration-200">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-11 w-11 rounded-full bg-slate-100 flex items-center justify-center text-[#808080] overflow-hidden shrink-0 border border-slate-200 shadow-sm transition-transform hover:scale-105">
                                                        {user.avatar ? (
                                                            <img loading="lazy" src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <UserIcon size={20} />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-900 text-[15px]">{user.name} {isSelf && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded ml-1 uppercase">ကိုယ်တိုင်</span>}</span>
                                                        <span className="text-xs text-slate-400">{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {currentUser.role === 3 && !isSelf ? (
                                                        <button
                                                            onClick={() => handleStatusToggle(user._id, user.active)}
                                                            disabled={isStatusUpdating}
                                                            className={`group relative flex items-center h-8 w-24 rounded-full transition-all duration-300 shadow-sm border ${user.active ? 'bg-green-500 border-green-600' : 'bg-slate-200 border-slate-300'}`}
                                                        >
                                                            <div className={`absolute left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${user.active ? 'translate-x-[64px]' : 'translate-x-0'}`}>
                                                                {user.active ? <ShieldCheck size={12} className="text-green-600" /> : <ShieldAlert size={12} className="text-slate-400" />}
                                                            </div>
                                                            <span className={`w-full text-[10px] font-black uppercase tracking-tighter transition-all px-2 ${user.active ? 'text-white text-left ml-2' : 'text-slate-500 text-right mr-2'}`}>
                                                                {user.active ? 'ACTIVE' : 'INACTIVE'}
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight shadow-sm border ${user.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                                            {user.active ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                                                            {user.active ? "ACTIVE" : "INACTIVE"}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    {user.lastLogin ? (
                                                        <>
                                                            <span className="text-slate-700 font-bold text-[13px]">
                                                                {new Date(user.lastLogin).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                                                            </span>
                                                            <span className="text-[11px] text-slate-400 font-medium">
                                                                {new Date(user.lastLogin).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-slate-300 text-xs">No records</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {canManageRole ? (
                                                    <div className="relative max-w-[170px] group">
                                                        <label className="sr-only">Change User Role</label>
                                                        <select
                                                            className="appearance-none bg-white border border-slate-200 text-slate-800 font-bold text-xs rounded-xl focus:ring-primary/20 focus:border-primary block w-full px-4 py-2.5 pr-10 transition-all cursor-pointer hover:border-primary/40 shadow-sm"
                                                            value={user.role}
                                                            onChange={(e) => handleRoleChange(user._id, Number(e.target.value))}
                                                            disabled={isUpdating}
                                                        >
                                                            {ROLES.map((roleOpt) => {
                                                                const disabledOption = currentUser.role === 2 && roleOpt.value >= 2;
                                                                return (
                                                                    <option key={roleOpt.value} value={roleOpt.value} disabled={disabledOption}>
                                                                        {roleOpt.label} ({roleOpt.eng})
                                                                    </option>
                                                                );
                                                            })}
                                                        </select>
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 group-hover:text-primary transition-colors">
                                                            <UserCog size={16} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${user.role >= 2 ? 'bg-blue-50 text-primary border-blue-100 shadow-sm' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                                        {user.role === 3 ? <ShieldCheck size={14} /> : user.role === 2 ? <UserCog size={14} /> : <UserIcon size={14} />}
                                                        {ROLES.find((r) => r.value === user.role)?.label || "အမည်မသိ"}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        setUserToDelete(user._id);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                    disabled={!canDelete || isDeleting}
                                                    className={`p-2.5 rounded-xl transition-all border ${canDelete ? 'text-red-400 border-transparent hover:border-red-100 hover:text-red-600 hover:bg-red-50' : 'text-slate-200 border-transparent cursor-not-allowed opacity-50'}`}
                                                    title={!canDelete ? "Root Admin သာလျှင် အသုံးပြုသူကို ဖျက်နိုင်သည်။" : "Delete User"}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {users?.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-slate-400 padauk-bold">
                                            <div className="flex flex-col items-center gap-3">
                                                <AlertCircle size={40} className="text-slate-200" />
                                                <span>အသုံးပြုသူစာရင်း မရှိသေးပါ။</span>
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
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 padauk-regular">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200 border border-slate-200">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-5 animate-bounce">
                            <ShieldAlert size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 padauk-bold">အကောင့်ဖျက်ပစ်ရန် သေချာပါသလား?</h3>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                            ဤလုပ်ဆောင်ချက်သည် သင်ရွေးချယ်ထားသော အသုံးပြုသူအကောင့်ကို အမြဲတမ်းဖျက်ဆီးပစ်မည်ဖြစ်ပြီး ပြန်လည်ရယူနိုင်တော့မည်မဟုတ်ပါ။
                        </p>
                        <div className="flex items-center justify-end gap-3 mt-4">
                            <button
                                onClick={() => {
                                    setDeleteModalOpen(false);
                                    setUserToDelete(null);
                                }}
                                disabled={isDeleting}
                                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all hover:border-slate-300"
                            >
                                မဖျက်တော့ပါ
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-200 flex items-center gap-2"
                            >
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

