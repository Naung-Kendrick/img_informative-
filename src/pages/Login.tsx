import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Lock, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../store/authApiSlice";
import { setCredentials } from "../store/authSlice";

export default function Login() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading, isError, error }] = useLoginMutation();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const loginData = await login({ email, password }).unwrap();

            dispatch(
                setCredentials({
                    user: loginData.user,
                    token: loginData.accessToken,
                })
            );

            if (loginData.user.role >= 1) {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err: any) {
            console.error("Login Error:", err);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-6 w-full animate-in fade-in zoom-in-95 duration-500">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-8 sm:p-10">
                    <div className="flex justify-center mb-6">
                        <div className="h-16 w-16 bg-slate-50 flex items-center justify-center rounded-2xl border border-slate-100">
                            <ShieldCheck className="h-8 w-8 text-[#808080]" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">{t("login.title")}</h2>
                    <p className="text-sm text-slate-500 text-center mb-8 font-medium">
                        {t("login.subtitle")}
                    </p>

                    {isError && (
                        <div className="bg-red-50 text-red-500 text-sm font-semibold p-3 text-center rounded-xl mb-4 border border-red-100">
                            {(error as any)?.data?.message || t("login.failed")}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 tracking-wide">
                                {t("login.email")} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#808080]">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-[#808080] transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all duration-200"
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-slate-700 tracking-wide">
                                    {t("login.password")} <span className="text-red-500">*</span>
                                </label>
                                <Link to="/forgot-password" className="text-xs font-semibold text-[#808080] hover:text-[#555555] transition-colors">
                                    {t("login.forgot")}
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#808080]">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#808080] transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#808080]/20 focus:border-[#808080] transition-all duration-200"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-[#808080] hover:bg-[#555555] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#808080]/30 transition-all duration-300 flex items-center justify-center gap-2 group mt-8 ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    {t("login.loggingIn")}
                                </>
                            ) : (
                                <>
                                    {t("login.button")}
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
                <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex items-center justify-center text-sm font-medium text-slate-500">
                    {t("login.noAccount")} <Link to="/contact" className="ml-2 text-[#808080] hover:text-[#555555] transition-colors font-bold">{t("login.contactUs")}</Link>
                </div>
            </div>
        </div>
    );
}

