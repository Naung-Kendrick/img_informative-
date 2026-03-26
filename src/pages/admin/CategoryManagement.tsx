import { useState, useEffect } from "react";
import {
    Loader2,
    Plus,
    Edit,
    Trash2,
    AlertCircle,
    GripVertical,
    Save,
    CheckCircle2
} from "lucide-react";
import {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useReorderCategoriesMutation,
} from "../../store/categoryApiSlice";
import type { Category } from "../../store/categoryApiSlice";
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

// Sortable Item Component
function SortableCategoryItem({
    id,
    cat,
    index,
    canEdit,
    canDelete,
    onEdit,
    onDelete
}: {
    id: string;
    cat: Category;
    index: number;
    canEdit: boolean;
    canDelete: boolean;
    onEdit: (cat: Category) => void;
    onDelete: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                grid grid-cols-[auto_1fr_2fr_auto] gap-4 p-4 rounded-xl items-center transition-colors
                ${isDragging ? "bg-slate-100/80 shadow-inner ring-2 ring-primary/20" : "hover:bg-slate-50 bg-white"}
            `}
        >
            <div className="w-10 flex justify-center">
                <div 
                    {...attributes} 
                    {...listeners}
                    className="p-2 cursor-grab active:cursor-grabbing text-slate-300 hover:text-[#1e3a8a] hover:bg-[#1e3a8a]/10 rounded-lg transition-colors"
                >
                    <GripVertical size={20} />
                </div>
            </div>
            <div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1e3a8a]/5 text-[#1e3a8a] flex items-center justify-center font-bold text-xs border border-[#1e3a8a]/10">
                        {index + 1}
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-900 padauk-bold line-clamp-1">{cat.title}</h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest truncate">{cat.slug}</p>
                    </div>
                </div>
            </div>
            <div className="text-sm text-slate-600 padauk-regular line-clamp-1">
                {cat.description || <span className="text-slate-300">No description</span>}
            </div>
            <div className="flex justify-end gap-2 pr-2">
                {canEdit && (
                    <button
                        onClick={() => onEdit(cat)}
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all font-bold"
                        title="ပြင်ဆင်ရန်"
                    >
                        <Edit size={16} />
                    </button>
                )}
                {canDelete && (
                    <button
                        onClick={() => onDelete(cat._id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all font-bold"
                        title="ဖျက်သိမ်းရန်"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}

export default function CategoryManagement() {
    const { user } = useSelector((state: RootState) => state.auth);
    const { showSuccess, showError } = useModal();
    const role = user?.role ?? 0;
    const canEdit = role >= 2;
    const canDelete = role >= 3;

    const { data, isLoading, isError, refetch } = useGetAllCategoriesQuery();
    const categories = data?.categories || [];

    const [orderedCategories, setOrderedCategories] = useState<Category[]>([]);
    const [reorderStatus, setReorderStatus] = useState<"idle" | "changed" | "saving" | "saved">("idle");

    // Sync sorted categories from API when data changes
    useEffect(() => {
        if (categories.length > 0) {
            setOrderedCategories([...categories].sort((a, b) => a.order - b.order));
            setReorderStatus("idle");
        } else {
            setOrderedCategories([]);
        }
    }, [categories]);

    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
    const [reorderCategories] = useReorderCategoriesMutation();

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [currentCat, setCurrentCat] = useState<Partial<Category>>({ title: "", description: "" });
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setOrderedCategories((items) => {
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

        const reorderedData = orderedCategories.map((c, index) => ({
            id: c._id,
            order: index
        }));

        try {
            await reorderCategories(reorderedData).unwrap();
            setReorderStatus("saved");
            showSuccess("သိမ်းဆည်းပြီးပါပြီ", "ကဏ္ဍ အစီအစဥ်ကို အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ");
            setTimeout(() => setReorderStatus("idle"), 2000);
            refetch();
        } catch (err) {
            console.error("Failed to save order:", err);
            showError("မအောင်မြင်ပါ", "စီစဥ်မှု သိမ်းဆည်းရန် မအောင်မြင်ပါ။");
            setReorderStatus("changed");
        }
    };

    const handleSaveCategory = async () => {
        if (!currentCat.title?.trim()) {
            showError("လိုအပ်ချက်", "ကဏ္ဍ အမည်ကို ထည့်သွင်းပါ။");
            return;
        }

        try {
            if (modalMode === "create") {
                await createCategory({
                    title: currentCat.title,
                    description: currentCat.description
                }).unwrap();
            } else if (currentCat._id) {
                await updateCategory({
                    id: currentCat._id,
                    data: { title: currentCat.title, description: currentCat.description }
                }).unwrap();
            }
            showSuccess("အောင်မြင်ပါသည်", modalMode === "create" ? "ကဏ္ဍအသစ် တည်ဆောက်ပြီးပါပြီ" : "ကဏ္ဍကို ပြင်ဆင်ပြီးပါပြီ");
            setShowModal(false);
            refetch();
        } catch (err: any) {
            console.error("Failed to save category:", err);
            showError("မအောင်မြင်ပါ", err?.data?.message || err?.message || "လုပ်ဆောင်မှု မအောင်မြင်ပါ။");
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteCategory(deleteId).unwrap();
            setDeleteId(null);
            showSuccess("အောင်မြင်ပါသည်", "ကဏ္ဍကို အောင်မြင်စွာ ဖျက်သိမ်းပြီးပါပြီ");
            refetch();
        } catch (err: any) {
            console.error("Failed to delete category:", err);
            showError("မအောင်မြင်ပါ", err?.data?.message || err?.message || "ဖျက်သိမ်းရန် မအောင်မြင်ပါ။");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 border-l-4 border-primary pl-3 padauk-bold">
                        ကဏ္ဍများ စီမံခန့်ခွဲရန်
                    </h1>
                    <p className="text-slate-500 mt-1 padauk-regular font-medium">
                        ၀က်ဘ်ဆိုဒ်တွင် ပေါ်မည့် ကဏ္ဍ(Categories) အမည်များကို ပြင်ဆင်ခြင်း၊ ထပ်တိုးခြင်းနှင့် အစီအစဉ် ပြောင်းလဲထားရှိနိုင်ပါသည်။
                    </p>
                </div>
                {canEdit && (
                    <div className="flex items-center gap-3 shrink-0">
                        {(reorderStatus === "changed" || reorderStatus === "saving") && (
                            <button
                                onClick={handleSaveOrder}
                                disabled={reorderStatus === "saving"}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm padauk-bold shrink-0 shadow-emerald-600/20"
                            >
                                {reorderStatus === "saving" ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                အစီအစဉ် သိမ်းဆည်းမည်
                            </button>
                        )}
                        {reorderStatus === "saved" && (
                            <button disabled className="flex items-center gap-2 border border-emerald-200 bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-xl font-bold transition-all shrink-0 cursor-default">
                                <CheckCircle2 size={18} />
                                သိမ်းဆည်းပြီးပါပြီ
                            </button>
                        )}

                        <button
                            onClick={() => {
                                setModalMode("create");
                                setCurrentCat({ title: "", description: "" });
                                setShowModal(true);
                            }}
                            className="flex items-center gap-2 bg-primary hover:bg-[#1e1b4b] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm padauk-bold shrink-0 shadow-primary/20"
                        >
                            <Plus size={20} />
                            ကဏ္ဍအသစ် စာရင်းသွင်းမည်
                        </button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="flex justify-center p-20"><Loader2 size={40} className="animate-spin text-primary" /></div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center p-20 text-red-500 gap-4 bg-red-50 rounded-3xl border border-red-100 mx-4">
                    <AlertCircle size={48} />
                    <h3 className="font-bold text-xl padauk-bold text-center">ကဏ္ဍများ ရယူရာတွင် ချို့ယွင်းချက်ဖြစ်ပေါ်နေပါသည်။</h3>
                </div>
            ) : orderedCategories.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-20 text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 padauk-bold">ကဏ္ဍများ မရှိသေးပါ</h3>
                    <p className="text-slate-500 padauk-regular font-medium">လက်ရှိဝက်ဘ်ဆိုဒ်တွင် ကဏ္ဍစာရင်းများ ထည့်သွင်းထားခြင်း မရှိသေးပါ။</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    {/* Header Row */}
                    <div className="grid grid-cols-[auto_1fr_2fr_auto] gap-4 p-5 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-400 uppercase tracking-widest">
                        <div className="w-10 text-center">Drag</div>
                        <div>Category Title</div>
                        <div>Description</div>
                        <div className="text-right pr-4">Actions</div>
                    </div>

                    {/* Draggable List */}
                    <div className="divide-y divide-slate-100 p-2">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={orderedCategories.map(c => c._id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {orderedCategories.map((cat, index) => (
                                    <SortableCategoryItem
                                        key={cat._id}
                                        id={cat._id}
                                        cat={cat}
                                        index={index}
                                        canEdit={canEdit}
                                        canDelete={canDelete}
                                        onEdit={(c) => {
                                            setModalMode("edit");
                                            setCurrentCat({ _id: c._id, title: c.title, description: c.description || "" });
                                            setShowModal(true);
                                        }}
                                        onDelete={(id) => setDeleteId(id)}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 padauk-regular">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                                {modalMode === "create" ? <Plus size={24} /> : <Edit size={24} />}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 padauk-bold">
                                    {modalMode === "create" ? "ကဏ္ဍအသစ် တည်ဆောက်မည်" : "ကဏ္ဍ ပြင်ဆင်မည်"}
                                </h3>
                                <p className="text-slate-500 text-sm font-medium mt-1">အချက်အလက်ကို ပြည့်စုံစွာ ထည့်သွင်းပါ။</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                                    Category Name (ကဏ္ဍ အမည်) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={currentCat.title}
                                    onChange={e => setCurrentCat({ ...currentCat, title: e.target.value })}
                                    placeholder="ဥပမာ။ အထူးသတင်း"
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                                    Description (အကြောင်းအရာ)
                                </label>
                                <textarea
                                    rows={3}
                                    value={currentCat.description}
                                    onChange={e => setCurrentCat({ ...currentCat, description: e.target.value })}
                                    placeholder="ကဏ္ဍ၏ အသေးစိတ်အကြောင်းအရာ..."
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold resize-none"
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-3 font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                ပယ်ဖျက်မည်
                            </button>
                            <button
                                onClick={handleSaveCategory}
                                disabled={isCreating || isUpdating}
                                className="px-6 py-3 font-bold text-white bg-primary rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center gap-2"
                            >
                                {(isCreating || isUpdating) ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {modalMode === "create" ? "စာရင်းသွင်းမည်" : "သိမ်းဆည်းမည်"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 padauk-regular">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2 padauk-bold">ဖျက်ပစ်ရန် သေချာပါသလား?</h3>
                        <p className="text-slate-500 text-sm mb-8 font-medium">
                            ဤကဏ္ဍကို ဖျက်လိုက်ပါက ပြန်လည်မရနိုင်ပါ။
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="py-3 font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                ပယ်ဖျက်မည်
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="py-3 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2"
                            >
                                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : "ဖျက်သိမ်းမည်"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
