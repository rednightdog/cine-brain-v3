"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ProjectDashboard from "./ProjectDashboard";
import { createProjectAction, updateProjectAction, deleteProjectAction, addKitItemAction, updateKitItemAction, deleteKitItemAction } from "@/app/actions";
import { generateCineListPDF, type PDFItem } from "@/lib/pdf-generator";
import { X, Layout, FileText, Camera, ShieldCheck, Lightbulb } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CATEGORIES, isCameraBody, getCameraColor } from "@/lib/inventory-utils";

// Sub Components
import { ProjectMetadataPanel } from "./ProjectMetadataPanel";
import { DocumentsPanel } from "./DocumentsPanel";
import { InventoryPanel } from "./InventoryPanel";
import { CatalogManager } from "./CatalogManager";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type InventoryItem = {
    id: string;
    name: string; // "Sony Venice 2 8K"
    brand?: string;
    model?: string;
    category: string; // "CAM", "LNS"
    subcategory?: string | null; // "Bodies", "Primes"
    subSubcategory?: string | null; // Reserved for future use
    coverage?: string | null; // For LNS: S35/FF/LF sensor coverage
    parentId?: string | null;
    isAIGenerated?: boolean;
    isVerified?: boolean;
    mount?: string | null;
    sensor_size?: string | null;
    lens_type?: string | null; // Anamorphic, Spherical
    aperture?: string | null;
    focal_length?: string | null;
    weight_kg?: number | null;
    front_diameter_mm?: number | null;
    image_circle_mm?: number | null;
    sensor_type?: string | null;
    description?: string | null;
    imageUrl?: string | null;
};

// State Shape
export type InventoryEntry = {
    id: string;
    equipmentId: string;
    assignedCam: string; // "A", "B"...
    quantity: number;
    selectedOptions: string[]; // IDs of children (Extensions)
    configJson?: string | null;
    notes?: string | null;
    customName?: string | null;
};

// Extended Project Type
export type ProjectWithItems = {
    id: string;
    items: InventoryEntry[];
    name: string;
    productionCo?: string | null;
    director?: string | null;
    cinematographer?: string | null;
    assistantCamera?: string | null;
    rentalHouse?: string | null;
    testDates?: string | null;
    shootDates?: string | null;
    contactsJson?: string | null;
    datesJson?: string | null;
    version?: number;
    [key: string]: any;
};

// Constant for stability
const EMPTY_ARRAY: InventoryEntry[] = [];

