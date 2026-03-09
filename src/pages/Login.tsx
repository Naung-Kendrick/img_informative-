import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { useLoginMutation, useGoogleLoginMutation, useRegisterMutation } from "../store/authApiSlice";
import { setCredentials } from "../store/authSlice";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading, isError, error }] = useLoginMutation();
    const [register, { isLoading: isRegisterLoading, isError: isRegisterError, error: registerError }] = useRegisterMutation();
    const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let authData;
            if (isRegistering) {
                authData = await register({ name, email, password, phone }).unwrap();
            } else {
                authData = await login({ email, password }).unwrap();
            }

            dispatch(
                setCredentials({
                    user: authData.user,
                    token: authData.accessToken,
                })
            );

            if (authData.user.role >= 1) {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err: any) {
            console.error("Authentication Error:", err);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            // Send the credential back using the mutation
            const loginData = await googleLogin({ token: credentialResponse.credential }).unwrap();

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
            console.error("Google Login Error:", err);
        }
    };

    return (
        <div className="page-container bg-background flex min-h-[90vh] items-center justify-center p-4 md:p-6 w-full animate-in fade-in duration-700">
            <div className="w-full max-w-[900px] bg-card rounded-2xl md:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-border mt-8 mb-8">

                {/* Left Side - Graphic & Welcome */}
                <div className="bg-gradient-to-br from-[#021024] via-[#052659] to-[#1e3a8a] p-10 md:p-14 text-white flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[500px] border-r border-white/5">
                    {/* Professional Geometric Background Elements */}
                    <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] opacity-40"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[120px] opacity-30"></div>

                    {/* Stylish Wave Overlays */}
                    <div className="absolute top-1/2 left-[-20%] right-[-20%] h-[200px] border-t border-white/10 rounded-[100%] shadow-[0_-20px_50px_rgba(255,255,255,0.05)] transform -rotate-[15deg]"></div>
                    <div className="absolute top-[45%] left-[-10%] right-[-30%] h-[300px] border-t border-white/5 rounded-[100%] transform -rotate-[5deg]"></div>

                    {/* Logo Area - Professional & Stylish */}
                    <div className="relative z-10 animate-in zoom-in-95 duration-1000">
                        <div className="h-36 w-36 md:h-44 md:w-44 bg-white rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white/20 p-6 group transition-all duration-500 hover:scale-105">
                            <img
                                src="/photo_2026-03-09_14-35-44-removebg-preview.png"
                                alt="Department Seal"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Clear, Minimalist Text */}
                    <div className="relative z-10 mt-12 animate-in slide-in-from-bottom-8 duration-1000 delay-200 text-center">
                        <h2 className="text-5xl md:text-6xl font-bold tracking-[-0.03em] text-white/95 leading-tight mb-4 drop-shadow-xl" style={{ fontFamily: "'Times New Roman', serif" }}>
                            Welcome Back
                        </h2>
                        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto overflow-hidden">
                            <div className="w-full h-full bg-white/40 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="p-10 md:p-14 flex flex-col justify-center bg-card relative">

                    {(isError || isRegisterError) && (
                        <div className="bg-destructive/10 text-destructive text-sm p-4 text-center rounded-lg mb-6 border border-destructive/20 animate-in shake">
                            {((error || registerError) as any)?.data?.message || (isRegistering ? "Registration failed. Please try again." : t("login.failed"))}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-6">
                        {isRegistering && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-secondary/50 border border-border text-foreground rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium placeholder:text-muted-foreground/50 shadow-sm"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                                        Phone Number <span className="text-muted-foreground/50 font-normal lowercase">(optional)</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-secondary/50 border border-border text-foreground rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium placeholder:text-muted-foreground/50 shadow-sm"
                                        placeholder="+95 9..."
                                    />
                                </div>
                            </>
                        )}
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                                Email address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-secondary/50 border border-border text-foreground rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium placeholder:text-muted-foreground/50 shadow-sm"
                                placeholder="name@mail.com"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-secondary/50 border border-border text-foreground rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium placeholder:text-muted-foreground/50 shadow-sm"
                                placeholder="••••••••••••"
                            />
                        </div>

                        {/* Remember me & Forgot Password */}
                        <div className="flex items-center justify-between px-1 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 bg-secondary" />
                                <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
                            </label>
                            <Link to="/contact" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading || isRegisterLoading || isGoogleLoading}
                                className="w-full bg-background border border-border hover:bg-muted text-foreground font-bold py-4 rounded-xl shadow-sm transition-all text-sm disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                            >
                                {(isLoading || isRegisterLoading) ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    isRegistering ? "Create Account" : "Login"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center space-y-5">
                        <div className="flex items-center justify-center gap-2 text-sm font-medium">
                            <span className="text-muted-foreground">
                                {isRegistering ? "Already have an account?" : "Not a member yet?"}
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsRegistering(!isRegistering)}
                                className="text-primary hover:underline font-bold"
                            >
                                {isRegistering ? "Sign in instead" : "Create an account"}
                            </button>
                        </div>

                        <div className="relative mt-8 mb-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-[10px] sm:text-xs tracking-widest uppercase">
                                <span className="bg-card px-3 text-muted-foreground font-bold">Or continue with</span>
                            </div>
                        </div>

                        {/* Sign up / Google Login Block */}
                        <div className="w-full flex justify-center [&>div]:w-full [&>div>div]:w-full [&>div>div>iframe]:w-full hover:scale-[1.02] transition-transform duration-300 relative z-10">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => console.log('Login Failed')}
                                useOneTap
                                theme="filled_blue"
                                shape="rectangular"
                                text="signup_with"
                                size="large"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

