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
        <div className="flex min-h-[90vh] items-center justify-center p-6 w-full animate-in fade-in duration-700 bg-[#f8fafc]">
            <div className="w-full max-w-md bg-white rounded-sm shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-200">
                <div className="p-10 md:p-12">
                    <div className="flex justify-center mb-8">
                        <div className="h-20 w-20 bg-slate-950 flex items-center justify-center rounded-sm border border-slate-900 shadow-2xl relative overflow-hidden group">
                            <ShieldCheck className="h-10 w-10 text-primary relative z-10" />
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <div className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Secure Access Portal</div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-0 tracking-tight leading-none">{t("login.title")}</h2>
                    </div>

                    {isError && (
                        <div className="bg-red-50 text-red-600 text-[11px] font-bold uppercase tracking-widest p-4 text-center rounded-sm mb-6 border border-red-100 animate-in shake">
                            {(error as any)?.data?.message || t("login.failed")}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {t("login.email")} <span className="text-primary">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                                    <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-sm pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                    placeholder="official@talfu.gov"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    {t("login.password")} <span className="text-primary">*</span>
                                </label>
                                <Link to="/contact" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline transition-all">
                                    {t("login.forgot")}
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                                    <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-sm pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold py-5 rounded-sm shadow-xl shadow-slate-950/20 transition-all duration-300 flex items-center justify-center gap-3 group text-[11px] uppercase tracking-[0.2em] relative overflow-hidden disabled:opacity-70 disabled:pointer-events-none"
                            >
                                <div className="absolute inset-y-0 left-0 w-[2px] bg-primary group-hover:w-full transition-all duration-500 -z-0 opacity-10" />
                                <span className="relative z-10 flex items-center gap-3">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            Authorize Login
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform text-primary" />
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="bg-slate-50 px-10 py-6 border-t border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Department of Immigration Internal Access
                </div>
            </div>
        </div>
    );
}

