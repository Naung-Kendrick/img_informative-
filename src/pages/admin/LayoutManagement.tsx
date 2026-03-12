import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGetLayoutQuery, useUpdateLayoutMutation } from "../../store/layoutApiSlice";
import type { ILayoutSection } from "../../store/layoutApiSlice";
import { useModal } from "../../context/ModalContext";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Switch } from "../../components/ui/switch";
import { Button } from "../../components/ui/button";
import { Loader2, GripVertical, Section } from "lucide-react";

// Sortable Item Component
function SortableLayoutItem({ 
    id, 
    section, 
    onToggle 
}: { 
    id: string; 
    section: ILayoutSection; 
    onToggle: (id: string, checked: boolean) => void 
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className="flex items-center justify-between p-4 mb-3 bg-card border border-border rounded-xl shadow-sm cursor-default hover:border-primary/30 transition-colors"
        >
            <div className="flex items-center gap-4">
                <div 
                    {...attributes} 
                    {...listeners} 
                    className="p-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors bg-secondary/30 rounded-lg hover:bg-secondary/60"
                >
                    <GripVertical size={20} />
                </div>
                <div className="flex items-center gap-3">
                    <Section size={18} className="text-primary hidden sm:block" />
                    <div>
                        <h4 className="font-bold text-sm text-foreground">{section.title}</h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-1">ID: {section.sectionId}</p>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${section.isVisible ? 'text-primary' : 'text-muted-foreground/60'}`}>
                    {section.isVisible ? 'Visible' : 'Hidden'}
                </span>
                <Switch 
                    checked={section.isVisible} 
                    onCheckedChange={(checked: boolean) => onToggle(section.sectionId, checked)}
                />
            </div>
        </div>
    );
}

export default function LayoutManagement() {
    useTranslation();
    const { showSuccess, showError } = useModal();
    const { data: initialLayout, isLoading, refetch } = useGetLayoutQuery();
    const [updateLayout, { isLoading: isUpdating }] = useUpdateLayoutMutation();
    
    const [sections, setSections] = useState<ILayoutSection[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (initialLayout) {
            setSections([...initialLayout].sort((a,b) => a.order - b.order));
            setHasChanges(false);
        }
    }, [initialLayout]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (over && active.id !== over.id) {
            setSections((items) => {
                const oldIndex = items.findIndex(item => item.sectionId === active.id);
                const newIndex = items.findIndex(item => item.sectionId === over.id);
                
                const newItems = arrayMove(items, oldIndex, newIndex);
                // Update orders implicitly by their array index position
                const updatedOrders = newItems.map((item, index) => ({
                    ...item,
                    order: index + 1
                }));
                
                setHasChanges(true);
                return updatedOrders;
            });
        }
    };

    const handleToggleVisibility = (sectionId: string, isVisible: boolean) => {
        setSections(items => {
            const newItems = items.map(item => 
                item.sectionId === sectionId ? { ...item, isVisible } : item
            );
            setHasChanges(true);
            return newItems;
        });
    };

    const handleSave = async () => {
        try {
            await updateLayout(sections).unwrap();
            showSuccess("အောင်မြင်ပါသည်", "Home Page Layout update လိုက်ပါပြီ။");
            setHasChanges(false);
            refetch();
        } catch (error) {
            showError("မအောင်မြင်ပါ", "Layout update လုပ်ရာတွင် အဆင်မပြေပါ။");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-8 rounded-2xl border border-border shadow-sm">
                <div>
                    <h1 className="h3 mb-2 flex items-center gap-2">
                        Home Page Layout Manager
                    </h1>
                    <p className="p-muted text-sm max-w-xl">
                        Drag and drop sections to reorder how they appear on the public home page. 
                        Use the switches to hide or show specific features dynamically.
                    </p>
                </div>
                
                <Button 
                    onClick={handleSave} 
                    disabled={!hasChanges || isUpdating}
                    className="font-bold min-w-[150px] py-6 shadow-xl"
                >
                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    {hasChanges ? "Save Layout" : "Saved"}
                </Button>
            </div>

            <div className="max-w-4xl mx-auto bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm">
                <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext 
                        items={sections.map(s => s.sectionId)}
                        strategy={verticalListSortingStrategy}
                    >
                        {sections.map((section) => (
                            <SortableLayoutItem 
                                key={section.sectionId} 
                                id={section.sectionId} 
                                section={section}
                                onToggle={handleToggleVisibility}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}
