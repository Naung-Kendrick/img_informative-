import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../../store";
import { ShieldAlert } from "lucide-react";

interface RoleGuardProps {
    minRole: number;
    children: React.ReactNode;
}

/**
 * Wraps admin pages that require a minimum role level.
 * If the user's role is below minRole, shows an "Access Denied" message.
 */
export default function RoleGuard({ minRole, children }: RoleGuardProps) {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role < minRole) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 border-2 border-red-100 shadow-sm">
                    <ShieldAlert size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 padauk-bold mb-3">
                    ခွင့်ပြုချက် မရှိပါ
                </h2>
                <p className="text-slate-500 padauk-regular max-w-md mb-6 leading-relaxed">
                    ဤစာမျက်နှာကို ကြည့်ရှုရန် သင့်ရာထူးအဆင့်မှ ခွင့်ပြုချက်မရှိပါ။
                    စီမံခန့်ခွဲသူထံ ဆက်သွယ်ပါ။
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>လိုအပ်သော ရာထူး -</span>
                    <span className="font-bold text-slate-600">
                        {minRole === 3 ? "Root Admin" : minRole === 2 ? "Admin" : "Staff"}
                    </span>
                    <span>/ သင့်ရာထူး -</span>
                    <span className="font-bold text-red-500">
                        {user.role === 3 ? "Root Admin" : user.role === 2 ? "Admin" : user.role === 1 ? "Staff" : "User"}
                    </span>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
