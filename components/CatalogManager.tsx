"use client";

import { useState, useEffect } from "react";
import { getGlobalCatalogAction, deleteEquipmentAction, approveEquipmentAction } from "@/app/actions";
import { X, Trash2, ShieldCheck, Search, Filter, CheckCircle, ExternalLink } from "lucide-react";
import { InventoryItem } from "./CineBrainInterface";

interface CatalogManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CatalogManager({ isOpen, onClose }: CatalogManagerProps) {
    const [catalog, setCatalog] = useState<InventoryItem[]>([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<'ALL' | 'QUEUE' | 'VERIFIED'>('QUEUE'); // Default to Queue
    const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            refreshCatalog();
        }
    }, [isOpen]);

    const refreshCatalog = async () => {
        const data = await getGlobalCatalogAction();
        setCatalog(data as any);
    };

    const handleDelete = async (id: string) => {
        if (confirmingDelete !== id) {
            setConfirmingDelete(id);
            setTimeout(() => setConfirmingDelete(null), 3000);
            return;
        }
        await deleteEquipmentAction(id);
        setConfirmingDelete(null);
        refreshCatalog();
    };

    const handleApprove = async (id: string) => {
        await approveEquipmentAction(id);
        refreshCatalog();
    };

    if (!isOpen) return null;

    const filtered = catalog.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'ALL' ||
            (filter === 'QUEUE' && item.status === 'PENDING') ||
            (filter === 'VERIFIED' && item.status === 'APPROVED');
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="px-8 py-6 border-b border-[#F2F2F7] flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-[#1C1C1E]">GLOBAL CATALOG</h2>
                        <p className="text-[11px] text-[#8E8E93] font-bold uppercase tracking-widest mt-0.5">Admin Management Panel</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[#F2F2F7] rounded-full transition-colors">
                        <X className="w-6 h-6 text-[#1C1C1E]" />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="px-8 py-4 bg-[#F9F9FB] border-b border-[#F2F2F7] flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C7C7CC]" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Find items..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E5EA] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                        />
                    </div>

                    <div className="flex bg-[#E5E5EA]/50 p-1 rounded-xl">
                        {(['ALL', 'QUEUE', 'VERIFIED'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${filter === f ? "bg-white text-black shadow-sm" : "text-[#8E8E93]"
                                    }`}
                            >
                                {f === 'QUEUE' ? 'BEKLEME ODASI' : f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#F9F9FB]">
                    {filtered.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-2xl border border-[#F2F2F7] hover:border-black/5 transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black ${item.category === 'CAM' ? 'bg-[#FF3B30]/10 text-[#FF3B30]' :
                                    item.category === 'LNS' ? 'bg-[#34C759]/10 text-[#34C759]' :
                                        'bg-[#5856D6]/10 text-[#5856D6]'
                                    }`}>
                                    {item.category}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-[14px] font-bold text-[#1C1C1E]">{item.name}</h3>
                                        {item.isAiResearched && (
                                            <span className="flex items-center gap-1 bg-blue-50 text-blue-500 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                                                <ShieldCheck className="w-3 h-3" />
                                                AI Generated
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-[#8E8E93] font-bold uppercase">{item.subcategory || 'Standard'}</span>
                                        {item.mount && <span className="text-[10px] text-white bg-black px-1.5 rounded-sm font-black">{item.mount}</span>}
                                        {item.sensor_size && <span className="text-[10px] bg-[#F2F2F7] px-1.5 rounded-sm text-[#8E8E93] font-bold">{item.sensor_size}</span>}
                                        {item.sourceUrl && (
                                            <a
                                                href={item.sourceUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-[9px] text-blue-500 hover:text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded-sm transition-colors"
                                            >
                                                SOURCE <ExternalLink size={10} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {filter === 'QUEUE' && (
                                    <button
                                        onClick={() => handleApprove(item.id)}
                                        className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-all border border-green-200 flex items-center gap-2"
                                        title="Approve & Publish"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="text-[10px] font-bold">ONAYLA</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="h-40 flex flex-col items-center justify-center text-[#C7C7CC]">
                            <Filter className="w-10 h-10 mb-2 opacity-20" />
                            <p className="text-[13px] font-bold">No results found</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-white border-t border-[#F2F2F7] flex items-center justify-between text-[#8E8E93] text-[11px] font-medium">
                    <p>{filtered.length} items listed</p>
                    <p>CineBrain Pro Infrastructure v2.0</p>
                </div>
            </div>
        </div>
    );
}
