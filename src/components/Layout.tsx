import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import HotNewsTicker from "./HotNewsTicker"

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <Navbar />
            <HotNewsTicker />
            <main className="flex-1 animate-in fade-in duration-500">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
