import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateProfileMutation, useUpdatePasswordMutation, useUploadAvatarMutation } from "../../store/usersApiSlice";
import { updateUser } from "../../store/authSlice";
import type { RootState } from "../../store";
import { User, Mail, Camera, Save, Key, ShieldCheck } from "lucide-react";
import { useModal } from "../../context/ModalContext";

// Micro-Interaction Components
import { MotionPage } from "../../components/feedback/MotionPage";
import { InteractiveCard } from "../../components/feedback/InteractiveCard";
import { LoadingButton as InteractiveButton } from "../../components/feedback/loading-button";

export default function Profile() {
    const { user } = useSelector((state: RootState) => state.auth);
    const { showSuccess, showError } = useModal();
    const dispatch = useDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mutations
    const [updateProfile] = useUpdateProfileMutation();
    const [updatePassword] = useUpdatePasswordMutation();
    const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation();

    // Form States
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Status Tracking for Feedback Component
    const [profileStatus, setProfileStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [passwordStatus, setPasswordStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileStatus("loading");
        try {
            const result = await updateProfile({ name, email }).unwrap();
            dispatch(updateUser(result.user));
            setProfileStatus("success");
            showSuccess("အောင်မြင်ပါသည်", "ပရိုဖိုင် အချက်အလက်များကို သိမ်းဆည်းပြီးပါပြီ။");
            setTimeout(() => setProfileStatus("idle"), 3000);
        } catch (err: any) {
            setProfileStatus("error");
            showError("မအောင်မြင်ပါ", err.data?.message || "ပြင်ဆင်ခြင်း မအောင်မြင်ပါ။");
            setTimeout(() => setProfileStatus("idle"), 3000);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            showError("မှားယွင်းမှု", "စကားဝှက်အသစ်များ တူညီမှုမရှိပါ။");
            return;
        }

        setPasswordStatus("loading");
        try {
            await updatePassword({ oldPassword, newPassword }).unwrap();
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordStatus("success");
            showSuccess("အောင်မြင်ပါသည်", "စကားဝှက်ကို အောင်မြင်စွာ ပြောင်းလဲပြီးပါပြီ။");
            setTimeout(() => setPasswordStatus("idle"), 3000);
        } catch (err: any) {
            setPasswordStatus("error");
            showError("မအောင်မြင်ပါ", err.data?.message || "စကားဝှက်ပြောင်းလဲခြင်း မအောင်မြင်ပါ။");
            setTimeout(() => setPasswordStatus("idle"), 3000);
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
            dispatch(updateUser(result.user));
            showSuccess("အောင်မြင်ပါသည်", "ပရိုဖိုင်ပုံကို အောင်မြင်စွာ တင်ပြီးပါပြီ။");
        } catch (err: any) {
            showError("မအောင်မြင်ပါ", "ပုံတင်ခြင်း မအောင်မြင်ပါ။");
        }
    };

    if (!user) return null;

    return (
        <MotionPage className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-primary pl-3 mb-8 padauk-bold">
                ကိုယ်ရေးအချက်အလက် စီမံရန်
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Overview Card */}
                <div className="lg:col-span-1 space-y-6">
                    <InteractiveCard className="flex flex-col items-center p-8 bg-white">
                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary transition-all duration-500 relative shadow-inner">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                        <User size={64} />
                                    </div>
                                )}
                                {isUploadingAvatar && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                                        <div className="h-8 w-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg border-2 border-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
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
                            <span className="inline-flex mt-4 items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold uppercase tracking-wider border border-primary/10">
                                <ShieldCheck size={14} />
                                {user.role === 3 ? "Root Admin" : user.role === 2 ? "Admin" : user.role === 1 ? "Staff" : "User"}
                            </span>
                        </div>
                    </InteractiveCard>
                </div>

                {/* Edit Forms */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info Form */}
                    <InteractiveCard className="bg-white p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <User size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 padauk-bold">ပရိုဖိုင် အချက်အလက်များ</h3>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 padauk-bold">အမည်</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                            required
                                            disabled={profileStatus === "loading"}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 padauk-bold">အီးမေးလ်</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                            required
                                            disabled={profileStatus === "loading"}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center gap-4">
                                <InteractiveButton
                                    type="submit"
                                    isLoading={profileStatus === "loading"}
                                    isSuccess={profileStatus === "success"}
                                    successText="သိမ်းဆည်းပြီးပါပြီ"
                                    className="gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg shadow-primary/20"
                                >
                                    <Save size={18} />
                                    အချက်အလက် ပြင်ဆင်မည်
                                </InteractiveButton>

                                {profileStatus === "error" && (
                                    <span className="text-sm font-bold text-rose-600 animate-in fade-in slide-in-from-left-2">
                                        ပြင်ဆင်ခြင်း မအောင်မြင်ပါ။
                                    </span>
                                )}
                            </div>
                        </form>
                    </InteractiveCard>

                    {/* Change Password Form */}
                    <InteractiveCard className="bg-white p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-900">
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
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                    required
                                    disabled={passwordStatus === "loading"}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 padauk-bold">စကားဝှက်အသစ်</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                        required
                                        minLength={6}
                                        disabled={passwordStatus === "loading"}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 padauk-bold">စကားဝှက်အသစ်ကို ထပ်မံရိုက်ထည့်ပါ</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                        required
                                        disabled={passwordStatus === "loading"}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex items-center gap-4">
                                <InteractiveButton
                                    type="submit"
                                    isLoading={passwordStatus === "loading"}
                                    isSuccess={passwordStatus === "success"}
                                    successText="ပြောင်းလဲပြီးပါပြီ"
                                    className="gap-2 bg-slate-900 hover:bg-black text-white rounded-xl font-bold shadow-lg shadow-slate-200"
                                >
                                    <Key size={18} />
                                    စကားဝှက် ပြောင်းမည်
                                </InteractiveButton>

                                {passwordStatus === "error" && (
                                    <span className="text-sm font-bold text-rose-600 animate-in fade-in slide-in-from-left-2">
                                        စကားဝှက်ပြောင်းလဲခြင်း မအောင်မြင်ပါ။
                                    </span>
                                )}
                            </div>
                        </form>
                    </InteractiveCard>
                </div>
            </div>
        </MotionPage>
    );
}

