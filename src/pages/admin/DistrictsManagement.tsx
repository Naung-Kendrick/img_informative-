import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetAllDistrictsQuery, useDeleteDistrictMutation, useReorderDistrictsMutation } from "../../store/districtApiSlice";
import type { District } from "../../store/districtApiSlice";
import { Plus, Trash2, MapPin, Phone, Eye, Edit, UserCircle, GripVertical, Save, CheckCircle2, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useModal } from "../../context/ModalContext";

// DnD Kit Imports
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableDistrictRow({
    district,
    canDelete,
    setDistrictToDelete
}: {
    district: District;
    canDelete: boolean;
    setDistrictToDelete: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: district._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`
                transition-colors group padauk-regular
                ${isDragging ? "bg-slate-100 shadow-inner" : "hover:bg-slate-50/50"}
            `}
        >
            <td className="px-6 py-4">
                <div
                    {...attributes}
                    {...listeners}
                    className="p-1.5 inline-block cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <GripVertical size={16} />
                </div>
            </td>
            <td className="px-6 py-4 font-medium text-slate-900">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 shadow-inner">
                        <img loading="lazy" src={district.coverImage} alt={district.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="font-bold text-base">{district.name}</div>
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
            <td className="px-6 py-4 text-slate-600">
                {district.officerInCharge ? (
                    <div className="flex items-center gap-2">
                        <UserCircle size={14} className="text-slate-400 shrink-0" />
                        {district.officerInCharge}
                    </div>
                ) : (
                    <span className="text-slate-300 italic text-xs">—</span>
                )}
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 items-center">
                    {district.mapUrl && (
                        <a href={district.mapUrl} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="မြေပုံကြည့်ရန်">
                            <Eye size={18} />
                        </a>
                    )}
                    <Link
                        to={`/admin/districts/edit/${district._id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                        title="ပြင်ဆင်မည်"
                    >
                        <Edit size={18} />
                    </Link>
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
    );
}

export default function DistrictsManagement() {
    const { data: districts, isLoading, refetch } = useGetAllDistrictsQuery();
    const { showSuccess, showError } = useModal();
    const [deleteDistrict, { isLoading: isDeleting }] = useDeleteDistrictMutation();
    const [reorderDistricts] = useReorderDistrictsMutation();
    const [districtToDelete, setDistrictToDelete] = useState<string | null>(null);

    const [orderedDistricts, setOrderedDistricts] = useState<District[]>([]);
    const [reorderStatus, setReorderStatus] = useState<"idle" | "changed" | "saving" | "saved">("idle");

    const auth = useSelector((state: RootState) => state.auth);
    const canDelete = auth.user?.role === 3;
    const canEdit = (auth.user?.role ?? 0) >= 2;

    useEffect(() => {
        if (districts && districts.length > 0) {
            setOrderedDistricts([...districts]);
            setReorderStatus("idle");
        } else {
            setOrderedDistricts([]);
        }
    }, [districts]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setOrderedDistricts((items) => {
                const oldIndex = items.findIndex(item => item._id === active.id);
                const newIndex = items.findIndex(item => item._id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                setReorderStatus("changed");
                return newItems;
            });
        }
    };

    const handleSaveOrder = async () => {
        if (reorderStatus !== "changed") return;
        setReorderStatus("saving");

        const reorderedData = orderedDistricts.map((d, index) => ({
            id: d._id,
            order: index
        }));

        try {
            await reorderDistricts(reorderedData).unwrap();
            setReorderStatus("saved");
            showSuccess("သိမ်းဆည်းပြီးပါပြီ", "ရုံးခွဲများ၏ အစီအစဥ်ကို သိမ်းဆည်းပြီးပါပြီ");
            setTimeout(() => setReorderStatus("idle"), 2000);
            refetch();
        } catch (err) {
            console.error(err);
            showError("မအောင်မြင်ပါ", "စီစဥ်မှု သိမ်းဆည်းရန် မအောင်မြင်ပါ။");
            setReorderStatus("changed");
        }
    };

    const handleDelete = async () => {
        if (!districtToDelete) return;
        try {
            await deleteDistrict(districtToDelete).unwrap();
            showSuccess("အောင်မြင်ပါသည်", "ရုံးခွဲ အချက်အလက် ဖျက်သိမ်းပြီးပါပြီ");
            setDistrictToDelete(null);
            refetch();
        } catch (err: any) {
            showError("မအောင်မြင်ပါ", err?.data?.message || "ဖျက်သိမ်းခြင်း မအောင်မြင်ပါ");
        }
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-[#808080] pl-3 padauk-bold">
                        လူဝင်မှုကြီးကြပ်ရေးရုံးများ စီမံရန်
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm padauk-regular">
                        ရုံးခွဲများ၏ အချက်အလက်များကို စီမံခန့်ခွဲပါ။ (ဆွဲရွှေ့၍ အစီအစဉ်ပြောင်းနိုင်သည်)
                    </p>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                    {canEdit && (reorderStatus === "changed" || reorderStatus === "saving") && (
                        <button
                            onClick={handleSaveOrder}
                            disabled={reorderStatus === "saving"}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm padauk-bold shrink-0 shadow-emerald-600/20"
                        >
                            {reorderStatus === "saving" ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            အစီအစဉ် သိမ်းဆည်းမည်
                        </button>
                    )}
                    {canEdit && reorderStatus === "saved" && (
                        <button disabled className="flex items-center gap-2 border border-emerald-200 bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-xl font-bold transition-all shrink-0 cursor-default">
                            <CheckCircle2 size={18} />
                            သိမ်းဆည်းပြီးပါပြီ
                        </button>
                    )}
                    <Link
                        to="/admin/districts/new"
                        className="flex items-center gap-2 bg-[#808080] hover:bg-[#555555] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-[#808080]/20 padauk-bold shrink-0"
                    >
                        <Plus size={20} />
                        အသစ်ထည့်မည်
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold padauk-bold text-[15px]">
                            <tr>
                                <th className="px-6 py-4 w-16"></th>
                                <th className="px-6 py-4">ရုံးခွဲပုံ / အမည်</th>
                                <th className="px-6 py-4">လိပ်စာ</th>
                                <th className="px-6 py-4">ဖုန်းနံပါတ်</th>
                                <th className="px-6 py-4">တာဝန်ခံအရာရှိ</th>
                                <th className="px-6 py-4 text-right">လုပ်ဆောင်ချက်</th>
                            </tr>
                        </thead>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : orderedDistricts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            လူဝင်မှုကြီးကြပ်ရေးရုံး အချက်အလက်များ မရှိသေးပါ
                                        </td>
                                    </tr>
                                ) : (
                                    <SortableContext items={orderedDistricts.map(d => d._id)} strategy={verticalListSortingStrategy}>
                                        {orderedDistricts.map((district) => (
                                            <SortableDistrictRow
                                                key={district._id}
                                                district={district}
                                                canDelete={canDelete}
                                                setDistrictToDelete={setDistrictToDelete}
                                            />
                                        ))}
                                    </SortableContext>
                                )}
                            </tbody>
                        </DndContext>
                    </table>
                </div>

                {/* Footer totals */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-sm text-slate-500 font-medium padauk-bold">
                    စုစုပေါင်း <b>{orderedDistricts.length || 0}</b> ခု
                </div>
            </div>

            {/* Delete Modal */}
            {districtToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">သေချာပြီလား?</h3>
                            <p className="text-slate-500 mb-6">
                                ဤရုံးခွဲအချက်အလက်ကို ဖျက်ပစ်ပါမည်။ ဖျက်ပြီးပါက ပြန်ယူ၍မရနိုင်ပါ။
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
                                    {isDeleting ? <Loader2 size={18} className="animate-spin" /> : "ဖျက်ပစ်မည်"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

