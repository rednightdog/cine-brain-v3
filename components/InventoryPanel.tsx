import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { InventoryEntry, InventoryItem } from './CineBrainInterface';
import { Plus, X, Settings2, Minus, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CATEGORIES, isCameraBody, getCameraColor, getCropFactor } from '@/lib/inventory-utils';
import { Search, Info, AlertTriangle, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { validateCompatibility } from '@/lib/compatibility';
import { researchEquipmentDraftAction, saveDraftsToCatalogAction, createCustomItemAction, deleteCustomItemAction } from '@/app/actions';
import { LensGroupCard } from './ui/LensGroupCard';
import { WarningBadge, WarningTooltip } from './ui/WarningBadge';
import { getCompatibleAccessories } from '@/lib/camera-accessories';
import { getProTips } from '@/lib/pro-tips';
import { Lightbulb, ChevronDown } from 'lucide-react';
import { SmartSuggestionModal } from './SmartSuggestionModal';

const SUBCATEGORY_OPTIONS: Record<string, string[]> = {
    CAM: ['Generic', 'Bodies', 'Monitor', 'Media', 'Power', 'Support', 'GoPro', 'Drone', 'Specialty'],
    LNS: ['Generic', 'Prime', 'Zoom', 'Anamorphic', 'Vintage', 'Macro', 'Filter', 'Adapter'],
    LIT: ['Generic', 'LED', 'Daylight', 'Tungsten', 'HMI', 'Tube', 'Panel', 'Modifier', 'Stand', 'Grip', 'Control'],
    SUP: ['Generic', 'Tripod', 'Head', 'Stabilizer', 'Gimbal', 'EasyRig', 'Slider', 'Dolly', 'Jib', 'Car Mount', 'Matte Box', 'Follow Focus', 'Wireless', 'Audio', 'Batteries', 'Media'],
};

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface InventoryPanelProps {
    inventory: InventoryEntry[];
    catalog: InventoryItem[];
    warnings: string[];
    onAddItem: (item: InventoryItem, targetCam?: string) => void;
    onUpdateItem: (id: string, updates: any) => void; // Used for config
    onToggleOption: (entryIdx: number, childId: string) => void; // Requires idx unfortunately
    onQtyChange: (entryIdx: number, delta: number) => void;
    onSetConfigEntry: (entry: any) => void; // Opens modal
    onOpenAdmin?: () => void;
}

export function InventoryPanel(props: InventoryPanelProps) {
    const {
        inventory,
        catalog,
        warnings,
        onAddItem,
        onUpdateItem,
        onToggleOption,
        onQtyChange,
        onSetConfigEntry,
        onOpenAdmin
    } = props;

    const router = useRouter(); // <--- Initialize Router

    // Local UI State
    const [activeTab, setActiveTab] = useState("CAM");
    const [cameraFilter, setCameraFilter] = useState<'ALL' | 'A' | 'B' | 'C'>('ALL');
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isResearching, setIsResearching] = useState(false);
    const [draftItems, setDraftItems] = useState<any[] | null>(null); // Drafts from AI (Array)
    // Technical Filters - dynamic based on category
    const [technicalFilter, setTechnicalFilter] = useState<string>('ALL');
    const [lensTypeFilter, setLensTypeFilter] = useState<'ALL' | 'Anamorphic' | 'Spherical' | 'Vintage'>('ALL');
    const [lensCoverageFilter, setLensCoverageFilter] = useState<'ALL' | 'S35' | 'FF' | 'LF'>('ALL');
    const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set());

    // Custom Item State
    const [isCreatingCustom, setIsCreatingCustom] = useState(false);
    const [customForm, setCustomForm] = useState({
        brand: "",
        model: "",
        description: "",
        category: "CAM",
        subcategory: "Bodies"
    });

    const [isProTipsOpen, setIsProTipsOpen] = useState(false);

    // Replication State
    const [replicationData, setReplicationData] = useState<{ items: InventoryItem[], primaryCam: string } | null>(null);
    const [replicationTargets, setReplicationTargets] = useState<Set<string>>(new Set());

    // Smart Suggestion State
    const [smartSuggestion, setSmartSuggestion] = useState<{ isOpen: boolean; host: InventoryItem | null; suggestions: InventoryItem[]; pendingItems: InventoryItem[] }>({
        isOpen: false,
        host: null,
        suggestions: [],
        pendingItems: []
    });

    // Reset filters when changing category
    React.useEffect(() => {
        setTechnicalFilter('ALL');
        setLensTypeFilter('ALL');
        setLensCoverageFilter('ALL');
    }, [activeTab]);

    // Pre-fill Custom Form when opening
    React.useEffect(() => {
        if (isCreatingCustom) {
            setCustomForm(prev => ({
                ...prev,
                category: activeTab,
                subcategory: technicalFilter !== 'ALL' ? technicalFilter : (SUBCATEGORY_OPTIONS[activeTab]?.[0] || 'General')
            }));
        }
    }, [isCreatingCustom, activeTab, technicalFilter]);

    // Filter Logic
    const sortedInventory = useMemo(() => {
        return [...inventory].sort((a, b) => {
            if (a.assignedCam !== b.assignedCam) return a.assignedCam.localeCompare(b.assignedCam);
            const itemA = catalog.find(i => i.id === a.equipmentId);
            const itemB = catalog.find(i => i.id === b.equipmentId);
            const brandA = itemA?.brand?.toLowerCase() || '';
            const brandB = itemB?.brand?.toLowerCase() || '';
            if (brandA !== brandB) return brandA.localeCompare(brandB);
            const modelA = itemA?.model?.toLowerCase() || itemA?.name?.toLowerCase() || '';
            const modelB = itemB?.model?.toLowerCase() || itemB?.name?.toLowerCase() || '';
            return modelA.localeCompare(modelB);
        }).filter(entry => {
            if (cameraFilter !== 'ALL' && entry.assignedCam !== cameraFilter) return false;
            const item = catalog.find(i => i.id === entry.equipmentId);
            if (item?.category !== activeTab) return false;

            // Subcategory filtering for Support and Light in the main list
            if ((activeTab === 'SUP' || activeTab === 'LIT') && technicalFilter !== 'ALL') {
                const sub = item.subcategory || '';
                if (technicalFilter === 'Filters') return sub.includes('Filter');
                if (technicalFilter === 'Batteries') return sub.includes('Batter');
                if (technicalFilter === 'Media') return sub.includes('Media') || sub.includes('Card');
                if (technicalFilter === 'Matte Box') return sub.toLowerCase().includes('matte');
                if (technicalFilter === 'Focus') return sub.includes('Focus') || sub.includes('FIZ');
                if (technicalFilter === 'Wireless') return sub.includes('Wireless') || sub.includes('Transmitter');
                if (technicalFilter === 'Support') return ['Head', 'Handheld', 'Vest', 'Rods', 'Tripod', 'Gimbal', 'Dolly', 'Slider', 'Fluid Head', 'Tripod Legs'].includes(sub);
                if (technicalFilter === 'Audio') return sub.includes('Microphone') || sub.includes('Recorder');
                return sub === technicalFilter;
            }
            return true;
        });
    }, [inventory, cameraFilter, activeTab, catalog, technicalFilter]);

    // Grouping logic for the Kit list (Selected Section)
    const displayInventory = useMemo(() => {
        if (activeTab !== 'LNS') {
            return sortedInventory.map(entry => ({ type: 'item' as const, entry }));
        }

        const groups = new Map<string, {
            assignedCam: string;
            brand: string;
            series: string;
            entries: InventoryEntry[];
        }>();

        sortedInventory.forEach(entry => {
            const item = catalog.find(i => i.id === entry.equipmentId);
            if (!item) return;

            const series = item.model || item.name.replace(/\s*\d+\s*mm.*/gi, '').trim();
            const key = `${entry.assignedCam}-${item.brand}-${series}`;

            if (!groups.has(key)) {
                groups.set(key, {
                    assignedCam: entry.assignedCam,
                    brand: item.brand || '',
                    series,
                    entries: []
                });
            }
            groups.get(key)!.entries.push(entry);
        });

        return Array.from(groups.values()).map(g => ({ type: 'group' as const, ...g })).sort((a, b) => {
            if (a.brand !== b.brand) return a.brand.localeCompare(b.brand);
            return a.series.localeCompare(b.series);
        });
    }, [sortedInventory, activeTab, catalog]);

    // Professional Advice (Pro Tips)
    const proTips = useMemo(() => getProTips(inventory), [inventory]);

    // Derived: Active Cameras
    const activeCameras = useMemo(() => {
        const cams = new Set<string>();
        inventory.forEach(i => cams.add(i.assignedCam));
        return Array.from(cams).sort();
    }, [inventory]);

    const showSmartTabs = activeCameras.length > 1;

    // Helper wrapper to close modal on add
    const handleAddWrapper = (item: InventoryItem) => {
        handleSmartAdd([item]);
    };


    /**
     * CORE ADD LOGIC - Intercepts for Smart Suggestions
     */
    const handleSmartAdd = (items: InventoryItem[]) => {
        // 1. Check if we have a Host Item (Camera Body)
        const hostItem = items.find(i => isCameraBody(i));

        if (hostItem) {
            // 2. Scan Catalog for Compatible Accessories
            const hostBrand = (hostItem.brand || "").toLowerCase();
            const hostModel = (hostItem.model || "").toLowerCase();
            const hostName = `${hostItem.brand} ${hostItem.model}`.toLowerCase();
            const hostSlug = (hostItem.model || hostItem.name).toLowerCase();

            const suggestions = catalog.filter(c => {
                // Skip if it is the host item itself
                if (c.id === hostItem.id) return false;

                // Only suggest relevant categories as accessories
                if (!['SUP', 'DIT', 'COM', 'FLT', 'GRP'].includes(c.category)) return false;

                // SPECIAL RULE: Filters (FLT) should only suggest ND and Polarisers 
                // because others (Promist, Glimmer, etc.) are creative choices.
                if (c.category === 'FLT') {
                    const lowName = (c.name || "").toLowerCase();
                    const isEssential = lowName.includes('nd') ||
                        lowName.includes('pola') ||
                        lowName.includes('polariz') ||
                        lowName.includes('linear');
                    if (!isEssential) return false;
                }

                try {
                    const specs = c.specs_json ? JSON.parse(c.specs_json) : {};

                    // A. Explicit Compatibility Tags
                    if (specs.compatibility && Array.isArray(specs.compatibility)) {
                        const hasMatch = specs.compatibility.some((tag: string) => {
                            const lowTag = tag.toLowerCase();
                            return hostName.includes(lowTag) ||
                                hostSlug.includes(lowTag) ||
                                lowTag === 'universal' ||
                                (hostBrand && lowTag.includes(hostBrand) && lowTag.length > 4); // avoid too short tags
                        });
                        if (hasMatch) return true;
                    }

                    // B. Brand + Subcategory Matching (e.g. Sony Media for Sony Camera)
                    if (hostBrand && c.brand && c.brand.toLowerCase() === hostBrand) {
                        const sub = (c.subcategory || "").toLowerCase();
                        if (sub.includes('media') || sub.includes('batter') || sub.includes('accessory')) {
                            return true;
                        }
                    }

                    // C. Name matching fallback for Rialto/Extension systems
                    if (hostName.includes('venice') && c.name.toLowerCase().includes('rialto')) return true;

                    // D. Universal Support Essentials (Suggested even if brand doesn't match)
                    const lowName = (c.name || "").toLowerCase();
                    const isSupport = ['SUP', 'GRP'].includes(c.category);
                    const essentialKeywords = [
                        'baseplate', 'bridge plate', 'quick release', 'dovetail',
                        'vct-14', 'top handle', 'cage', 'rod clamp', 'matte box', 'follow focus',
                        'power cable', 'd-tap', 'battery plate', 'media reader', 'viewfinder cable'
                    ];

                    if (isSupport && essentialKeywords.some(key => lowName.includes(key))) {
                        return true;
                    }

                } catch (e) { return false; }
                return false;
            });

            if (suggestions.length > 0) {
                // 3. Trigger Smart Suggestion Modal
                setSmartSuggestion({
                    isOpen: true,
                    host: hostItem,
                    suggestions: suggestions,
                    pendingItems: items
                });
                return; // Stop here, wait for user
            }
        }

        // If no smart suggestions, proceed to normal flow
        processAdd(items);
    };

    // Finalize Add (Called directly or after Modal)
    const processAdd = (itemsToAdd: InventoryItem[]) => {
        const primaryCam = cameraFilter !== 'ALL' ? cameraFilter : undefined;
        const otherCams = activeCameras.filter(c => c !== (primaryCam || 'A'));

        // Bodies are never replicated. Single items or sets go through replication if other cams exist.
        const isBody = itemsToAdd.length === 1 && isCameraBody(itemsToAdd[0]);
        if (isBody || otherCams.length === 0) {
            itemsToAdd.forEach(i => onAddItem(i, primaryCam));
            setIsCatalogOpen(false);
            return;
        }

        // Show Replication Modal - Default to first target cam if multiple exist
        setReplicationData({ items: itemsToAdd, primaryCam: primaryCam || 'A' });
        setReplicationTargets(new Set()); // Start empty
    };

    const confirmSmartSuggestion = (selectedAccessories: InventoryItem[]) => {
        const { pendingItems } = smartSuggestion;
        // Combine original items + selected accessories
        const finalBatch = [...pendingItems, ...selectedAccessories];

        setSmartSuggestion(prev => ({ ...prev, isOpen: false }));
        processAdd(finalBatch);
    };

    const confirmReplication = (shouldReplicate: boolean) => {
        if (!replicationData) return;
        const { items, primaryCam } = replicationData;

        // 1. Add to Primary
        items.forEach(i => onAddItem(i, primaryCam));

        // 2. Add to Targets
        if (shouldReplicate) {
            replicationTargets.forEach(cam => {
                items.forEach(i => onAddItem(i, cam));
            });
        }
        setReplicationData(null);
        setIsCatalogOpen(false);
    };

    // AI Search Logic
    const searchSuggestions = useMemo(() => {
        if (!searchQuery.trim()) return [];

        const matches = catalog.filter(i =>
            i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.category.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);

        if (matches.length === 0) {
            return [];
        }
        return matches;
    }, [searchQuery, catalog]);

    const handleSearchSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!searchQuery.trim()) return;

        // Check for EXACT match
        const exactMatch = searchSuggestions.find(s => s.name.toLowerCase() === searchQuery.toLowerCase());

        if (exactMatch) {
            onAddItem(exactMatch as any);
            setSearchQuery("");
        } else if (searchSuggestions.length > 0) {
            // Partial matches exist -> Do nothing, just show the list
            // User can click if they want one of those.
            return;
        } else {
            // No matches -> Autonomous AI Research (Draft Mode)
            setIsResearching(true);
            const res = await researchEquipmentDraftAction(searchQuery);
            setIsResearching(false);

            if (res.success && res.drafts) {
                setDraftItems(res.drafts);
            } else {
                alert(res.error || "Could not research this item.");
            }
        }
    };

    // Handler when user confirms AI suggestion
    const handleConfirmDraft = async () => {
        if (!draftItems) return;

        // Filter only selected items
        const selected = draftItems.filter(i => i._selected !== false);
        if (selected.length === 0) return;

        setIsResearching(true);
        // Save selected drafts
        const res = await saveDraftsToCatalogAction(selected);
        setIsResearching(false);

        if (res.success) {
            // Optimistic update
            setDraftItems(null);

            // UX IMPROVEMENT: Do NOT clear search query.
            // Instead, re-trigger search locally (or rely on UI update) so the user sees the new items.
            // setSearchQuery(""); <--- REMOVED

            // Force refresh of search results based on new catalog
            // We can hack this by toggling a dummy state or just alerting
            alert(`✅ ${res.count} ürün "Bekleme Odası"na eklendi! Yönetici onayından sonra katalogda görünecektir.`);

        } else {
            alert("Failed to save: " + res.error);
        }
    };

    // Custom Item Action
    const handleAddCustom = async () => {
        if (!customForm.model) return;

        const payload = {
            brand: customForm.brand,
            model: customForm.model,
            description: customForm.description,
            category: customForm.category,
            subcategory: customForm.subcategory
        };

        const res = await createCustomItemAction(payload);
        if (res.success && res.item) {
            // Optimistically add to inventory
            onAddItem(res.item as any, cameraFilter === 'ALL' ? 'A' : cameraFilter);
            setIsCatalogOpen(false); // Close modal
            setIsCreatingCustom(false); // Reset mode
            setCustomForm({ brand: "", model: "", description: "", category: activeTab, subcategory: SUBCATEGORY_OPTIONS[activeTab]?.[0] || 'General' }); // Reset form
            router.refresh(); // <--- Force refresh to update catalog
        } else {
            alert(res.error || "Failed to create custom item.");
        }
    };

    const handleDeleteCustom = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this custom item from the global catalog?")) return;

        const res = await deleteCustomItemAction(id);
        if (res.success) {
            alert("✅ Custom Item Deleted!");
            router.refresh(); // <--- Force refresh to remove from catalog
        } else {
            alert(res.error || "Failed to delete item");
        }
    };

    const handleToggleCam = (entry: InventoryEntry) => {
        const cams = ['A', 'B', 'C'];
        const currentIdx = cams.indexOf(entry.assignedCam);
        const nextIdx = (currentIdx + 1) % cams.length;
        onUpdateItem(entry.id, { assignedCam: cams[nextIdx] });
    };

    // Compatibility Checks
    const compatibilityWarnings = useMemo(() => {
        const warns = validateCompatibility(inventory, catalog);
        console.log('Compatibility Warnings:', warns);
        // console.log('Inventory Sample:', inventory[0]);
        // console.log('Catalog Sample:', catalog.find(c => c.id === inventory[0]?.equipmentId));
        return warns;
    }, [inventory, catalog]);

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden relative">
            {/* Top Search Removed - Moved to Add Item Modal */}
            {/* Header / Tabs */}
            <div className="bg-[var(--background)]/90 backdrop-blur border-b border-[#E5E5EA] flex-none z-10">
                <div className="flex justify-between items-center px-4 py-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold uppercase tracking-tight">Equipment</h2>
                        {onOpenAdmin && (
                            <button
                                onClick={onOpenAdmin}
                                className="p-1 hover:bg-[#F2F2F7] rounded-md transition-all text-[#C7C7CC] hover:text-[#007AFF]"
                                title="Global Catalog Admin"
                            >
                                <ShieldCheck className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Camera Filters (Smart Tabs) */}
                    {showSmartTabs && (
                        <div className="flex items-center bg-[#F2F2F7] p-0.5 rounded-lg">
                            {['ALL', ...activeCameras].map(cam => (
                                <button
                                    key={cam}
                                    onClick={() => setCameraFilter(cam as any)}
                                    className={cn(
                                        "px-2 py-0.5 text-[10px] font-bold rounded-md transition-all",
                                        cameraFilter === cam
                                            ? "bg-white shadow text-[#1A1A1A]"
                                            : "text-[#8E8E93] hover:text-[#1A1A1A] transition-colors"
                                    )}
                                >
                                    {cam === 'ALL' ? 'ALL' : `CAM ${cam}`}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Categories Scroll */}
                <div className="flex px-4 py-2 gap-6 overflow-x-auto no-scrollbar border-b border-[#F2F2F7]">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={cn(
                                "text-[11px] font-bold uppercase tracking-widest pb-2 whitespace-nowrap transition-all",
                                activeTab === cat.id ? "text-[#1A1A1A] border-b-2 border-[#1A1A1A]" : "text-[#C7C7CC]"
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Main Panel Sub-Filters (for Support & Light) */}
                {(activeTab === 'SUP' || activeTab === 'LIT') && (
                    <div className="flex px-4 py-2 gap-1.5 overflow-x-auto no-scrollbar bg-white/50 border-b border-[#F2F2F7]">
                        {(activeTab === 'SUP'
                            ? ['ALL', 'Batteries', 'Media', 'Filters', 'Matte Box', 'Focus', 'Wireless', 'Monitors', 'Support', 'Audio']
                            : ['ALL', 'LED', 'Daylight', 'Tungsten', 'Ballast', 'Modifier', 'Accessory']
                        ).map(f => (
                            <button
                                key={f}
                                onClick={() => setTechnicalFilter(f)}
                                className={cn(
                                    "px-2.5 py-1 rounded-full text-[9px] font-bold border transition-all whitespace-nowrap",
                                    technicalFilter === f
                                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                                        : "bg-white text-[#8E8E93] border-[#E5E5EA] hover:border-[#8E8E93]"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Warnings Bar */}
            {warnings.length > 0 && (
                <div className="bg-amber-50 border-b border-amber-200 p-2 px-4 flex-none">
                    {warnings.map((w, i) => (
                        <div key={i} className="text-xs font-medium text-amber-800 flex items-center">
                            ⚠️ {w}
                        </div>
                    ))}
                </div>
            )}

            {/* Main List */}
            <div className="flex-1 overflow-y-auto bg-[var(--background)] pb-20">
                {sortedInventory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center pt-32 opacity-20">
                        <div className="text-4xl mb-2">📹</div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">List is Empty</p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#E5E5EA]">
                        {displayInventory.map((itemValue) => {
                            if (itemValue.type === 'group') {
                                const { brand, series, entries, assignedCam } = itemValue;
                                const sampleItem = catalog.find(i => i.id === entries[0].equipmentId);
                                const primaryAperture = sampleItem?.aperture || sampleItem?.name.match(/[TF]\d+(\.\d+)?/i)?.[0] || '';

                                return (
                                    <div key={`${assignedCam}-${brand}-${series}`} className="group flex flex-col py-3 px-4 hover:bg-[#F9F9F9] bg-white border-b border-[#F2F2F7]">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleToggleCam(entries[0]); }}
                                                    className={cn(
                                                        "w-6 h-6 flex items-center justify-center rounded-[6px] text-xs font-bold shrink-0 text-white shadow-sm hover:scale-110 active:scale-95 transition-all",
                                                        getCameraColor(assignedCam)
                                                    )}
                                                    title="Click to toggle Camera (A/B/C)"
                                                >
                                                    {assignedCam}
                                                </button>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[14px] font-semibold leading-tight text-[#1C1C1E]">
                                                        {brand} {series} {primaryAperture}
                                                    </span>
                                                    <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1.5">
                                                        {entries.map(entry => {
                                                            const i = catalog.find(catI => catI.id === entry.equipmentId);
                                                            if (!i) return null;
                                                            const mm = i.name.match(/\d+mm/i)?.[0];
                                                            const ap = i.aperture || i.name.match(/[TF]\d+(\.\d+)?/i)?.[0];
                                                            const isDiff = ap && ap !== primaryAperture;
                                                            const masterIdx = inventory.findIndex(inv => inv.id === entry.id);
                                                            const itemWarnings = compatibilityWarnings.filter(w => w.itemId === entry.id && !dismissedWarnings.has(w.itemId + w.type));
                                                            const hasWarning = itemWarnings.length > 0;

                                                            return (
                                                                <WarningTooltip key={entry.id} warnings={itemWarnings}>
                                                                    <div className={cn(
                                                                        "flex items-center gap-1 group/badge px-2 py-0.5 rounded-md transition-all border cursor-help",
                                                                        hasWarning ? "bg-red-50 border-red-200" : "bg-[#F2F2F7] hover:bg-[#E5E5EA] border-transparent hover:border-[#D1D1D6] cursor-pointer"
                                                                    )}>
                                                                        {hasWarning && <AlertTriangle className="w-3 h-3 text-red-600 animate-pulse" />}
                                                                        <span className={cn(
                                                                            "text-[10px] font-bold",
                                                                            hasWarning ? "text-red-700" : "text-[#1C1C1E]"
                                                                        )}>
                                                                            {mm}{isDiff ? ` (${ap})` : ''}
                                                                            {entry.quantity > 1 && <span className="ml-1 text-[#007AFF]">x{entry.quantity}</span>}
                                                                        </span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                onQtyChange(masterIdx, -entry.quantity);
                                                                            }}
                                                                            className={cn(
                                                                                "transition-colors ml-0.5",
                                                                                hasWarning ? "text-red-400 hover:text-red-700" : "text-[#8E8E93] hover:text-red-500"
                                                                            )}
                                                                            title="Remove from set"
                                                                        >
                                                                            <X className="w-2.5 h-2.5" />
                                                                        </button>
                                                                    </div>
                                                                </WarningTooltip>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            const { entry } = itemValue;
                            const item = catalog.find(i => i.id === entry.equipmentId);
                            if (!item) return null;
                            const masterIdx = inventory.findIndex(i => i.id === entry.id);

                            return (
                                <div key={entry.id} className="group">
                                    <div className="flex items-center py-3 px-4 hover:bg-[#F9F9F9] bg-white border-b border-[#F2F2F7] gap-4">
                                        <div className="flex-1 flex items-center gap-4 overflow-hidden">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleToggleCam(entry); }}
                                                className={cn(
                                                    "w-6 h-6 flex items-center justify-center rounded-[6px] text-xs font-bold shrink-0 text-white shadow-sm hover:scale-110 active:scale-95 transition-all",
                                                    getCameraColor(entry.assignedCam)
                                                )}
                                                title="Click to toggle Camera (A/B/C)"
                                            >
                                                {entry.assignedCam}
                                            </button>
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-2 overflow-hidden mr-1">
                                                    <span className="text-[14px] font-semibold leading-tight text-[#1C1C1E]">
                                                        {item.name}
                                                    </span>
                                                    {item.isAiResearched && (
                                                        <div className="p-0.5 bg-blue-50 rounded" title="AI Researched">
                                                            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                                                        </div>
                                                    )}

                                                    {/* Inline Warning Indicator */}
                                                    {(() => {
                                                        const hasWarnings = compatibilityWarnings.some(w => w.itemId === entry.id);
                                                        if (hasWarnings) {
                                                            return (
                                                                <div className="flex items-center gap-1 animate-pulse" title="Compatibility Issues Detected">
                                                                    <AlertTriangle className="w-4 h-4 text-red-600 fill-red-100" />
                                                                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-tight hidden sm:inline-block">Incompatible</span>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })()}
                                                </div>
                                                {/* Lens Specs: Diameter, Weight & Smart Info */}
                                                {(() => {
                                                    const specs = item.specs_json ? JSON.parse(item.specs_json) : {};
                                                    return (
                                                        <div className="flex flex-col mt-0.5">
                                                            <div className="flex items-center gap-2 text-[9px] text-[#8E8E93] font-medium">
                                                                {item.category === 'LNS' && (
                                                                    <>
                                                                        {(specs.t_stop_range || item.aperture) && (
                                                                            <span className="text-[#1A1A1A] font-bold">{specs.t_stop_range || item.aperture}</span>
                                                                        )}
                                                                        {item.front_diameter_mm && <span>⌀ {item.front_diameter_mm}mm</span>}
                                                                        {specs.close_focus_m && <span>• CF {specs.close_focus_m}m</span>}
                                                                        {item.weight_kg && <span>• {item.weight_kg}kg</span>}
                                                                    </>
                                                                )}
                                                                {item.category === 'CAM' && (
                                                                    <>
                                                                        {(specs.dynamic_range || item.dynamic_range) && (
                                                                            <span className="text-orange-600 font-bold">{specs.dynamic_range || item.dynamic_range}</span>
                                                                        )}
                                                                        {(specs.native_iso || item.native_iso) && (
                                                                            <span className="text-[#1A1A1A] font-bold">ISO {specs.native_iso || item.native_iso}</span>
                                                                        )}
                                                                        {(item as any).resolution && <span>• {(item as any).resolution}</span>}
                                                                        {item.weight_kg && <span>• {item.weight_kg}kg</span>}
                                                                    </>
                                                                )}
                                                            </div>
                                                            {/* Smart Crop Factor Info */}
                                                            {item.category === 'LNS' && (() => {
                                                                const camEntry = inventory.find(i => i.assignedCam === entry.assignedCam && catalog.find(c => c.id === i.equipmentId)?.category === 'CAM');
                                                                const camItem = camEntry ? catalog.find(c => c.id === camEntry.equipmentId) : null;

                                                                if (camItem && item.focal_length) {
                                                                    const cf = getCropFactor(camItem.sensor_type || camItem.subcategory || '');
                                                                    if (cf > 1.1) {
                                                                        const mmStr = item.focal_length.replace(/\D/g, '');
                                                                        const mm = parseInt(mmStr);
                                                                        if (!isNaN(mm)) {
                                                                            return (
                                                                                <div className="text-[9px] text-[#007AFF] font-bold bg-blue-50/80 border border-blue-100 px-1.5 py-0.5 rounded mt-1 w-fit select-none" title={`Sensor: ${camItem.sensor_type} (${cf}x)`}>
                                                                                    ⚡ {(mm * cf).toFixed(0)}mm Equiv. <span className="opacity-70 font-normal">({cf}x Crop)</span>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    }
                                                                }
                                                                return null;
                                                            })()}
                                                        </div>
                                                    );
                                                })()}

                                                <div className="flex flex-col w-full mt-0.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-[#8E8E93] uppercase font-bold tracking-wider">
                                                            {item.subcategory || item.category}
                                                        </span>
                                                        {/* Mount Info */}
                                                        {item.mount && (
                                                            <span className="text-[9px] text-[#8E8E93] border border-[#E5E5EA] px-1 rounded bg-white">
                                                                {item.mount}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Compatibility Warnings (Redesigned with Dismiss) */}
                                                    {(() => {
                                                        // Filter out dismissed warnings
                                                        const itemWarnings = compatibilityWarnings.filter(w => w.itemId === entry.id);
                                                        const activeWarnings = itemWarnings.filter(w => !dismissedWarnings.has(w.itemId + w.type));

                                                        if (itemWarnings.length > 0 && activeWarnings.length === 0) {
                                                            // Show minimized 'Ignored' state
                                                            return (
                                                                <button
                                                                    onClick={() => {
                                                                        const next = new Set(dismissedWarnings);
                                                                        itemWarnings.forEach(w => next.delete(w.itemId + w.type));
                                                                        setDismissedWarnings(next);
                                                                    }}
                                                                    className="mt-1 w-full text-[9px] text-gray-400 flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors group"
                                                                >
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-amber-400 transition-colors" />
                                                                    <span className="italic">Warnings ignored (Click to show)</span>
                                                                </button>
                                                            );
                                                        }

                                                        if (activeWarnings.length === 0) return null;

                                                        return (
                                                            <div className="w-full mt-2 flex flex-col gap-2 pr-1">
                                                                {activeWarnings.map((w, idx) => (
                                                                    <div key={idx} className={cn(
                                                                        "p-2 rounded-md border flex flex-col gap-1.5 shadow-sm animate-in fade-in slide-in-from-top-1 relative group",
                                                                        w.type === 'MOUNT' || w.type === 'MEDIA' || w.type === 'POWER' ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
                                                                    )}>
                                                                        {/* Dismiss Button */}
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                const next = new Set(dismissedWarnings);
                                                                                next.add(w.itemId + w.type);
                                                                                setDismissedWarnings(next);
                                                                            }}
                                                                            className="absolute top-1 right-1 p-1 text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                            title="Ignore this warning"
                                                                        >
                                                                            <X className="w-3 h-3" />
                                                                        </button>

                                                                        {/* Header */}
                                                                        <div className="flex items-start gap-2">
                                                                            <div className={cn(
                                                                                "p-1 rounded-full shrink-0 mt-0.5",
                                                                                w.type === 'MOUNT' || w.type === 'MEDIA' || w.type === 'POWER' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                                                                            )}>
                                                                                <AlertTriangle className="w-3.5 h-3.5" />
                                                                            </div>
                                                                            <div className="flex flex-col pr-4">
                                                                                <span className={cn(
                                                                                    "text-[11px] font-bold uppercase tracking-wide",
                                                                                    w.type === 'MOUNT' || w.type === 'MEDIA' || w.type === 'POWER' ? "text-red-800" : "text-amber-800"
                                                                                )}>
                                                                                    {w.type === 'MOUNT' ? 'Mount Mismatch' :
                                                                                        w.type === 'MEDIA' ? 'Media Warning' :
                                                                                            w.type === 'POWER' ? 'Power Warning' :
                                                                                                w.type === 'DEPENDENCY' ? 'Required Accessory' : 'Technical Warning'}
                                                                                </span>
                                                                                <span className={cn(
                                                                                    "text-[11px] font-medium leading-snug",
                                                                                    w.type === 'MOUNT' || w.type === 'MEDIA' || w.type === 'POWER' ? "text-red-700" : "text-amber-700"
                                                                                )}>
                                                                                    {w.message.split('\n')[0]}
                                                                                </span>
                                                                            </div>
                                                                        </div>

                                                                        {/* Solution / Adapter Suggestion */}
                                                                        {(w.solution || (w.suggestedAdapters && w.suggestedAdapters.length > 0)) ? (
                                                                            <div className="ml-8 text-[11px] bg-white/60 rounded px-2 py-1.5 border border-black/5 flex flex-col gap-1.5">
                                                                                {w.solution && (
                                                                                    <div className="text-amber-900 font-medium whitespace-pre-wrap">
                                                                                        {w.solution}
                                                                                    </div>
                                                                                )}
                                                                                {w.suggestedAdapters && w.suggestedAdapters.length > 0 && (
                                                                                    <div>
                                                                                        <span className="font-bold text-blue-700 block mb-0.5">Recommended Solution:</span>
                                                                                        <div className="flex items-center gap-1.5 text-blue-900">
                                                                                            <span className="text-lg">↳</span>
                                                                                            <span>Add </span>
                                                                                            <span className="font-bold underline decoration-blue-300 decoration-2 underline-offset-2">
                                                                                                {w.suggestedAdapters.map(a => a.name).join(' or ')}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="ml-8 text-[10px] opacity-70 italic">
                                                                                Check technical specifications for compatibility.
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {/* Action Pills */}
                                            <div className="flex items-center bg-[#F2F2F7] rounded-[10px] p-0.5 h-8">
                                                <button
                                                    onClick={() => onQtyChange(masterIdx, -1)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-white hover:shadow-sm transition-all text-[#1C1C1E] disabled:opacity-30"
                                                    disabled={entry.quantity <= 1}
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="w-8 text-center text-[13px] font-bold text-[#1C1C1E] tabular-nums">
                                                    {entry.quantity}
                                                </span>
                                                <button
                                                    onClick={() => onQtyChange(masterIdx, 1)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-white hover:shadow-sm transition-all text-[#1C1C1E]"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => onQtyChange(masterIdx, -entry.quantity)}
                                                className="p-2 hover:bg-red-50 rounded-full transition-all text-[#C7C7CC] hover:text-red-500"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    {/* Camera Accessories */}
                                    {item.category === 'CAM' && (() => {
                                        const accessories = getCompatibleAccessories(item.id);
                                        if (accessories.length === 0) return null;

                                        return (
                                            <div className="ml-14 mt-1 mb-2 flex flex-wrap gap-1.5 bg-white px-4 pb-2">
                                                {accessories.map(acc => {
                                                    // Check if this accessory is already added to this specific camera
                                                    const existingConfirmed = inventory.find(i => i.equipmentId === acc.id && i.assignedCam === entry.assignedCam);
                                                    // Also check by name as fallback for local items if IDs don't match perfectly
                                                    const existing = existingConfirmed || inventory.find(i => i.assignedCam === entry.assignedCam && catalog.find(c => c.id === i.equipmentId)?.name === acc.name);

                                                    const isAdded = !!existing;
                                                    const isMultiQty = ['Media', 'Batteries'].includes(acc.subcategory || '');

                                                    return (
                                                        <button
                                                            key={acc.id}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (isMultiQty && isAdded) {
                                                                    // Increment quantity
                                                                    const idx = inventory.findIndex(i => i === existing);
                                                                    if (idx !== -1) {
                                                                        onQtyChange(idx, 1);
                                                                    }
                                                                } else if (isAdded) {
                                                                    // Toggle Off (Remove) for single items
                                                                    const idx = inventory.findIndex(i => i === existing);
                                                                    if (idx !== -1) {
                                                                        onQtyChange(idx, -existing!.quantity);
                                                                    }
                                                                } else {
                                                                    // Add item
                                                                    const accItem = catalog.find(c => c.id === acc.id) || acc as any;
                                                                    onAddItem(accItem, entry.assignedCam);
                                                                }
                                                            }}
                                                            onContextMenu={(e) => {
                                                                if (!isMultiQty) return;
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                if (isAdded) {
                                                                    // Decrement quantity
                                                                    const idx = inventory.findIndex(i => i === existing);
                                                                    if (idx !== -1) {
                                                                        onQtyChange(idx, -1);
                                                                    }
                                                                }
                                                            }}
                                                            className={cn(
                                                                "px-2 py-0.5 text-[8px] font-semibold rounded border transition-all flex items-center gap-1 select-none",
                                                                isAdded
                                                                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                                                                    : "bg-[#F2F2F7] text-[#8E8E93] border-transparent hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                                            )}
                                                            title={isMultiQty ? "Click: +1 | Right-Click: -1" : acc.description}
                                                        >
                                                            {isAdded ? <Check className="w-2 h-2" /> : <Plus className="w-2 h-2" />}
                                                            {acc.name}
                                                            {isAdded && existing!.quantity > 1 && (
                                                                <span className="ml-1 opacity-80 font-bold bg-black/20 px-1 rounded">x{existing!.quantity}</span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })()}
                                </div>
                            );
                        })}
                    </div >
                )}

                {/* Professional Advice Section (Pro Tips) */}
                {proTips.length > 0 && (
                    <div className="mx-3 mt-4 space-y-2">
                        <button
                            onClick={() => setIsProTipsOpen(!isProTipsOpen)}
                            className="flex items-center gap-2 px-1 w-full group cursor-pointer"
                            title={isProTipsOpen ? "Collapse Advice" : "Expand Professional Advice"}
                        >
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center transition-all shadow-sm",
                                isProTipsOpen ? "bg-amber-100 text-amber-600" : "bg-white text-amber-500 hover:scale-110"
                            )}>
                                <Lightbulb className={cn("w-3.5 h-3.5", !isProTipsOpen && "animate-pulse")} />
                            </div>
                            <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider group-hover:text-amber-600 transition-colors">
                                Professional Advice
                            </span>
                            <div className="ml-auto">
                                <ChevronDown className={cn(
                                    "w-3.5 h-3.5 text-[#C7C7CC] transition-transform duration-300",
                                    isProTipsOpen && "rotate-180"
                                )} />
                            </div>
                        </button>

                        {isProTipsOpen && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                {proTips.map((tip, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3 rounded-xl bg-[#FDFCFB] border border-[#F2EDE4] shadow-sm"
                                    >
                                        <div className="flex gap-3">
                                            <div className="shrink-0 w-0.5 self-stretch bg-amber-400/30 rounded-full my-1 ml-0.5"></div>
                                            <p className="text-[12px] leading-relaxed text-[#5D5D5B] font-medium italic">
                                                {tip}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={() => setIsCatalogOpen(true)}
                    className="mx-3 mt-4 w-[calc(100%-24px)] py-3 border border-dashed border-[#C6C6C8] rounded-lg text-[#8E8E93] text-[10px] font-bold uppercase hover:bg-[#F2F2F7] transition-all mb-8"
                >
                    + Add Item
                </button>
            </div >

            {/* Catalog Modal (Ported) */}
            {
                isCatalogOpen && (
                    <div className="absolute inset-0 z-50 flex items-end justify-center bg-[#1A1A1A]/30 backdrop-blur-[2px] animate-in fade-in">
                        <div className="bg-[var(--background)] w-full h-[99%] rounded-t-[24px] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
                            <div className="sticky top-0 z-20 bg-[var(--background)] border-b border-[#E5E5EA]">
                                <div className="flex justify-between items-center p-3">
                                    <h2 className="font-bold text-sm text-[#1C1C1E]">Add Equipment</h2>
                                    <button onClick={() => setIsCatalogOpen(false)} className="w-7 h-7 flex items-center justify-center bg-[#E5E5EA] rounded-full text-gray-500 font-bold text-sm hover:bg-[#8E8E93] hover:text-white transition-colors">×</button>
                                </div>
                                {/* In-Modal Search */}
                                <div className="px-3 pb-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8E8E93]" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder={`Search ${CATEGORIES.find(c => c.id === activeTab)?.name || 'Catalog'}...`}
                                            className="w-full bg-[#F2F2F7] border-none rounded-xl py-2 pl-9 pr-4 text-base md:text-xs font-bold focus:ring-1 focus:ring-[#007AFF] placeholder-[#8E8E93]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sub-Filters - Dynamic based on category */}
                            <div className="flex flex-col gap-2 px-4 py-2 bg-[#F9F9F9]/50 border-b border-[#E5E5EA]">
                                {/* CAMERA FILTERS: S35, FF, LF */}
                                {activeTab === 'CAM' && (
                                    <div className="flex gap-2">
                                        {['ALL', 'S35', 'FF', 'LF'].map(f => (
                                            <button
                                                key={f}
                                                onClick={() => setTechnicalFilter(f)}
                                                className={cn(
                                                    "px-2 py-1 rounded-full text-[9px] font-bold border transition-all",
                                                    technicalFilter === f
                                                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                                                        : "bg-white text-[#8E8E93] border-[#E5E5EA] hover:border-[#8E8E93]"
                                                )}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* LENS FILTERS: Type + Coverage */}
                                {activeTab === 'LNS' && (
                                    <>
                                        <div className="flex gap-2 items-center">
                                            <span className="text-[8px] font-bold text-[#8E8E93] uppercase">Type:</span>
                                            {['ALL', 'Anamorphic', 'Spherical', 'Zoom', 'Vintage', 'Generic'].map(f => (
                                                <button
                                                    key={f}
                                                    onClick={() => setLensTypeFilter(f as any)}
                                                    className={cn(
                                                        "px-2 py-1 rounded-full text-[9px] font-bold border transition-all",
                                                        lensTypeFilter === f
                                                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                                                            : "bg-white text-[#8E8E93] border-[#E5E5EA] hover:border-[#8E8E93]"
                                                    )}
                                                >
                                                    {f}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <span className="text-[8px] font-bold text-[#8E8E93] uppercase">Coverage:</span>
                                            {['ALL', 'S35', 'FF', 'LF'].map(f => (
                                                <button
                                                    key={f}
                                                    onClick={() => setLensCoverageFilter(f as any)}
                                                    className={cn(
                                                        "px-2 py-1 rounded-full text-[9px] font-bold border transition-all",
                                                        lensCoverageFilter === f
                                                            ? "bg-black text-white border-black"
                                                            : "bg-white text-[#8E8E93] border-[#E5E5EA] hover:border-[#8E8E93]"
                                                    )}
                                                >
                                                    {f}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* SUPPORT FILTERS: Subcategories */}
                                {activeTab === 'SUP' && (
                                    <div className="flex gap-1 flex-wrap">
                                        {['ALL', 'Batteries', 'Media', 'Filters', 'Matte Box', 'Focus', 'Wireless', 'Monitors', 'Support', 'Audio', 'Generic'].map(f => (
                                            <button
                                                key={f}
                                                onClick={() => setTechnicalFilter(f)}
                                                className={cn(
                                                    "px-2 py-1 rounded-full text-[9px] font-bold border transition-all",
                                                    technicalFilter === f
                                                        ? "bg-black text-white border-black"
                                                        : "bg-white text-[#8E8E93] border-[#E5E5EA] hover:border-[#8E8E93]"
                                                )}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* LIGHT FILTERS: Subcategories */}
                                {activeTab === 'LIT' && (
                                    <div className="flex gap-1 flex-wrap">
                                        {['ALL', 'LED', 'Daylight', 'Tungsten', 'HMI', 'Tube', 'Panel', 'Modifier', 'Stand', 'Grip', 'Control', 'Generic'].map(f => (
                                            <button
                                                key={f}
                                                onClick={() => setTechnicalFilter(f)}
                                                className={cn(
                                                    "px-2 py-1 rounded-full text-[9px] font-bold border transition-all",
                                                    technicalFilter === f
                                                        ? "bg-black text-white border-black"
                                                        : "bg-white text-[#8E8E93] border-[#E5E5EA] hover:border-[#8E8E93]"
                                                )}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto p-2 space-y-4">
                                {/* Explicit AI Research Trigger if search is active */}
                                {searchQuery.trim().length > 1 && (
                                    <button
                                        onClick={async () => {
                                            setIsResearching(true);
                                            const res = await researchEquipmentDraftAction(searchQuery);
                                            setIsResearching(false);
                                            if (res.success && res.drafts) setDraftItems(res.drafts);
                                            else alert(res.error || "Could not research this item.");
                                        }}
                                        className="w-full flex items-center p-3 mb-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg active:scale-[0.99] transition-all text-left group border border-blue-100/50 hover:border-blue-200 shadow-sm"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-xs text-blue-900">"{searchQuery}" Not in Catalog?</div>
                                            <div className="text-[9px] text-blue-500/80 font-medium">Use AI to find and add it</div>
                                        </div>
                                        {isResearching ? (
                                            <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <div className="text-white bg-blue-600 px-3 py-1 rounded text-[10px] font-bold shadow">Auto-Add</div>
                                        )}
                                    </button>
                                )}

                                {CATEGORIES.filter(cat => cat.id === activeTab).map(cat => {
                                    // 1. Filter Items
                                    const filteredItems = catalog.filter(i => {
                                        // Base filters
                                        if (i.category !== cat.id) return false;
                                        if (i.parentId) return false;

                                        // SEARCH FILTER
                                        if (searchQuery.trim() && !i.name.toLowerCase().includes(searchQuery.toLowerCase()) && !i.brand?.toLowerCase().includes(searchQuery.toLowerCase())) {
                                            return false;
                                        }

                                        if (i.subcategory === 'Extension' || i.subcategory === 'Extension Cable') return false;

                                        // CAMERA FILTERS: by sensor size
                                        if (activeTab === 'CAM' && technicalFilter !== 'ALL') {
                                            return i.sensor_size === technicalFilter;
                                        }

                                        // LENS FILTERS: by type and coverage
                                        if (activeTab === 'LNS') {
                                            if (lensTypeFilter === 'Vintage') {
                                                const vCheck = i.subcategory === 'Vintage' ||
                                                    i.name.includes('K35') ||
                                                    i.name.includes('Baltar') ||
                                                    i.name.includes('Panchro') ||
                                                    i.name.includes('Kowa') ||
                                                    i.name.includes('Tribe7') ||
                                                    i.name.includes('Vintage');
                                                if (!vCheck) return false;
                                            } else if (lensTypeFilter !== 'ALL' && i.subcategory !== lensTypeFilter) {
                                                return false;
                                            }
                                            if (lensCoverageFilter !== 'ALL' && (i as any).coverage !== lensCoverageFilter) return false;
                                        }

                                        // SUPPORT & LIGHT FILTERS: by subcategory
                                        if ((activeTab === 'SUP' || activeTab === 'LIT') && technicalFilter !== 'ALL') {
                                            const sub = i.subcategory || '';
                                            if (technicalFilter === 'Filters') return sub.includes('Filter');
                                            if (technicalFilter === 'Batteries') return sub.includes('Batter');
                                            if (technicalFilter === 'Media') return sub.includes('Media') || sub.includes('Card');
                                            if (technicalFilter === 'Matte Box') return sub.toLowerCase().includes('matte');
                                            if (technicalFilter === 'Focus') return sub.includes('Focus') || sub.includes('FIZ');
                                            if (technicalFilter === 'Wireless') return sub.includes('Wireless') || sub.includes('Transmitter');
                                            if (technicalFilter === 'Support') return ['Head', 'Handheld', 'Vest', 'Rods', 'Tripod', 'Gimbal', 'Dolly', 'Slider', 'Fluid Head', 'Tripod Legs'].includes(sub);
                                            if (technicalFilter === 'Audio') return sub.includes('Microphone') || sub.includes('Recorder');
                                            if (technicalFilter === 'Generic') return sub === 'Generic';
                                            return sub === technicalFilter;
                                        }

                                        return true;
                                    }).sort((a, b) => {
                                        // Primary: Brand (A-Z)
                                        const brandA = a.brand?.toLowerCase() || '';
                                        const brandB = b.brand?.toLowerCase() || '';
                                        if (brandA < brandB) return -1;
                                        if (brandA > brandB) return 1;

                                        // Secondary: Model/Name (A-Z)
                                        const modelA = a.model?.toLowerCase() || a.name.toLowerCase();
                                        const modelB = b.model?.toLowerCase() || b.name.toLowerCase();
                                        if (modelA < modelB) return -1;
                                        if (modelA > modelB) return 1;
                                        return 0;
                                    });

                                    // 2. Group Items (InventoryItem[])
                                    const groupedItems: { [key: string]: typeof filteredItems } = {};
                                    const standaloneItems: typeof filteredItems = [];

                                    // Helper to extract series name for grouping
                                    const getSeriesName = (i: InventoryItem) => {
                                        if (i.category !== 'LNS') return i.model || i.name;
                                        // Remove 'mm', 'T2.x', numbers
                                        // ex: "Canon CN-E 50mm T1.3" -> "Canon CN-E"
                                        let name = i.name;
                                        // If brand is in name, keep it, otherwise prepend it for safety
                                        if (i.brand && !name.toLowerCase().includes(i.brand.toLowerCase())) {
                                            name = `${i.brand} ${name}`;
                                        }

                                        // Heuristic regex cleaning
                                        return name
                                            .replace(/\s\d+mm/gi, '') // Remove 50mm
                                            .replace(/\sT\d+(\.\d+)?/gi, '') // Remove T1.3
                                            .replace(/\sF\d+(\.\d+)?/gi, '') // Remove F2.8
                                            .replace(/\s\d+\.?\d*"/gi, '') // Remove 1/4" etc
                                            .trim();
                                    };

                                    if (activeTab === 'LNS' || (activeTab === 'SUP' && technicalFilter === 'Filters')) {
                                        filteredItems.forEach(item => {
                                            // Look up catalog item for isPrivate check
                                            // In project list, item has equipmentId. In catalog list, item IS the equipment item.
                                            // We need to support both contexts or ensure we know where we are.
                                            // This loop is for CATALOG MODAL? No.
                                            // WAIT - Lines 1022+ is the CATALOG MODAL loop!! 
                                            // Lines 1113+ is for "Group Logic" inside the modal?
                                            // Ah, looking at context in previous view_file (1139+ is Custom Toggle)
                                            // Let's check where the Rendering happens.
                                            // Lines 1200+ is rendering.

                                            // Let's assume item IS InventoryItem here as it comes from catalog.filter
                                            const isPrivate = item.isPrivate;

                                            // Don't group custom items - show them standalone so they can be deleted
                                            if (isPrivate) {
                                                standaloneItems.push(item);
                                                return;
                                            }

                                            // Use fuzzy series name for key
                                            const seriesName = getSeriesName(item);
                                            const brand = item.brand || 'Generic';

                                            // Group key: Brand + Series (normalized)
                                            const key = `${brand}-${seriesName}`;

                                            if (!groupedItems[key]) groupedItems[key] = [];
                                            groupedItems[key].push(item);
                                        });
                                    } else {
                                        standaloneItems.push(...filteredItems);
                                    }

                                    return (
                                        <div key={cat.id}>
                                            <h3 className="text-[10px] font-bold uppercase text-[#8E8E93] mb-2 px-2 sticky top-0 bg-[#F2F2F7] py-1 z-10 w-full flex justify-between items-center">
                                                <span>{cat.name} OPTIONS</span>
                                                {/* CUSTOM ITEM TOGGLE */}
                                                <button
                                                    onClick={() => setIsCreatingCustom(!isCreatingCustom)}
                                                    className="text-[#007AFF] text-[9px] font-bold hover:underline"
                                                >
                                                    {isCreatingCustom ? 'Cancel Custom' : '+ Add Custom'}
                                                </button>
                                            </h3>

                                            {isCreatingCustom ? (
                                                <div className="p-4 space-y-4 bg-gray-50 rounded-xl m-2 border border-blue-200 shadow-sm animate-in zoom-in-95 duration-200">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h3 className="font-bold text-sm text-gray-900">Create Custom Item</h3>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Category</label>
                                                                <select
                                                                    className="w-full text-xs font-bold text-gray-800 bg-white px-2 py-2 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                    value={customForm.category}
                                                                    onChange={(e) => {
                                                                        const newCat = e.target.value;
                                                                        setCustomForm({
                                                                            ...customForm,
                                                                            category: newCat,
                                                                            subcategory: 'Generic' // Strictly Generic
                                                                        });
                                                                    }}
                                                                >
                                                                    {CATEGORIES.map(c => (
                                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Subcategory</label>
                                                                <select
                                                                    className="w-full text-xs font-bold text-gray-400 bg-gray-100 px-2 py-2 rounded border border-gray-200 cursor-not-allowed"
                                                                    value="Generic"
                                                                    disabled
                                                                >
                                                                    <option value="Generic">Generic</option>
                                                                    {customForm.category && SUBCATEGORY_OPTIONS[customForm.category] ? (
                                                                        SUBCATEGORY_OPTIONS[customForm.category].map(sub => (
                                                                            <option key={sub} value={sub}>{sub}</option>
                                                                        ))
                                                                    ) : (
                                                                        <option value="General">General</option>
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Brand</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Generic"
                                                                    className="w-full text-xs font-medium px-3 py-2 rounded bg-white border border-gray-200 focus:ring-1 focus:ring-blue-500 outline-none"
                                                                    value={customForm.brand}
                                                                    onChange={(e) => setCustomForm({ ...customForm, brand: e.target.value })}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Model / Name</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="My Custom Item"
                                                                    className="w-full text-xs font-medium px-3 py-2 rounded bg-white border border-gray-200 focus:ring-1 focus:ring-blue-500 outline-none"
                                                                    value={customForm.model}
                                                                    onChange={(e) => setCustomForm({ ...customForm, model: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Description (Optional)</label>
                                                            <textarea
                                                                className="w-full text-xs font-medium px-3 py-2 rounded bg-white border border-gray-200 focus:ring-1 focus:ring-blue-500 outline-none h-20 resize-none"
                                                                placeholder="Extra details..."
                                                                value={customForm.description}
                                                                onChange={(e) => setCustomForm({ ...customForm, description: e.target.value })}
                                                            />
                                                        </div>

                                                        <button
                                                            className="w-full py-3 bg-black text-white font-bold text-xs rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                            onClick={handleAddCustom}
                                                            disabled={!customForm.model.trim()}
                                                        >
                                                            Create & Add to Project
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {Object.entries(groupedItems).map(([key, items]) => {
                                                        const seriesName = getSeriesName(items[0]);

                                                        if (items.length === 1) {
                                                            // Single item - Render simple row
                                                            return (
                                                                <button
                                                                    key={items[0].id}
                                                                    onClick={() => handleAddWrapper(items[0])}
                                                                    className="w-full flex items-center p-3 bg-white rounded-lg active:scale-[0.99] transition-all text-left group hover:shadow-sm border border-transparent hover:border-blue-100"
                                                                >
                                                                    <div className="flex-1">
                                                                        <div className="font-bold text-xs text-[#1C1C1E]">
                                                                            {items[0].isPrivate && <span className="text-[9px] bg-gray-100 text-gray-500 px-1 rounded mr-1">CUSTOM</span>}
                                                                            {items[0].name}
                                                                        </div>
                                                                        {/* Lens Specs */}
                                                                        {items[0].category === 'LNS' && (items[0].front_diameter_mm || items[0].weight_kg) && (
                                                                            <div className="flex items-center gap-2 text-[8px] text-[#8E8E93] font-medium mt-0.5">
                                                                                {items[0].front_diameter_mm && (
                                                                                    <span>⌀ {items[0].front_diameter_mm}mm</span>
                                                                                )}
                                                                                {items[0].weight_kg && (
                                                                                    <span>• {items[0].weight_kg}kg</span>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                        <div className="text-[9px] text-[#C7C7CC] group-hover:text-[#8E8E93]">
                                                                            {items[0].subcategory || 'General'}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        {items[0].isPrivate && (
                                                                            <div
                                                                                onClick={(e) => handleDeleteCustom(items[0].id, e)}
                                                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors z-10"
                                                                                title="Delete Custom Item"
                                                                            >
                                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                            </div>
                                                                        )}
                                                                        <div className="text-[#007AFF] text-lg font-light flex items-center justify-center h-6 w-6 rounded-full bg-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-colors">+</div>
                                                                    </div>
                                                                </button>
                                                            )
                                                        }
                                                        // Group Card
                                                        return (
                                                            <div key={key} className="space-y-1">
                                                                <LensGroupCard
                                                                    groupName={seriesName}
                                                                    brand={items[0].brand || ''}
                                                                    items={items}
                                                                    onAddItems={handleSmartAdd}
                                                                />
                                                            </div>
                                                        );
                                                    })}

                                                    {standaloneItems.map(item => {
                                                        const isPrivate = item.isPrivate; // No need for lookup here in catalog modal

                                                        return (
                                                            <button
                                                                key={item.id}
                                                                onClick={() => handleAddWrapper(item)}
                                                                className="w-full flex items-center p-3 bg-white rounded-lg active:scale-[0.99] transition-all text-left group hover:shadow-sm border border-transparent hover:border-blue-100"
                                                            >
                                                                <div className="flex-1">
                                                                    <div className="font-bold text-xs text-[#1C1C1E]">
                                                                        {isPrivate && <span className="text-[9px] bg-gray-100 text-gray-500 px-1 rounded mr-1">CUSTOM</span>}
                                                                        {item.name}
                                                                    </div>
                                                                    <div className="text-[9px] text-[#C7C7CC] group-hover:text-[#8E8E93]">
                                                                        {item.subcategory || 'General'}
                                                                        {activeTab === 'LNS' && (item as any).coverage && ` • ${(item as any).coverage}`}
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    {isPrivate && (
                                                                        <div
                                                                            onClick={(e) => handleDeleteCustom(item.id, e)}
                                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors z-10"
                                                                            title="Delete Custom Item"
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </div>
                                                                    )}
                                                                    <div className="text-[#007AFF] text-lg font-light flex items-center justify-center h-6 w-6 rounded-full bg-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-colors">+</div>
                                                                </div>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* REPLICATION MODAL (Inside Add Item Context) */}
                            {replicationData && (
                                <div className="absolute inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
                                    <div className="bg-white w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden flex flex-col p-6 animate-in zoom-in-95 duration-200">
                                        <div className="text-left mb-6">
                                            <h3 className="text-xl font-bold text-[#1C1C1E] mb-1">Smart Assignment</h3>
                                            <p className="text-[11px] text-[#8E8E93] font-medium leading-relaxed">
                                                Adding <span className="text-[#1C1C1E] font-bold">
                                                    {replicationData.items.length === 1 ? replicationData.items[0].name : `${replicationData.items.length} items`}
                                                </span>. Also add to:
                                            </p>
                                        </div>

                                        <div className="space-y-3 mb-8">
                                            {activeCameras.filter(c => c !== replicationData.primaryCam).map(cam => {
                                                const isSelected = replicationTargets.has(cam);
                                                return (
                                                    <label
                                                        key={cam}
                                                        className={cn(
                                                            "flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2",
                                                            isSelected
                                                                ? "bg-[#007AFF]/5 border-[#007AFF] shadow-sm"
                                                                : "bg-[#F2F2F7] border-transparent hover:border-[#E5E5EA]"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn(
                                                                "w-6 h-6 rounded-md flex items-center justify-center transition-colors border-2",
                                                                isSelected ? "bg-[#007AFF] border-[#007AFF]" : "bg-white border-[#C7C7CC]"
                                                            )}>
                                                                {isSelected ? <Check className="w-4 h-4 text-white stroke-[4px]" /> : <div className="w-2 h-2 rounded-full bg-transparent" />}
                                                            </div>
                                                            <span className="font-bold text-sm text-[#1C1C1E]">Camera {cam}</span>
                                                        </div>
                                                        <div className={cn(
                                                            "px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase text-white shadow-sm",
                                                            getCameraColor(cam as any)
                                                        )}>
                                                            {cam}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            hidden
                                                            checked={isSelected}
                                                            onChange={(e) => {
                                                                const next = new Set(replicationTargets);
                                                                if (e.target.checked) next.add(cam);
                                                                else next.delete(cam);
                                                                setReplicationTargets(next);
                                                            }}
                                                        />
                                                    </label>
                                                );
                                            })}
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => confirmReplication(false)}
                                                className="flex-1 py-4 text-xs font-bold uppercase tracking-widest text-[#8E8E93] hover:bg-[#F2F2F7] rounded-2xl transition-all active:scale-95 border border-[#E5E5EA]"
                                            >
                                                Skip
                                            </button>
                                            <button
                                                onClick={() => confirmReplication(true)}
                                                className="flex-[1.5] py-4 text-xs font-bold uppercase tracking-widest bg-[#1C1C1E] text-white rounded-2xl shadow-xl hover:bg-[#1A1A1A] transition-all active:scale-95"
                                            >
                                                Confirm ({replicationTargets.size || 0})
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }

            {/* AI Confirmation Modal - Compact & Pro with Selection */}
            {
                draftItems && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/60 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-[700px] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
                            {/* Header */}
                            <div className="px-4 py-3 border-b flex justify-between items-center bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-900">
                                        AI Found {draftItems.length} Items
                                    </h3>
                                </div>
                                <button onClick={() => setDraftItems(null)} className="text-xs font-medium text-gray-500 hover:text-gray-800">Close</button>
                            </div>

                            {/* List - Dense Table */}
                            <div className="flex-1 overflow-y-auto p-0">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-100 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-3 py-2 w-8">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    checked={draftItems.every(i => i._selected !== false)}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        setDraftItems(draftItems.map(i => ({ ...i, _selected: checked })));
                                                    }}
                                                />
                                            </th>
                                            <th className="px-3 py-2 text-[9px] font-bold text-gray-500 uppercase">Model</th>
                                            <th className="px-3 py-2 text-[9px] font-bold text-gray-500 uppercase">Iris</th>
                                            <th className="px-3 py-2 text-[9px] font-bold text-gray-500 uppercase">CF</th>
                                            <th className="px-3 py-2 text-[9px] font-bold text-gray-500 uppercase">Front</th>
                                            <th className="px-3 py-2 text-[9px] font-bold text-gray-500 uppercase">Weight</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {draftItems.map((item: any, idx: number) => (
                                            <tr key={idx} className={`hover:bg-blue-50/50 transition-colors ${item._selected !== false ? 'bg-blue-50/30' : ''}`}>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        checked={item._selected !== false}
                                                        onChange={(e) => {
                                                            const newDrafts = [...draftItems];
                                                            newDrafts[idx] = { ...item, _selected: e.target.checked };
                                                            setDraftItems(newDrafts);
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-[10px] font-bold text-gray-900">{item.model.replace(item.brand, '').trim()}</td>
                                                <td className="px-3 py-2 text-[10px] text-gray-600 font-mono">{item.iris_range || '-'}</td>
                                                <td className="px-3 py-2 text-[10px] text-gray-600 font-mono">{item.close_focus || '-'}</td>
                                                <td className="px-3 py-2 text-[10px] text-gray-600 font-mono">{item.front_diameter_mm ? `${item.front_diameter_mm}mm` : '-'}</td>
                                                <td className="px-3 py-2 text-[10px] text-gray-600 font-mono">{item.weight_kg ? `${item.weight_kg}kg` : '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer */}
                            <div className="p-3 border-t bg-gray-50 flex gap-2 justify-end items-center">
                                <span className="text-[10px] text-gray-500 mr-auto">
                                    {draftItems.filter(i => i._selected !== false).length} selected
                                </span>
                                <button
                                    onClick={() => setDraftItems(null)}
                                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleConfirmDraft()}
                                    disabled={isResearching || draftItems.filter(i => i._selected !== false).length === 0}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isResearching ? 'Saving...' : `Add Selected (${draftItems.filter(i => i._selected !== false).length})`}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <SmartSuggestionModal
                isOpen={smartSuggestion.isOpen}
                onClose={() => setSmartSuggestion(prev => ({ ...prev, isOpen: false }))}
                hostItem={smartSuggestion.host}
                suggestions={smartSuggestion.suggestions}
                onConfirm={confirmSmartSuggestion}
            />
        </div >
    );
}
