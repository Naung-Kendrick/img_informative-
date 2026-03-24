import React, { useState, useEffect } from "react";
import {
    Cloud,
    Sun,
    CloudRain,
    Wind,
    Droplets,
    Thermometer,
    CloudSun,
    CloudLightning,
    CloudDrizzle,
    MapPin,
    RefreshCw,
    Clock
} from "lucide-react";

interface WeatherData {
    temperature: number;
    weathercode: number;
    windspeed: number;
    humidity: number;
    is_day: number;
}

interface WeatherWidgetProps {
    variant?: "default" | "compact";
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ variant = "default" }) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeString = currentTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    const dayString = currentTime.toLocaleDateString('en-US', {
        weekday: 'long'
    });
    
    const dateString = currentTime.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const lat = 23.00;
    const lon = 97.16;

    const fetchWeather = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`
            );
            const data = await response.json();

            if (data.current_weather) {
                // Get humidity from hourly data (closest to current time)
                const currentHour = new Date().getHours();
                const humidity = data.hourly.relativehumidity_2m[currentHour] || 0;

                setWeather({
                    temperature: data.current_weather.temperature,
                    weathercode: data.current_weather.weathercode,
                    windspeed: data.current_weather.windspeed,
                    is_day: data.current_weather.is_day,
                    humidity: humidity
                });
            } else {
                setError(true);
            }
        } catch (err) {
            console.error("Failed to fetch weather:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
        // Update every 30 minutes
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const getWeatherIcon = (code: number, isDay: boolean, size = 32) => {
        if (code === 0) return isDay ? <Sun className="text-amber-400" size={size} /> : <Cloud size={size} className="text-slate-400" />;
        if (code >= 1 && code <= 3) return <CloudSun className="text-amber-300" size={size} />;
        if (code >= 45 && code <= 48) return <Cloud className="text-slate-300" size={size} />;
        if (code >= 51 && code <= 67) return <CloudDrizzle className="text-blue-300" size={size} />;
        if (code >= 71 && code <= 77) return <div className="text-white" style={{ fontSize: size }}>❄️</div>;
        if (code >= 80 && code <= 82) return <CloudRain className="text-blue-400" size={size} />;
        if (code >= 95) return <CloudLightning className="text-indigo-400" size={size} />;
        return <Cloud size={size} />;
    };

    const getWeatherDesc = (code: number) => {
        if (code === 0) return "Clear Sky";
        if (code >= 1 && code <= 3) return "Partly Cloudy";
        if (code >= 45 && code <= 48) return "Foggy";
        if (code >= 51 && code <= 67) return "Drizzle";
        if (code >= 71 && code <= 77) return "Snow";
        if (code >= 80 && code <= 82) return "Rain Showers";
        if (code >= 95) return "Thunderstorm";
        return "Cloudy";
    };

    if (loading && !weather) {
        return (
            <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 animate-pulse flex items-center justify-center ${variant === "compact" ? "w-[120px] h-[40px]" : "w-full h-[150px]"}`}>
                <div className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Weather</div>
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-2 ${variant === "compact" ? "inline-flex items-center" : "w-full text-center"}`}>
                <button onClick={fetchWeather} className="text-white/40 hover:text-white transition-colors flex items-center gap-2 mx-auto text-[10px] font-bold">
                    <RefreshCw size={10} /> RETRY
                </button>
            </div>
        );
    }

    if (variant === "compact") {
        return (
            <div className="flex items-center gap-4 bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-[1.25rem] px-5 py-2.5 transition-all duration-300 group shadow-lg">
                {/* Weather Section */}
                <div className="flex items-center gap-3 pr-4 border-r border-white/20">
                    <div className="group-hover:scale-110 transition-transform duration-500">
                        {getWeatherIcon(weather.weathercode, weather.is_day === 1, 20)}
                    </div>
                    <div className="flex flex-col leading-none gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[15px] font-bold text-white">{weather.temperature}°C</span>
                            <span className="text-[10px] text-white/80 capitalize">{getWeatherDesc(weather.weathercode)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin size={9} className="text-[#D4AF37]" />
                            <span className="text-[9px] text-[#D4AF37] font-semibold uppercase tracking-widest">Namhsan</span>
                        </div>
                    </div>
                </div>

                {/* Time Section */}
                <div className="flex items-center">
                    <div className="flex flex-col leading-none gap-1">
                        <div className="flex items-center gap-1.5">
                            <Clock size={11} className="text-white/80" />
                            <span className="text-[13px] font-bold text-white tracking-wide">
                                {timeString}
                            </span>
                        </div>
                        <span className="text-[9px] font-medium text-white/70 uppercase tracking-widest pl-[17px]">
                            {dayString}, {dateString}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl transition-all duration-500 hover:shadow-primary/20 hover:border-primary/30 group">
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                        {getWeatherIcon(weather.weathercode, weather.is_day === 1, 32)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-1">
                            <MapPin size={10} />
                            NAMHSAN TOWNSHIP
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-0 leading-none">
                            {weather.temperature}°C
                        </h3>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">
                            {getWeatherDesc(weather.weathercode)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
                            <Droplets size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Humidity</span>
                            <span className="text-sm font-bold text-white">{weather.humidity}%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400">
                            <Wind size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Wind</span>
                            <span className="text-sm font-bold text-white">{weather.windspeed} <span className="text-[10px] opacity-70 italic font-medium tracking-normal">km/h</span></span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
                            <Thermometer size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Feels Like</span>
                            <span className="text-sm font-bold text-white">{Math.round(weather.temperature - 2)}°C</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
                            <RefreshCw size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Updated</span>
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-tight">Today</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/30 transition-all duration-1000"></div>
        </div>
    );
};

export default WeatherWidget;
