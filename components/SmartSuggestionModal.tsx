
import React, { useState, useEffect } from 'react';
import { InventoryItem } from './CineBrainInterface';
import { X, Check, Plus, AlertCircle, Link } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartSuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    hostItem: InventoryItem | null;
    suggestions: InventoryItem[];
    onConfirm: (selectedItems: InventoryItem[]) => void;
}

export function SmartSuggestionModal({ isOpen, onClose, hostItem, suggestions, onConfirm }: SmartSuggestionModalProps) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Pre-select all by default? Or none? Let's pre-select all for convenience.
    useEffect(() => {
        if (isOpen && suggestions.length > 0) {
            setSelectedIds(new Set(suggestions.map(s => s.id)));
        }
    }, [isOpen, suggestions]);

    if (!isOpen || !hostItem) return null;

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const handleConfirm = () => {
        const selected = suggestions.filter(s => selectedIds.has(s.id));
        onConfirm(selected);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 transform scale-100 transition-all">

                {/* Header */}
                <div className="bg-[#1A1A1A] text-white p-4 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded text-white flex items-center gap-1">
                                <Link className="w-3 h-3" /> SMART LINK
                            </span>
                            <h3 className="text-sm font-medium opacity-90">Ecosystem Detected</h3>
                        </div>
                        <p className="text-lg font-bold leading-tight">
                            Complete your <span className="text-blue-400">{hostItem.brand} {hostItem.model}</span> kit?
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 max-h-[60vh] overflow-y-auto bg-gray-50">
                    <div className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-wide">
                        Recommended Accessories ({suggestions.length})
                    </div>

                    <div className="space-y-6">
                        {['DIT', 'SUP', 'GRP', 'FLT', 'COM'].map(catId => {
                            const catSuggestions = suggestions.filter(s => s.category === catId);
                            if (catSuggestions.length === 0) return null;

                            const catName = catId === 'DIT' ? 'Media & Data' :
                                catId === 'SUP' ? 'Support' :
                                    catId === 'GRP' ? 'Power & Grip' :
                                        catId === 'FLT' ? 'Essential Filters' : 'Communication';

                            return (
                                <div key={catId} className="space-y-2">
                                    <h5 className="text-[10px] font-bold text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded-sm inline-block uppercase tracking-wider mb-1">
                                        {catName}
                                    </h5>
                                    <div className="space-y-2">
                                        {catSuggestions.map(item => {
                                            const isSelected = selectedIds.has(item.id);
                                            const specs = item.specs_json ? JSON.parse(item.specs_json) : {};

                                            return (
                                                <div
                                                    key={item.id}
                                                    onClick={() => toggleSelection(item.id)}
                                                    className={cn(
                                                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                                                        isSelected
                                                            ? "bg-blue-50 border-blue-200 shadow-sm"
                                                            : "bg-white border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                                                    )}
                                                >
                                                    {/* Checkbox */}
                                                    <div className={cn(
                                                        "w-5 h-5 rounded border flex items-center justify-center transition-colors flex-none",
                                                        isSelected
                                                            ? "bg-blue-600 border-blue-600"
                                                            : "bg-white border-gray-300"
                                                    )}>
                                                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-baseline justify-between gap-2">
                                                            <h4 className="text-sm font-bold text-gray-900 truncate">
                                                                {item.brand !== "Generic" && <span className="font-normal opacity-70">{item.brand} </span>}
                                                                {item.model}
                                                            </h4>
                                                        </div>
                                                        {specs.description && (
                                                            <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                                                                {specs.description}
                                                            </p>
                                                        )}

                                                        {/* Compatibility Tag */}
                                                        {specs.compatibility && Array.isArray(specs.compatibility) && (
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {specs.compatibility.map((c: string, i: number) => (
                                                                    <span key={i} className="text-[9px] text-blue-600 bg-blue-50 px-1 rounded">
                                                                        Fits {c}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between gap-4">
                    <div className="text-xs text-gray-400">
                        {selectedIds.size} items selected
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            No thanks
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={selectedIds.size === 0}
                            className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Selected
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
