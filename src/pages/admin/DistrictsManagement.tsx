import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllDistrictsQuery, useDeleteDistrictMutation } from "../../store/districtApiSlice";
import type { District } from "../../store/districtApiSlice";
import { Plus, Trash2, MapPin, Phone, Eye } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

export default function DistrictsManagement() {
    const { data: districts, isLoading } = useGetAllDistrictsQuery();
    const [deleteDistrict, { isLoading: isDeleting }] = useDeleteDistrictMutation();
    const [districtToDelete, setDistrictToDelete] = useState<string | null>(null);

    const auth = useSelector((state: RootState) => state.auth);
    const canDelete = auth.user?.role === 3; // or whatever logic you prefer

    const handleDelete = async () => {
        if (!districtToDelete) return;
        try {
            await deleteDistrict(districtToDelete).unwrap();
            alert("ခရိုင် အချက်အလက် ဖျက်သိမ်းပြီးပါပြီ");
            setDistrictToDelete(null);
        } catch (err: any) {
            alert(err?.data?.message || "ဖျက်သိမ်းခြင်း မအောင်မြင်ပါ");
        }
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-indigo-500 pl-3">
                        ခရိုင်များ စီမံရန်
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm">
                        ခရိုင်ရုံးခွဲများ၏ အချက်အလက်များကို ထိန်းချုပ်ပါ။
                    </p>
                </div>
                <Link
                    to="/admin/districts/new"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-6 shadow-sm hover:shadow-md"
                >
                    <Plus size={18} />
                    အသစ်ထည့်မည်
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 bg-slate-50 uppercase tracking-wider font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">ခရိုင်ပုံ / အမည်</th>
                                <th className="px-6 py-4">လိပ်စာ</th>
                                <th className="px-6 py-4">ဖုန်းနံပါတ်</th>
                                <th className="px-6 py-4 text-right">လုပ်ဆောင်ချက်</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : districts?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        ခရိုင် အချက်အလက်များ မရှိသေးပါ
                                    </td>
                                </tr>
                            ) : (
                                districts?.map((district: District) => (
                                    <tr key={district._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                                    <img src={district.coverImage} alt={district.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="font-bold">{district.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="flex items-center gap-2 max-w-xs truncate" title={district.address}>
                                                <MapPin size={14} className="text-slate-400 shrink-0" />
                                                <span className="truncate">{district.address}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-slate-400 shrink-0" />
                                                {district.phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 items-center">
                                                {district.mapUrl && (
                                                    <a href={district.mapUrl} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="မြေပုံကြည့်ရန်">
                                                        <Eye size={18} />
                                                    </a>
                                                )}
                                                {canDelete && (
                                                    <button
                                                        onClick={() => setDistrictToDelete(district._id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="ဖျက်မည်"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer totals */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-sm text-slate-500 font-medium">
                    စုစုပေါင်း <b>{districts?.length || 0}</b> ခု
                </div>
            </div>

            {/* Delete Modal */}
            {districtToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">သေချာပြီလား?</h3>
                            <p className="text-slate-500 mb-6">
                                ဤခရိုင်အချက်အလက်ကို ဖျက်ပစ်ပါမည်။ ဖျက်ပြီးပါက ပြန်ယူ၍မရနိုင်ပါ။
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDistrictToDelete(null)}
                                    className="px-4 py-2 text-slate-500 font-semibold hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                                    disabled={isDeleting}
                                >
                                    မလုပ်ပါ
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 shadow-sm disabled:opacity-50 transition-colors"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "ဖျက်နေသည်..." : "ဖျက်ပစ်မည်"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
