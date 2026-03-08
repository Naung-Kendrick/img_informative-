import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateProfileMutation, useUpdatePasswordMutation, useUploadAvatarMutation } from "../../store/usersApiSlice";
import { updateUser } from "../../store/authSlice";
import type { RootState } from "../../store";
import { Loader2, User, Mail, Camera, Save, Key, ShieldCheck, MailCheck } from "lucide-react";

export default function Profile() {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mutations
    const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
    const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();
    const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation();

    // Form States
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Message States
    const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
    const [pwdMsg, setPwdMsg] = useState({ type: "", text: "" });

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileMsg({ type: "", text: "" });
        try {
            const result = await updateProfile({ name, email }).unwrap();
            dispatch(updateUser(result.user)); // Update local storage/redux
            setProfileMsg({ type: "success", text: "ပရိုဖိုင် အချက်အလက်များကို သိမ်းဆည်းပြီးပါပြီ။" });
        } catch (err: any) {
            setProfileMsg({ type: "error", text: err.data?.message || "ပြင်ဆင်ခြင်း မအောင်မြင်ပါ။" });
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwdMsg({ type: "", text: "" });

        if (newPassword !== confirmPassword) {
            setPwdMsg({ type: "error", text: "စကားဝှက်အသစ်များ တူညီမှုမရှိပါ။" });
            return;
        }

        try {
            await updatePassword({ oldPassword, newPassword }).unwrap();
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPwdMsg({ type: "success", text: "စကားဝှက်ကို အောင်မြင်စွာ ပြောင်းလဲပြီးပါပြီ။" });
        } catch (err: any) {
            setPwdMsg({ type: "error", text: err.data?.message || "စကားဝှက်ပြောင်းလဲခြင်း မအောင်မြင်ပါ။" });
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadAvatar(formData).unwrap();
            dispatch(updateUser(result.user)); // result structure based on backend
            setProfileMsg({ type: "success", text: "ပရိုဖိုင်ပုံကို အောင်မြင်စွာ တင်ပြီးပါပြီ။" });
        } catch (err: any) {
            setProfileMsg({ type: "error", text: "ပုံတင်ခြင်း မအောင်မြင်ပါ။" });
        }
    };

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-[#808080] pl-3 mb-8 padauk-bold">
                ကိုယ်ရေးအချက်အလက် စီမံရန်
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Overview Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col items-center">
                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#808080]/20 group-hover:border-[#808080] transition-colors relative">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                        <User size={64} />
                                    </div>
                                )}
                                {isUploadingAvatar && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <Loader2 className="text-white animate-spin" size={24} />
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 p-2 bg-[#808080] text-white rounded-full shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                                <Camera size={16} />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        <div className="mt-6 text-center">
                            <h2 className="text-xl font-bold text-slate-900 padauk-bold">{user.name}</h2>
                            <p className="text-slate-500 text-sm mt-1">{user.email}</p>
                            <span className="inline-flex mt-4 items-center gap-1.5 px-3 py-1 bg-slate-50 text-[#808080] rounded-full text-xs font-bold uppercase tracking-wider border border-slate-100">
                                <ShieldCheck size={14} />
                                {user.role === 3 ? "Root Admin" : user.role === 2 ? "Admin" : user.role === 1 ? "Staff" : "User"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Edit Forms */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info Form */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                                <User size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 padauk-bold">ပရိုဖိုင် အချက်အလက်များ</h3>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 padauk-bold">အမည်</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 padauk-bold">အီးမေးလ်</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {profileMsg.text && (
                                <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${profileMsg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                                    {profileMsg.type === "success" ? <MailCheck size={18} /> : <ShieldCheck size={18} />}
                                    {profileMsg.text}
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isUpdatingProfile}
                                    className="flex items-center justify-center gap-2 bg-[#808080] hover:bg-[#555555] text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 shadow-md shadow-slate-200"
                                >
                                    {isUpdatingProfile ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    အချက်အလက် ပြင်ဆင်မည်
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Change Password Form */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                                <Key size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 padauk-bold">စကားဝှက် ပြောင်းလဲရန်</h3>
                        </div>

                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 padauk-bold">စကားဝှက်အဟောင်း</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all outline-none"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 padauk-bold">စကားဝှက်အသစ်</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all outline-none"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 padauk-bold">စကားဝှက်အသစ်ကို ထပ်မံရိုက်ထည့်ပါ</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {pwdMsg.text && (
                                <div className={`p-4 rounded-xl text-sm font-semibold ${pwdMsg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                                    {pwdMsg.text}
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isUpdatingPassword}
                                    className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 shadow-md shadow-slate-200"
                                >
                                    {isUpdatingPassword ? <Loader2 size={18} className="animate-spin" /> : <Key size={18} />}
                                    စကားဝှက် ပြောင်းမည်
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

