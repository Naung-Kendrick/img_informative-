import { useGetAllDistrictsQuery } from "../store/districtApiSlice";
import type { District } from "../store/districtApiSlice";
import { MapPin, Phone, Building, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { useTranslation } from "react-i18next";

export default function Districts() {
    const { t } = useTranslation();
    const { data: districts, isLoading, isError } = useGetAllDistrictsQuery();

    const fallbackDistricts = [
        {
            _id: "1",
            name: "နမ့်ဆန်ခရိုင်",
            address: "ခရိုင်အထွေထွေအုပ်ချုပ်ရေးဦးစီးဌာနရုံး၊ နမ့်ဆန်မြို့",
            phone: "09-xxxxxxxxx",
            coverImage: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=800&auto=format&fit=crop",
            mapUrl: "#"
        },
        {
            _id: "2",
            name: "မန်တုံခရိုင်",
            address: "ခရိုင်အထွေထွေအုပ်ချုပ်ရေးဦးစီးဌာနရုံး၊ မန်တုံမြို့",
            phone: "09-xxxxxxxxx",
            coverImage: "https://images.unsplash.com/photo-1582298538104-efa9acff89ed?q=80&w=800&auto=format&fit=crop",
            mapUrl: "#"
        },
        {
            _id: "3",
            name: "နမ့်ခမ်းခရိုင်",
            address: "ခရိုင်အထွေထွေအုပ်ချုပ်ရေးဦးစီးဌာနရုံး၊ နမ့်ခမ်းမြို့",
            phone: "09-xxxxxxxxx",
            coverImage: "https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=800&auto=format&fit=crop",
            mapUrl: "#"
        }
    ];

    const displayDistricts = districts && districts.length > 0 ? districts : fallbackDistricts;

    return (
        <div className="page-container bg-background animate-in fade-in duration-500 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>

            <div className="container-custom section-padding">
                {/* Page Header */}
                <div className="mb-16 text-center max-w-2xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/20">
                        <Building size={14} />
                        {t("districts.badge")}
                    </div>
                    <h1 className="h1 mb-8 relative inline-block pb-4">
                        {t("districts.adminOffices")}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-primary/30 rounded-full"></div>
                    </h1>
                    <p className="p-lead mt-6">
                        {t("districts.adminOfficesDesc")}
                    </p>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-card rounded-2xl p-6 shadow-sm border border-border flex flex-col">
                                <Skeleton className="w-full aspect-video rounded-xl mb-6" />
                                <Skeleton className="h-8 w-2/3 mb-6" />
                                <Skeleton className="h-5 w-full mb-3" />
                                <Skeleton className="h-5 w-1/2 mb-8" />
                                <Skeleton className="h-12 w-full mt-auto" />
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl shadow-sm border border-destructive/20 max-w-3xl mx-auto text-center">
                        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4 mx-auto">
                            <Building size={32} />
                        </div>
                        <h2 className="h4 mb-2">{t("districts.networkError")}</h2>
                        <p className="p-muted">{t("districts.networkErrorDesc")}</p>
                    </div>
                ) : (
                    /* Display Grid */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {displayDistricts.map((district: District | any) => (
                            <div
                                key={district._id}
                                className="group bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col pt-0"
                            >
                                {/* Image */}
                                <div className="aspect-video w-full bg-secondary/20 overflow-hidden relative border-b border-border">
                                    <img
                                        src={district.coverImage}
                                        alt={district.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>

                                {/* Body */}
                                <div className="p-6 md:p-8 flex flex-col flex-grow relative">
                                    <h3 className="h4 mb-6 group-hover:text-primary transition-colors">
                                        {district.name}
                                    </h3>

                                    <div className="flex flex-col gap-4 mb-8">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                                <MapPin size={16} className="text-primary" />
                                            </div>
                                            <p className="p-default pt-1">
                                                {district.address}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                                <Phone size={16} className="text-primary" />
                                            </div>
                                            <p className="text-foreground font-bold tracking-wider text-[15px]">
                                                {district.phone}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="mt-auto w-full">
                                        {district.mapUrl && district.mapUrl !== "#" ? (
                                            <a href={district.mapUrl} target="_blank" rel="noreferrer" className="w-full block">
                                                <Button variant="outline" className="w-full font-bold text-primary border-primary/20 hover:bg-primary/10 hover:text-primary py-6 transition-all duration-300">
                                                    {t("districts.viewMap")}
                                                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </a>
                                        ) : (
                                            <Button variant="outline" className="w-full font-bold text-muted-foreground border-border cursor-default bg-muted/50 py-6 opacity-60">
                                                {t("districts.noMap")}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
