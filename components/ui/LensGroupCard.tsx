import React, { useState } from 'react';
import { InventoryItem } from '../CineBrainInterface';
import { cn } from '@/lib/utils';
import { Check, Plus } from 'lucide-react';

interface LensGroupCardProps {
    groupName: string;
    brand?: string;
    items: InventoryItem[];
    onAddItems: (items: InventoryItem[]) => void;
    customSecondary?: React.ReactNode;
}

export function LensGroupCard({ groupName, brand, items, onAddItems, customSecondary }: LensGroupCardProps) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Sort: Numeric Focal Length
    const sortedItems = [...items].sort((a, b) => {
        const getNum = (str: string) => {
            const match = str.match(/(\d+\.?\d*)/);
            return match ? parseFloat(match[1]) : 0;
        };
        const flA = (a as any).focal_length ? getNum((a as any).focal_length) : getNum(a.name);
        const flB = (b as any).focal_length ? getNum((b as any).focal_length) : getNum(b.name);
        return flA - flB;
    });

    const toggleSelection = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const handleBatchAdd = () => {
        const selected = sortedItems.filter(i => selectedIds.has(i.id));
        if (selected.length > 0) {
            onAddItems(selected);
            setSelectedIds(new Set()); // Reset after add
        }
    };

    // Compact Label Logic
    const getLabel = (item: InventoryItem) => {
        if (item.category === 'LNS') {
            const match = item.name.match(/(\d+)\s*mm/i);
            if (match) return match[1];
            return (item as any).focal_length?.replace('mm', '') || item.name;
        }
        // Filters
        if (item.subcategory === 'Filters') {
            const ndMatch = item.name.match(/ND\s*(\d?\.?\d+)/i);
            if (ndMatch) return ndMatch[1];
            const fracMatch = item.name.match(/(\d+\/\d+|\d+)/);
            if (fracMatch) return fracMatch[1];
        }
        return item.name;
    };

    return (
        <div className="bg-white rounded-lg border border-[#E5E5EA] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
            {/* Header + Action Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#F9F9FB] border-b border-[#F2F2F7]">
                <div className="flex flex-col overflow-hidden">
                    <h3 className="font-bold text-xs text-[#1C1C1E] whitespace-nowrap">{groupName}</h3>
                    {customSecondary ? (
                        customSecondary
                    ) : (
                        <span className="text-[9px] text-[#8E8E93] font-bold uppercase truncate">{items[0]?.brand || brand}</span>
                    )}
                </div>

                {selectedIds.size > 0 && (
                    <button
                        onClick={handleBatchAdd}
                        className="flex items-center gap-1 bg-[#007AFF] text-white px-2 py-0.5 rounded text-[10px] font-bold active:bg-blue-700 animate-in fade-in slide-in-from-right-2 duration-200"
                    >
                        <Plus className="w-3 h-3" />
                        Add {selectedIds.size}
                    </button>
                )}
            </div>

            {/* Compact Grid */}
            <div className="p-2 flex flex-wrap gap-1.5 bg-white">
                {sortedItems.map(item => {
                    const isSelected = selectedIds.has(item.id);
                    const label = getLabel(item);
                    return (
                        <button
                            key={item.id}
                            onClick={() => toggleSelection(item.id)}
                            className={cn(
                                "h-6 min-w-[32px] px-1.5 rounded-md text-[10px] font-bold border transition-all flex items-center justify-center relative",
                                isSelected
                                    ? "bg-[#007AFF] text-white border-[#007AFF] shadow-sm"
                                    : "bg-[#F2F2F7] text-[#1C1C1E] border-transparent hover:border-[#C7C7CC] hover:bg-[#E5E5EA]"
                            )}
                            title={item.name}
                        >
                            {label}
                        </button>
                    )
                })}
            </div>
        </div>
    );
}
