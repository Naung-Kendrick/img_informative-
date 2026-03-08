import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import HotNewsTicker from "./HotNewsTicker"
import ScrollButtons from "./ScrollButtons"

export default function Layout() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return (
        <div className="page-container bg-background font-sans">
            <Navbar />
            <HotNewsTicker />
            <main className="flex-1 animate-in fade-in duration-500">
                <Outlet />
            </main>
            <Footer />
            <ScrollButtons />
        </div>
    )
}
