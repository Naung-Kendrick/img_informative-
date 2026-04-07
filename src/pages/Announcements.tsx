import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetAllAnnouncementsQuery } from "../store/announcementApiSlice";
import { Calendar, Megaphone, FileText } from "lucide-react";
import NetworkErrorState from "../components/ui/NetworkErrorState";

const ITEMS_PER_PAGE = 8;

export default function Announcements() {
    const { t } = useTranslation();
    const { data: allAnnouncements, isLoading, isError } = useGetAllAnnouncementsQuery();
    const [currentPage, setCurrentPage] = useState(1);

    const announcements = [...(allAnnouncements || [])].sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

    const totalPages = Math.ceil(announcements.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = announcements.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="page-container bg-background animate-in fade-in duration-500">
            <div className="container-custom section-padding">
                {/* Page Header */}
                <div className="mb-10 text-center max-w-2xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4 border border-primary/20">
                        <Megaphone size={14} />
                        Official Announcement
                    </div>
                    <h1 className="h1 mb-6 relative inline-block pb-4">
                        {t("announcements.title")}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-primary/30 rounded-full"></div>
                    </h1>

                </div>

                {isError ? (
                    <NetworkErrorState />
                ) : announcements.length === 0 && !isLoading ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center mt-12">
                        <div className="bg-muted/50 text-muted-foreground p-8 rounded-xl max-w-lg border border-border">
                            <Megaphone size={40} className="mx-auto mb-4 text-muted-foreground/40" />
                            <h2 className="h4 mb-2">{t("announcements.noAnnouncements")}</h2>
                            <p className="p-muted text-muted-foreground">{t("announcements.noAnnouncementsDesc")}</p>
                        </div>
                    </div>
                ) : isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="aspect-[3/4] bg-card rounded-xl border border-border animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-12">
                        {paginatedItems.map((announcement) => (
                            <Link
                                key={announcement._id}
                                to={`/announcements/${announcement._id}`}
                                className="group flex flex-col bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {/* Thumbnail Container (A4 Proportions) */}
                                <div className="w-full aspect-[1/1.414] bg-secondary/20 relative overflow-hidden border-b border-border">
                                    {announcement.documentImages && announcement.documentImages.length > 0 ? (
                                        <img loading="lazy"
                                            src={announcement.documentImages[0]}
                                            alt={announcement.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FileText size={48} className="text-muted-foreground/30" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                {/* Content Details */}
                                <div className="p-4 flex flex-col flex-grow bg-card relative z-10">
                                    <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-2">
                                        <Calendar size={12} className="text-primary/70" />
                                        {new Date(announcement.publishedDate).toLocaleDateString('en-GB')}
                                    </div>
                                    <h3 className="text-sm font-bold text-card-foreground line-clamp-3 group-hover:text-primary transition-colors padauk-bold leading-relaxed flex-grow">
                                        {announcement.title}
                                    </h3>
                                    {announcement.referenceNumber && (
                                        <div className="mt-3 text-[10px] text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded border border-border w-fit truncate max-w-full">
                                            {announcement.referenceNumber}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-16 flex items-center justify-center gap-2">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => handlePageChange(idx + 1)}
                                className={`w-12 h-12 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${currentPage === idx + 1
                                    ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-110 z-10"
                                    : "bg-card border border-border text-muted-foreground hover:bg-muted/50"
                                    }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
