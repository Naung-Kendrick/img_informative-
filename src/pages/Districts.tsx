import { useGetPagesBySectionQuery } from "../store/pageApiSlice";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, ArrowRight } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";

/**
 * Public Districts page — shows published pages with section="districts"
 */
export default function Districts() {
    const { t } = useTranslation();
    const { data: pages, isLoading, isError } = useGetPagesBySectionQuery("districts");

    const published = pages?.filter((p) => p.status === "Published") || [];

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500 min-h-[70vh]">

            {/* Page Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 text-[#808080]">
                        <MapPin size={22} />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 border-l-4 border-[#808080] pl-3 padauk-bold">
                        {t("districts.title")}
                    </h1>
                </div>
                <p className="text-slate-500 padauk-regular ml-14 sm:ml-16">
                    {t("districts.subtitle")}
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <Skeleton className="w-full aspect-[16/10]" />
                            <div className="p-6"><Skeleton className="h-7 w-3/4 mb-3" /><Skeleton className="h-4 w-full" /></div>
                        </div>
                    ))}
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                    <div className="bg-red-50 text-red-500 p-6 rounded-2xl max-w-lg">
                        <h2 className="text-xl font-bold mb-2 padauk-bold">ကွန်ရက်ချို့ယွင်းချက်</h2>
                        <p className="padauk-regular text-sm">ဆာဗာနှင့် ချိတ်ဆက်ရာတွင် အဆင်မပြေမှု ဖြစ်ပေါ်နေပါသည်။</p>
                    </div>
                </div>
            ) : published.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                    <div className="bg-slate-50 text-slate-500 p-8 rounded-2xl max-w-lg border border-slate-200">
                        <MapPin size={40} className="mx-auto mb-4 text-slate-300" />
                        <h2 className="text-xl font-bold mb-2 padauk-bold text-slate-700">{t("districts.noDistricts")}</h2>
                        <p className="padauk-regular text-sm">{t("districts.noDistrictsDesc")}</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {published.map((page) => (
                        <Link
                            key={page._id}
                            to={`/districts/${page._id}`}
                            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 block shadow-sm"
                        >
                            {/* Banner */}
                            <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                                {page.bannerImage ? (
                                    <img src={page.bannerImage} alt={page.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-50 flex items-center justify-center">
                                        <MapPin size={50} className="text-slate-200" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-lg md:text-xl font-bold text-slate-900 padauk-bold mb-3 group-hover:text-[#808080] transition-colors leading-tight">
                                    {page.title}
                                </h3>
                                <div
                                    className="text-slate-500 text-sm leading-relaxed line-clamp-3 padauk-regular mb-5"
                                    dangerouslySetInnerHTML={{ __html: page.content.replace(/<[^>]*>?/gm, '') }}
                                />
                                <div className="flex items-center text-sm font-bold text-[#808080] group-hover:underline">
                                    {t("common.readMore")} <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

