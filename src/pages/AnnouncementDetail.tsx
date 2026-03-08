import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetAnnouncementByIdQuery } from "../store/announcementApiSlice";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";

export default function AnnouncementDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { data: announcement, isLoading, isError } = useGetAnnouncementByIdQuery(id as string, { skip: !id });

    if (isLoading) {
        return (
            <div className="page-container bg-background animate-in fade-in duration-500">
                <div className="container-narrow section-padding">
                    <Skeleton className="h-10 w-32 mb-8" />
                    <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
                    <Skeleton className="h-4 w-48 mx-auto mb-12" />
                    <Skeleton className="w-full aspect-[1/1.414] rounded-lg shadow-xl" />
                </div>
            </div>
        );
    }

    if (isError || !announcement) {
        return (
            <div className="page-container bg-background flex flex-col items-center text-center animate-in fade-in duration-500 section-padding">
                <div className="bg-card p-12 rounded-xl shadow-sm border border-border max-w-lg">
                    <FileText size={48} className="mx-auto text-muted-foreground/30 mb-6" />
                    <h2 className="h4 mb-4">ချို့ယွင်းချက်</h2>
                    <p className="p-muted mb-8">
                        သင်ရှာဖွေနေသော ထုတ်ပြန်ချက်ကို မတွေ့ရှိပါ။ ၎င်းကို ဖျက်လိုက်ခြင်း သို့မဟုတ် url မှားယွင်းခြင်း ဖြစ်နိုင်ပါသည်။
                    </p>
                    <button
                        onClick={() => navigate("/announcements")}
                        className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg hover:bg-primary/90 transition-all shadow-md active:scale-95 padauk-bold"
                    >
                        ထုတ်ပြန်ချက်စာမျက်နှာသို့ ပြန်သွားမည်
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container bg-background animate-in fade-in duration-500 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-secondary to-transparent -z-10" />

            <div className="container-narrow section-padding">
                <button
                    onClick={() => navigate("/announcements")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-wider text-xs mb-8 md:mb-12 group bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border w-fit shrink-0 hover:border-primary/30"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    {t("nav.announcements") || "Announcements"}
                </button>

                <div className="text-center mb-10 md:mb-16">
                    <h1 className="h2 mb-6 max-w-3xl mx-auto">
                        {announcement.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-primary" />
                            {new Date(announcement.publishedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        {announcement.referenceNumber && (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full bg-border" />
                                <div className="text-foreground border border-border px-3 py-1 rounded-sm bg-card shadow-sm">
                                    Ref: <span className="text-foreground ml-1">{announcement.referenceNumber}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Document Display Area with Stack Effect */}
                <div className="flex flex-col items-center px-4 sm:px-0 relative perspective-1000 gap-16">
                    {announcement.documentImages?.map((image, idx) => (
                        <div key={idx} className="relative group max-w-full z-10 w-full flex justify-center">
                            {/* A4 Document Frame Container with Stack Effect */}
                            <div className="relative group mx-auto">
                                {/* Background pages effect (Stack) */}
                                <div className="absolute top-2 left-2 inset-0 bg-white border border-border/50 rounded-sm shadow-sm translate-x-2 translate-y-2 -z-10 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-500"></div>
                                <div className="absolute top-1 left-1 inset-0 bg-white border border-border/50 rounded-sm shadow-sm translate-x-1 translate-y-1 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>

                                <div className="bg-white p-2 md:p-6 rounded-sm shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] border border-border/50 mx-auto w-fit min-w-[300px] max-w-full transition-all duration-500 relative overflow-hidden ring-1 ring-slate-100">
                                    {/* Paper Texture Overlay */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>

                                    <img
                                        src={image}
                                        alt={`${announcement.title} - Page ${idx + 1}`}
                                        className="w-full h-auto max-h-[1100px] object-contain rounded-sm"
                                        draggable="false"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Ground shadow for 3D effect on the last item */}
                    {announcement.documentImages && announcement.documentImages.length > 0 && (
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-12 bg-foreground/10 blur-2xl rounded-[100%] scale-y-50 -z-10"></div>
                    )}
                </div>

            </div>
        </div>
    );
}
