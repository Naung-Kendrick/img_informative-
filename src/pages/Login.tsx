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
                <div className="bg-gradient-to-br from-[#021024] via-[#052659] to-[#1e3a8a] p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden min-h-[400px]">
                    {/* Decorative abstract wave pattern (mimicking the image's background) */}
                    <div className="absolute top-1/2 left-[-20%] right-[-20%] h-[200px] border-t border-white/10 rounded-[100%] shadow-[0_-20px_50px_rgba(255,255,255,0.05)] transform -rotate-[15deg]"></div>
                    <div className="absolute top-[45%] left-[-10%] right-[-30%] h-[300px] border-t border-white/5 rounded-[100%] transform -rotate-[5deg]"></div>

                    {/* Logo Area */}
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center relative">
                            {/* Recreating the circle and dot logo from the image */}


                        </div>
                        <div className="flex flex-col ">
                            <img src="public/logo1-removebg-preview.png" alt="logo" className="w-30 h-" />

                        </div>
                    </div>

                    <div className="relative z-10 mt-16 mb-12">
                        <h2 className="text-4xl md:text-[3.25rem] font-bold mb-4 leading-[1.1] tracking-tight text-white">
                            {isRegistering ? (
                                <>Join our<br />network!</>
                            ) : (
                                <>Hello,<br />welcome!</>
                            )}
                        </h2>
                        <p className="text-white/70 text-sm max-w-[250px] leading-relaxed mt-6">
                            Official secure portal for Ta'ang Land Federal Unit Government Immigration Department.
                        </p>
                    </div>

                    <div className="relative z-10 mt-auto">
                        <Link to="/" className="inline-flex bg-white/10 hover:bg-white/20 border border-white/20 transition-colors rounded-full px-6 py-2.5 text-xs font-semibold backdrop-blur-md text-white">
                            View more
                        </Link>
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

