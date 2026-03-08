import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import {
    useGetAllStatisticsQuery,
    useCreateStatisticMutation,
    useUpdateStatisticMutation,
    useDeleteStatisticMutation,
    type Statistic
} from "../../store/statisticApiSlice";
import { AlertCircle, Edit, Loader2, Plus, Trash2, X, BarChart2 } from "lucide-react";

export default function StatisticsManagement() {
    const { user } = useSelector((state: RootState) => state.auth);
    // Role 2 and 3 usually have CMS edit access.
    const canEdit = (user?.role ?? 0) >= 2;

    const { data: statistics, isLoading, isError, refetch } = useGetAllStatisticsQuery();
    const [createStatistic, { isLoading: isCreating }] = useCreateStatisticMutation();
    const [updateStatistic, { isLoading: isUpdating }] = useUpdateStatisticMutation();
    const [deleteStatistic, { isLoading: isDeleting }] = useDeleteStatisticMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStat, setEditingStat] = useState<Statistic | null>(null);

    // Form State
    const [titleEn, setTitleEn] = useState("");
    const [titleMm, setTitleMm] = useState("");
    const [value, setValue] = useState("");
    const [dateEn, setDateEn] = useState("");
    const [dateMm, setDateMm] = useState("");
    const [icon, setIcon] = useState("Activity");
    const [order, setOrder] = useState("0");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [statToDelete, setStatToDelete] = useState<string | null>(null);

    const openCreateModal = () => {
        setEditingStat(null);
        setTitleEn("");
        setTitleMm("");
        setValue("");
        setDateEn("");
        setDateMm("");
        setIcon("Activity");
        setOrder("0");
        setIsModalOpen(true);
    };

    const openEditModal = (stat: Statistic) => {
        setEditingStat(stat);
        setTitleEn(stat.title_en);
        setTitleMm(stat.title_mm);
        setValue(stat.value.toString());
        setDateEn(stat.date_en || "");
        setDateMm(stat.date_mm || "");
        setIcon(stat.icon);
        setOrder(stat.order.toString());
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!titleEn || !titleMm || !value) {
            alert("Please complete all required fields.");
            return;
        }

        const data = {
            title_en: titleEn,
            title_mm: titleMm,
            value: Number(value),
            date_en: dateEn,
            date_mm: dateMm,
            icon,
            order: Number(order)
        };

        try {
            if (editingStat) {
                await updateStatistic({ id: editingStat._id, data }).unwrap();
            } else {
                await createStatistic(data).unwrap();
            }
            setIsModalOpen(false);
            setEditingStat(null);
            refetch();
        } catch (err: any) {
            alert(err?.data?.message || "Failed to save statistic");
        }
    };

    const confirmDelete = async () => {
        if (statToDelete) {
            try {
                await deleteStatistic(statToDelete).unwrap();
                setDeleteModalOpen(false);
                setStatToDelete(null);
                refetch();
            } catch (err: any) {
                alert(err?.data?.message || "Failed to delete statistic.");
            }
        }
    };

    const iconOptions = ["Activity", "Users", "Home", "CreditCard", "Briefcase", "MapPin", "Map", "Database", "Globe", "UserCheck", "ShieldCheck", "Heart"];

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-primary pl-3 padauk-bold">
                        ကိန်းဂဏန်းများ စီမံခန့်ခွဲရန်
                    </h1>
                    <p className="text-slate-500 mt-1 padauk-regular">
                        ဝက်ဘ်ဆိုက် ပင်မစာမျက်နှာရှိ လူဦးရေနှင့် မှတ်ပုံတင်စာရင်း ကိန်းဂဏန်းများကို ပြုပြင်ပါ။
                    </p>
                </div>
                {canEdit && (
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm padauk-bold shrink-0"
                    >
                        <Plus size={20} />
                        ကိန်းဂဏန်းသစ် ထည့်မည်
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex space-x-2 justify-center items-center p-12"><Loader2 size={40} className="animate-spin text-primary" /></div>
            ) : isError ? (
                <div className="text-destructive font-semibold text-center p-12 bg-destructive/10 rounded-2xl padauk-bold flex flex-col items-center gap-4">
                    <AlertCircle size={32} />
                    <span>ကိန်းဂဏန်းများ ရယူရာတွင် ချို့ယွင်းချက်ဖြစ်ပေါ်နေပါသည်။</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statistics?.map((stat) => (
                        <div key={stat._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative group hover:border-primary/30 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-primary shadow-inner">
                                    <BarChart2 size={28} />
                                </div>
                                {canEdit && (
                                    <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openEditModal(stat)}
                                            className="p-2 bg-slate-50 border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 rounded-lg transition-all"
                                            title="ပြင်ဆင်မည်"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setStatToDelete(stat._id);
                                                setDeleteModalOpen(true);
                                            }}
                                            className="p-2 bg-slate-50 border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-lg transition-all"
                                            title="ဖျက်မည်"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-3xl font-extrabold text-slate-900 drop-shadow-sm">{stat.value.toLocaleString()}</h3>
                                <div className="text-sm font-bold text-slate-500 mt-2 padauk-bold leading-relaxed">{stat.title_mm}</div>
                                <div className="text-xs font-semibold text-slate-400">{stat.title_en}</div>
                                {(stat.date_mm || stat.date_en) && (
                                    <div className="text-[10px] font-bold text-primary/70 uppercase tracking-tighter mt-1">
                                        As of: {stat.date_mm || stat.date_en}
                                    </div>
                                )}
                                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 flex justify-between">
                                    <span>Icon: <b>{stat.icon}</b></span>
                                    <span>Order: <b>{stat.order}</b></span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {(!statistics || statistics.length === 0) && (
                        <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center">
                            <BarChart2 size={48} className="text-slate-300 mb-4" />
                            <h3 className="text-lg font-bold text-slate-600 padauk-bold">ကိန်းဂဏန်းများ မရှိသေးပါ</h3>
                            <p className="text-slate-500 mt-2 text-sm max-w-sm mx-auto padauk-regular">ကိန်းဂဏန်းများ ထည့်သွင်းရန် "ကိန်းဂဏန်းသစ် ထည့်မည်" ခလုတ်ကို နှိပ်ပါ။</p>
                        </div>
                    )}
                </div>
            )}

            {/* Create / Edit Modal */}
            {isModalOpen && canEdit && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 my-8">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-900 padauk-bold flex items-center gap-2">
                                <BarChart2 size={20} className="text-primary" />
                                {editingStat ? "ကိန်းဂဏန်း ပြင်ဆင်ရန်" : "ကိန်းဂဏန်းသစ် ထည့်သွင်းရန်"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Title (English) <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={titleEn}
                                    onChange={(e) => setTitleEn(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="e.g. Total population"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 padauk-bold">ခေါင်းစဉ် (မြန်မာ) <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={titleMm}
                                    onChange={(e) => setTitleMm(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all padauk-regular"
                                    placeholder="ဥပမာ။ စုစုပေါင်း လူဦးရေ"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Date (English)</label>
                                    <input
                                        type="text"
                                        value={dateEn}
                                        onChange={(e) => setDateEn(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="e.g. December, 2025"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 padauk-bold">ရက်စွဲ (မြန်မာ)</label>
                                    <input
                                        type="text"
                                        value={dateMm}
                                        onChange={(e) => setDateMm(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all padauk-regular"
                                        placeholder="ဥပမာ။ ၂၀၂၅ ဒီဇင်ဘာ"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 padauk-bold">တန်ဖိုး (ဂဏန်း/Number) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="e.g. 150000"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 padauk-bold">အစဉ်</label>
                                    <input
                                        type="number"
                                        value={order}
                                        onChange={(e) => setOrder(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="e.g. 1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 padauk-bold">Icon (ပုံစံ)</label>
                                <select
                                    value={icon}
                                    onChange={(e) => setIcon(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                >
                                    {iconOptions.map(ico => (
                                        <option key={ico} value={ico}>{ico}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                                >
                                    ပယ်ဖျက်မည်
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                    className="px-5 py-2.5 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-2"
                                >
                                    {(isCreating || isUpdating) ? <Loader2 size={16} className="animate-spin" /> : null}
                                    သိမ်းဆည်းမည်
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && canEdit && (
                <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 padauk-regular">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200 border border-slate-200">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 padauk-bold">ဖျက်ပစ်ရန် သေချာပါသလား?</h3>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                            ဤလုပ်ဆောင်ချက်ကို ပြန်လည်မပြင်ဆင်နိုင်ပါ။ ကိန်းဂဏန်းအချက်အလက်များ အပြီးတိုင် ပျက်သွားပါမည်။
                        </p>
                        <div className="flex items-center justify-end gap-3 mt-4">
                            <button
                                onClick={() => {
                                    setDeleteModalOpen(false);
                                    setStatToDelete(null);
                                }}
                                disabled={isDeleting}
                                className="px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-slate-200"
                            >
                                မလုပ်ဆောင်ပါ
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center gap-2"
                            >
                                {isDeleting && <Loader2 size={16} className="animate-spin" />}
                                ဆက်လက်ဖျက်သိမ်းမည်
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
