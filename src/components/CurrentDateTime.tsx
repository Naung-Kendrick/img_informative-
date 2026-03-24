import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function CurrentDateTime() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Format: 2:33 PM
    const timeString = currentTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    // Format: Monday
    const dayString = currentTime.toLocaleDateString('en-US', {
        weekday: 'long'
    });
    
    // Format: 23 March 2026
    const dateString = currentTime.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="flex items-center gap-3 bg-slate-900/95 backdrop-blur-2xl border-2 border-primary/60 hover:border-primary rounded-full px-6 py-2.5 transition-all duration-300 group cursor-default shadow-[0_12px_48px_rgba(0,0,0,0.6)]">
            <Clock size={14} className="text-[#D4AF37]" />
            <div className="flex items-center gap-1.5 leading-none mt-0.5">
                <span className="text-[14px] font-black text-white tracking-wide drop-shadow-md">
                    {timeString}
                </span>
                <span className="text-[13px] font-bold text-white/80">
                    , {dayString},
                </span>
                <span className="text-[12px] font-black text-[#D4AF37] tracking-wider uppercase drop-shadow-md">
                    {dateString}
                </span>
            </div>
        </div>
    );
}