export default function CineBrainInterface({ initialItems: catalog, initialProjects }: { initialItems: InventoryItem[], initialProjects?: any[], onAddItems?: (items: InventoryItem[]) => void; customSecondary?: React.ReactNode; }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // --- GLOBAL STATE ---
    const projectParam = searchParams.get('project');
    const [activeProjectId, _setActiveProjectId] = useState<string | null>(projectParam);
    const [projects, setProjects] = useState<ProjectWithItems[]>((initialProjects as ProjectWithItems[]) || []);

    // UI Logic State
    const [activeMobileTab, setActiveMobileTab] = useState<'info' | 'docs' | 'gear'>('gear');
    const [warnings, setWarnings] = useState<string[]>([]);

    // Modal State (Managed here for now)
    const [configEntry, setConfigEntry] = useState<InventoryEntry | null>(null);
    const [activeSheet, setActiveSheet] = useState<{
        type: 'b-cam' | null;
        itemName?: string;
        copyFromEntry?: InventoryEntry
    }>({ type: null });

    const [isAdminCatalogOpen, setIsAdminCatalogOpen] = useState(false);

    // --- SYNC EFFECTS ---
    const setActiveProjectId = (id: string | null) => {
        _setActiveProjectId(id);
        if (id) {
            router.push(`${pathname}?project=${id}`);
        } else {
            router.push(pathname);
        }
    };

    useEffect(() => {
        const p = searchParams.get('project');
        if (p !== activeProjectId) {
            _setActiveProjectId(p);
        }
    }, [searchParams]);

    useEffect(() => {
        if (initialProjects) {
            setProjects(initialProjects as ProjectWithItems[]);
        }
    }, [initialProjects]);

    // --- DERIVED STATE ---
    const activeProject = activeProjectId ? projects.find(p => p.id === activeProjectId) : null;
    const inventory: InventoryEntry[] = useMemo(() => {
        if (!activeProject) return EMPTY_ARRAY;
        const rawItems = (activeProject.items as any[]) || [];

        return rawItems.map(item => {
            // Ensure selectedOptions is always derived from configJson if available
            let selectedOptions = item.selectedOptions || [];
            if (item.configJson) {
                try {
                    const config = JSON.parse(item.configJson);
                    if (config.selectedOptions) {
                        selectedOptions = config.selectedOptions;
                    }
                } catch (e) {
                    // Ignore parse errors
                }
            }
            return {
                ...item,
                selectedOptions
            };
        });
    }, [activeProject]);

    const updateInventory = (newItems: InventoryEntry[]) => {
        setProjects(prev => prev.map(p =>
            p.id === activeProjectId ? { ...p, items: newItems } : p
        ));
    };

    const activeCameras = useMemo(() => {
        const cams = new Set<string>();
        inventory.forEach(i => cams.add(i.assignedCam));
        return Array.from(cams).sort();
    }, [inventory]);

    // --- UTILS ---
    // Helper: Find next available camera letter (A, B, C...)
    // Helper: Find next available camera letter (A, B, C...)
    const getNextAvailableLetter = (currentInv: InventoryEntry[]) => {
        const used = new Set<string>();
        currentInv.forEach(entry => {
            // Only consider a letter 'taken' if a CAMERA BODY is assigned to it.
            // If only lenses/accessories are there, we count it as "Available for Body Assignment".
            const item = catalog.find(i => i.id === entry.equipmentId);
            if (item && isCameraBody(item)) {
                used.add(entry.assignedCam);
            }
        });
        const all = ['A', 'B', 'C', 'D', 'E'];
        // If A has lenses but no body, it WON'T be in `used`, so we return A. 
        // This solves "First camera B" issue.
        return all.find(L => !used.has(L)) || 'Z';
    };

    // --- HANDLERS ---
    const handleCreateProject = async (data: any) => {
        const res = await createProjectAction(data);
        if (res.success && res.project) {
            setActiveProjectId(res.project.id);
            router.refresh();
        } else {
            alert(`Error creating project: ${res.error}`);
        }
    };

    const handleUpdateProject = async (id: string, data: any) => {
        const res = await updateProjectAction(id, data);
        if (res.success) {
            router.refresh();
        } else {
            alert(`Error updating project: ${res.error}`);
        }
    };

    const handleDeleteProject = async (id: string) => {
        const res = await deleteProjectAction(id);
        if (res.success) {
            if (id === activeProjectId) {
                router.push(pathname);
                router.refresh();
                setActiveProjectId(null);
            } else {
                router.refresh();
            }
        } else {
            alert(`Error deleting project: ${res.error}`);
        }
    };

    const handleAddItem = async (item: InventoryItem, targetCam?: string) => {
        let finalCam = 'A';
        // console.log("HandleAddItem Called:", { item, targetCam, activeCameras, isBody: isCameraBody(item) });

        // Target Cam Logic
        if (targetCam) {
            finalCam = targetCam;
        } else {
            // New logic: Check if Camera Body and ALL filter -> Auto Increment
            // But we don't have access to the local filter of InventoryPanel easily
            // UNLESS we assume InventoryPanel passed 'undefined' as targetCam meaning "Auto".
            // Since we can't see the filter here easily without lifting state back up,
            // we will rely on a heuristic: IF targetCam is UNDEFINED, assume AUTO logic for Bodies.
            if (isCameraBody(item)) {
                finalCam = getNextAvailableLetter(inventory);
            }
            // Logic gap: If user is on "CAM B" tab in InventoryPanel, they expect it to go to B.
            // The InventoryPanel should pass the *current filter* as targetCam.
            // I updated InventoryPanel to pass `cameraFilter` as targetCam if not ALL.
            // So if targetCam is undefined, it means filter was ALL.
        }


        if (activeProjectId) {
            try {
                const res = await addKitItemAction(activeProjectId, {
                    equipmentId: item.id,
                    assignedCam: finalCam,
                    quantity: 1,
                    configJson: "{}"
                });
                if (res.success) {
                    // Delay refresh to allow sheet UI to stabilize if needed
                    setTimeout(() => router.refresh(), 500);
                } else {
                    // Database save failed - fallback to local mode (NO REFRESH!)
                    console.warn('Database save failed, using local mode:', res.error);
                    const newItem: InventoryEntry = {
                        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        equipmentId: item.id,
                        assignedCam: finalCam,
                        quantity: 1,
                        selectedOptions: [],
                        configJson: "{}"
                    };
                    updateInventory([...inventory, newItem]);
                }
            } catch (e: any) {
                // Exception occurred - fallback to local mode (NO REFRESH!)
                console.warn('Exception during database save, using local mode:', e.message);
                const newItem: InventoryEntry = {
                    id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    equipmentId: item.id,
                    assignedCam: finalCam,
                    quantity: 1,
                    selectedOptions: [],
                    configJson: "{}"
                };
                updateInventory([...inventory, newItem]);
            }
        } else {
            // Local Sandbox
            const newItem: InventoryEntry = {
                id: Math.random().toString(36).substr(2, 9),
                equipmentId: item.id,
                assignedCam: finalCam,
                quantity: 1,
                selectedOptions: [],
                configJson: "{}"
            };
            const newProjects = projects.map(p =>
                p.id === activeProjectId ? { ...p, items: [...p.items, newItem] } : p
            );
            setProjects(newProjects);
        }
    };

    const handleQtyChange = async (entryIdx: number, delta: number) => {
        const entry = inventory[entryIdx];
        if (!entry) return;
        const newQty = Math.max(0, entry.quantity + delta);

        if (activeProjectId) {
            try {
                if (newQty === 0) await deleteKitItemAction(entry.id);
                else await updateKitItemAction(entry.id, { quantity: newQty });
                router.refresh();
            } catch (e: any) {
                // Database operation failed - fallback to local mode
                console.warn('Database operation failed, using local mode:', e.message);
                const next = [...inventory];
                if (newQty === 0) {
                    updateInventory(next.filter((_, i) => i !== entryIdx));
                } else {
                    next[entryIdx] = { ...entry, quantity: newQty };
                    updateInventory(next);
                }
            }
        } else {
            const next = [...inventory];
            if (newQty === 0) {
                updateInventory(next.filter((_, i) => i !== entryIdx));
            } else {
                next[entryIdx] = { ...entry, quantity: newQty };
                updateInventory(next);
            }
        }
    };

    const handleToggleOption = async (entryIdx: number, childId: string) => {
        const next = [...inventory];
        const entry = next[entryIdx];
        if (!entry) return;

        const currentOptions = entry.selectedOptions || [];
        const hasOption = currentOptions.includes(childId);
        const newOptions = hasOption
            ? currentOptions.filter(o => o !== childId)
            : [...currentOptions, childId];

        // Update local state for immediate feedback
        next[entryIdx] = {
            ...entry,
            selectedOptions: newOptions
        };
        updateInventory(next);

        // Persist to Server via configJson
        if (activeProjectId) {
            const currentConfig = JSON.parse(entry.configJson || '{}');
            const newConfig = { ...currentConfig, selectedOptions: newOptions };
            const jsonStr = JSON.stringify(newConfig);

            await updateKitItemAction(entry.id, { configJson: jsonStr });
            router.refresh();
        }
    };

    const handleSaveConfig = async (id: string, updates: any) => {
        const item = inventory.find(i => i.id === id);
        if (!item) return;

        const currentConfig = JSON.parse(item.configJson || '{}');
        const newConfig = { ...currentConfig, ...updates };
        const jsonStr = JSON.stringify(newConfig);

        // Optimistic
        const next = inventory.map(i => i.id === id ? { ...i, configJson: jsonStr } : i);
        updateInventory(next);

        if (activeProjectId) {
            await updateKitItemAction(id, { configJson: jsonStr });
        }
    };

    const handleExport = async () => {

        // Sort inventory for cleaner PDF
        const sortedInventory = [...inventory].sort((a, b) => {
            // 1. Camera (A, B...)
            if (a.assignedCam !== b.assignedCam) return a.assignedCam.localeCompare(b.assignedCam);

            const itemA = catalog.find(i => i.id === a.equipmentId);
            const itemB = catalog.find(i => i.id === b.equipmentId);

            // 2. Category Priority
            const catOrder = ['CAM', 'LNS', 'FLT', 'SUP', 'MON', 'LGT', 'AUD', 'GRP'];
            const idxA = catOrder.indexOf(itemA?.category || '');
            const idxB = catOrder.indexOf(itemB?.category || '');

            // Use 999 for unknown categories to push them to end
            const rankA = idxA === -1 ? 999 : idxA;
            const rankB = idxB === -1 ? 999 : idxB;

            if (rankA !== rankB) return rankA - rankB;

            // 3. Name
            return (itemA?.name || '').localeCompare(itemB?.name || '');
        });

        const pdfItems: PDFItem[] = sortedInventory.map(entry => {
            const item = catalog.find(i => i.id === entry.equipmentId);
            return {
                name: `[${entry.assignedCam}] ${item?.name || 'Unknown'} (x${entry.quantity})`,
                level: 0
            };
        });
        const url = await generateCineListPDF(pdfItems, activeProject || null);
        window.open(url, '_blank');
    };

    // --- RENDER ---
    if (!activeProjectId) {
        return (
            <ProjectDashboard
                projects={projects}
                onSelectProject={setActiveProjectId}
                onCreateProject={handleCreateProject}
                onUpdateProject={handleUpdateProject}
                onDeleteProject={handleDeleteProject}
            />
        );
    }

    if (!activeProject) {
        // Project ID exists but project not found (deleted? invalid link?)
        // Auto-redirect to dashboard
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-[#F2F2F7]">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-[#1C1C1E]">Project Not Found</h2>
                    <button
                        onClick={() => setActiveProjectId(null)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen flex flex-col md:flex-row bg-[#F2F2F7] md:overflow-hidden text-[#1C1C1E]">
            {/* --- DESKTOP LAYOUT (Grid) --- */}
            <div className="hidden md:contents">
                {/* 1. Project Info (Left, Fixed Width) */}
                <div className="w-[300px] h-full flex-none overflow-hidden border-r border-[#E5E5EA] bg-white">
                    <ProjectMetadataPanel
                        project={activeProject}
                        onUpdateProject={handleUpdateProject}
                    />
                </div>

                {/* 2. Documents (Center, Flexible) */}
                <div className="flex-1 h-full min-w-[300px] overflow-hidden bg-[#F2F2F7]">
                    <div className="h-full max-w-3xl mx-auto border-x border-[#E5E5EA] bg-white">
                        <DocumentsPanel
                            project={activeProject}
                            onExport={handleExport}
                        />
                    </div>
                </div>

                {/* 3. Inventory (Right, Fixed Width) */}
                <div className="w-[420px] h-full flex-none overflow-hidden border-l border-[#E5E5EA] bg-white">
                    <InventoryPanel
                        inventory={inventory}
                        catalog={catalog}
                        warnings={warnings}
                        onAddItem={handleAddItem}
                        onToggleOption={handleToggleOption}
                        onQtyChange={handleQtyChange}
                        onUpdateItem={handleSaveConfig}
                        onSetConfigEntry={setConfigEntry}
                    />
                </div>
            </div>

            {/* --- MOBILE LAYOUT (Tabs) --- */}
            <div className="md:hidden flex flex-col h-full overflow-hidden">
                {/* Mobile Header */}
                <header className="flex-none bg-white p-4 border-b border-[#E5E5EA] flex justify-between items-center">
                    <div className="font-black uppercase tracking-tight text-sm truncate max-w-[200px]">
                        {activeProject.name}
                    </div>
                    <button onClick={() => setActiveProjectId(null)} className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded">EXIT</button>
                </header>

                <div className="flex-1 overflow-hidden relative">
                    {activeMobileTab === 'info' && (
                        <ProjectMetadataPanel project={activeProject} onUpdateProject={handleUpdateProject} />
                    )}
                    {activeMobileTab === 'docs' && (
                        <DocumentsPanel project={activeProject} onExport={handleExport} />
                    )}
                    {activeMobileTab === 'gear' && (
                        <InventoryPanel
                            inventory={inventory}
                            catalog={catalog}
                            warnings={warnings}
                            onAddItem={handleAddItem}
                            onToggleOption={handleToggleOption}
                            onQtyChange={handleQtyChange}
                            onUpdateItem={handleSaveConfig}
                            onSetConfigEntry={setConfigEntry}
                            onOpenAdmin={() => setIsAdminCatalogOpen(true)}
                        />
                    )}
                </div>

                {/* Bottom Tab Bar */}
                <nav className="flex-none bg-white border-t border-[#E5E5EA] pb-safe">
                    <div className="flex justify-around items-center h-14">
                        <button
                            onClick={() => setActiveMobileTab('info')}
                            className={cn("flex flex-col items-center gap-1 w-16", activeMobileTab === 'info' ? "text-blue-600" : "text-gray-400")}
                        >
                            <Layout size={20} strokeWidth={activeMobileTab === 'info' ? 2.5 : 2} />
                            <span className="text-[9px] font-bold uppercase">Info</span>
                        </button>
                        <button
                            onClick={() => setActiveMobileTab('docs')}
                            className={cn("flex flex-col items-center gap-1 w-16", activeMobileTab === 'docs' ? "text-blue-600" : "text-gray-400")}
                        >
                            <FileText size={20} strokeWidth={activeMobileTab === 'docs' ? 2.5 : 2} />
                            <span className="text-[9px] font-bold uppercase">Docs</span>
                        </button>
                        <button
                            onClick={() => setActiveMobileTab('gear')}
                            className={cn("flex flex-col items-center gap-1 w-16", activeMobileTab === 'gear' ? "text-blue-600" : "text-gray-400")}
                        >
                            <Camera size={20} strokeWidth={activeMobileTab === 'gear' ? 2.5 : 2} />
                            <span className="text-[9px] font-bold uppercase">Gear</span>
                        </button>
                    </div>
                </nav>
            </div>



            {/* --- GLOBAL MODALS --- */}

            {configEntry && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-t-[16px] p-5 w-full md:max-w-[430px] animate-in slide-in-from-bottom shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-black uppercase tracking-tight">Configuration</h2>
                            <button onClick={() => setConfigEntry(null)} className="p-2 bg-[#F2F2F7] rounded-full text-[#8E8E93]"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-4">
                            {/* Mount */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-[#8E8E93]">Lens Mount</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['PL', 'LPL', 'EF', 'E-Mount'].map(m => (
                                        <button
                                            key={m}
                                            onClick={() => handleSaveConfig(configEntry.id, { mount: m })}
                                            className={cn(
                                                "py-3 rounded-lg text-sm font-bold transition-all border",
                                                JSON.parse(configEntry.configJson || '{}').mount === m
                                                    ? "bg-[#1C1C1E] text-white border-[#1C1C1E]"
                                                    : "bg-white text-[#8E8E93] border-[#E5E5EA]"
                                            )}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Administrative Catalog Manager */}
            <CatalogManager
                isOpen={isAdminCatalogOpen}
                onClose={() => setIsAdminCatalogOpen(false)}
            />
        </div>
    );
}
