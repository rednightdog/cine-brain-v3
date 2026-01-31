"use client";

import { useState, useEffect, useMemo, useTransition, useOptimistic } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ProjectDashboard from "./ProjectDashboard";
import {
    createProjectAction,
    updateProjectAction,
    deleteProjectAction,
    addKitItemAction,
    updateKitItemAction,
    deleteKitItemAction,
    checkForUpdatesAction,
    getProjectItemsAction,
    getProjectTeamAction,
    inviteUserAction
} from "@/app/actions";
import { generateCineListPDF, type PDFItem } from "@/lib/pdf-generator";
import { X, Layout, FileText, Camera, ShieldCheck, Lightbulb, UserPlus, RefreshCw, Users, RefreshCcw, User } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useProjectSync } from "@/hooks/useProjectSync";
import Link from "next/link";
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
    coverage?: string | null;
    mount?: string | null;
    lens_type?: string | null;
    sensor_size?: string | null;
    sensor_type?: string | null;
    focal_length?: string | null;
    aperture?: string | null;
    weight_kg?: number | null;
    front_diameter_mm?: number | null;
    image_circle_mm?: number | null;
    isAiResearched?: boolean;
    isVerified?: boolean;
    status?: 'PENDING' | 'APPROVED';
    sourceUrl?: string | null;
    parentId?: string | null;
    imageUrl?: string | null;
    description?: string | null;
    specs_json?: string | null;
    isPrivate?: boolean;
    ownerId?: string | null;
}

export type InventoryEntry = {
    id: string;
    equipmentId: string | null;
    name: string;
    brand: string;
    model?: string | null;
    category: string;
    subcategory: string;
    assignedCam: string;
    quantity: number;
    notes: string;
    configJson: string;
    parentId: string | null; // For hierarchical support
    sensor_size?: string | null;
    weight_kg?: number | null;
    front_diameter_mm?: number | null;
}

export type ProjectWithItems = {
    id: string;
    name: string;
    productionCo?: string | null;
    producer?: string | null;
    director?: string | null;
    cinematographer?: string | null;
    assistantCamera?: string | null;
    rentalHouse?: string | null;
    testDates?: string | null;
    shootDates?: string | null;
    contactsJson?: string | null;
    datesJson?: string | null;
    items: any[];
    version?: number;
    updatedAt: Date;
}

export default function CineBrainInterface({ initialItems, initialProjects, session }: { initialItems: InventoryItem[], initialProjects: any[], session: any }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const projectParam = searchParams.get('project');

    // Projects & Selection
    const [activeProjectId, _setActiveProjectId] = useState<string | null>(projectParam);
    const [projects, setProjects] = useState<ProjectWithItems[]>((initialProjects as ProjectWithItems[]) || []);

    // UI Logic State
    const [activeMobileTab, setActiveMobileTab] = useState<'info' | 'docs' | 'gear' | 'team' | 'profile'>('gear');
    const [warnings, setWarnings] = useState<string[]>([]);

    // Modal State
    const [activeSheet, setActiveSheet] = useState<{
        type: 'b-cam' | 'invite' | null;
        itemName?: string;
        copyFromEntry?: InventoryEntry
    }>({ type: null });

    const [lastSyncVersion, setLastSyncVersion] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);
    const [isPending, startTransition] = useTransition();

    // --- LIVE SYNC POLLING ---
    const { setLastVersion } = useProjectSync(activeProjectId);

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
    const activeProject = activeProjectId ? (projects.find(p => p.id === activeProjectId) || null) : null;
    const items = useMemo(() => activeProject?.items || [], [activeProject]);

    const [optimisticItems, addOptimisticItem] = useOptimistic(
        items,
        (currentItems: any[], action: { type: 'add' | 'delete' | 'update', payload: any }) => {
            switch (action.type) {
                case 'add':
                    return [...currentItems, action.payload];
                case 'delete':
                    return currentItems.filter((item: any) => item.id !== action.payload);
                case 'update':
                    return currentItems.map((item: any) =>
                        item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
                    );
                default:
                    return currentItems;
            }
        }
    );

    const inventory = useMemo(() => {
        return (optimisticItems as any[]).map(item => ({
            id: item.id,
            equipmentId: item.equipmentId,
            name: item.equipment?.name || item.customName || "Unknown",
            brand: item.equipment?.brand || item.customBrand || "",
            model: item.equipment?.model || item.customModel || "",
            category: item.equipment?.category || item.customCategory || "MISC",
            subcategory: item.equipment?.subcategory || item.customSubcategory || "",
            assignedCam: item.assignedCam || "A",
            quantity: item.quantity || 1,
            notes: item.notes || "",
            configJson: item.configJson || "{}",
            parentId: item.parentId,
            sensor_size: item.equipment?.sensor_size,
            weight_kg: item.equipment?.weight_kg,
            front_diameter_mm: item.equipment?.front_diameter_mm,
            specs_json: item.equipment?.specs_json
        }));
    }, [optimisticItems]);

    // --- ACTIONS ---
    const handleAddEquipment = async (item: InventoryItem, targetCam?: string) => {
        if (!activeProjectId) return;

        const bodyItems = inventory.filter(i => isCameraBody(initialItems.find(c => c.id === i.equipmentId)));

        // Auto-assign logic for bodies if no targetCam provided
        let camToAssign = targetCam;
        if (!camToAssign) {
            if (isCameraBody(item)) {
                // Find highest current cam letter
                const camLetters = bodyItems.map(i => i.assignedCam).filter(c => /^[A-Z]$/.test(c));
                if (camLetters.length === 0) {
                    camToAssign = "A";
                } else {
                    const maxChar = Math.max(...camLetters.map(c => c.charCodeAt(0)));
                    camToAssign = String.fromCharCode(maxChar + 1);
                }
            } else {
                camToAssign = "A";
            }
        }

        startTransition(async () => {
            addOptimisticItem({
                type: 'add',
                payload: {
                    id: 'temp-' + crypto.randomUUID(),
                    equipmentId: item.id,
                    equipment: item,
                    assignedCam: camToAssign,
                    quantity: 1,
                    configJson: "{}"
                }
            });

            setIsSaving(true);
            const res = await addKitItemAction(activeProjectId, {
                catalogId: item.id,
                assignedCam: camToAssign,
                quantity: 1,
                configJson: "{}"
            });
            if (res.success) {
                router.refresh();
            } else {
                alert(res.error);
            }
            setIsSaving(false);
        });
    };

    const handleDeleteEntry = async (id: string) => {
        startTransition(async () => {
            addOptimisticItem({ type: 'delete', payload: id });
            setIsSaving(true);
            const res = await deleteKitItemAction(id);
            if (res.success) {
                router.refresh();
            }
            setIsSaving(false);
        });
    };

    const handleUpdateEntry = async (id: string, updates: any) => {
        startTransition(async () => {
            addOptimisticItem({ type: 'update', payload: { id, updates } });
            setIsSaving(true);
            const res = await updateKitItemAction(id, updates);
            if (res.success) {
                router.refresh();
            }
            setIsSaving(false);
        });
    };

    const handleToggleOption = (entryIdx: number, childId: string) => {
        const entry = inventory[entryIdx];
        if (!entry) return;
        const config = JSON.parse(entry.configJson || "{}");
        const options = config.options || [];
        const newOptions = options.includes(childId)
            ? options.filter((id: string) => id !== childId)
            : [...options, childId];
        handleUpdateEntry(entry.id, { configJson: JSON.stringify({ ...config, options: newOptions }) });
    };

    const handleQtyChange = (entryIdx: number, delta: number) => {
        const entry = inventory[entryIdx];
        if (!entry) return;
        const newQty = entry.quantity + delta;
        if (newQty <= 0) {
            handleDeleteEntry(entry.id);
        } else {
            handleUpdateEntry(entry.id, { quantity: newQty });
        }
    };

    const handleSetConfigEntry = (entry: any) => {
        handleUpdateEntry(entry.id, { configJson: entry.configJson });
    };

    const handleExportPDF = async () => {
        if (!activeProject) return;
        const pdfData: PDFItem[] = inventory.map(item => {
            const series = item.category === 'LNS'
                ? (item.model || item.name.replace(/\s*\d+\s*mm.*/gi, '').trim())
                : null;

            return {
                name: item.name,
                brand: item.brand,
                model: item.model,
                series,
                level: item.parentId ? 1 : 0,
                assignedCam: item.assignedCam,
                category: item.category,
                sensor_size: item.sensor_size,
                weight_kg: item.weight_kg,
                front_diameter_mm: item.front_diameter_mm,
                quantity: item.quantity,
                specs_json: item.specs_json
            };
        });
        const url = await generateCineListPDF(pdfData, activeProject as any);
        window.open(url, '_blank');
    };

    const handleUpdateMetadata = async (metadata: any) => {
        if (!activeProjectId) return;
        setIsSaving(true);
        const res = await updateProjectAction(activeProjectId, metadata);
        if (res.success) {
            router.refresh();
        }
        setIsSaving(false);
    };

    const handleCreateProject = async (data: any) => {
        setIsSaving(true);
        const res = await createProjectAction(data);
        if (res.success && res.project) {
            setActiveProjectId(res.project.id);
            router.refresh();
        }
        setIsSaving(false);
    };

    const handleDeleteProject = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const res = await deleteProjectAction(id);
        if (res.success) {
            setActiveProjectId(null);
            router.refresh();
        }
    };

    // --- RENDER ---
    if (!activeProjectId) {
        return (
            <ProjectDashboard
                projects={projects}
                onSelectProject={setActiveProjectId}
                onCreateProject={handleCreateProject}
                onUpdateProject={handleUpdateMetadata}
                onDeleteProject={handleDeleteProject}
                session={session}
            />
        );
    }

    return (
        <div className="h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col font-sans overflow-hidden">
            {/* Header - HIDDEN ON MOBILE */}
            <header className="hidden md:flex h-16 border-b border-[#E5E5EA] bg-white/80 backdrop-blur-xl items-center justify-between px-6 shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => setActiveProjectId(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                    <div>
                        <div className="text-[12px] text-[#1A1A1A] font-medium">{session?.user?.name || session?.user?.email}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex gap-2">
                        <Link href="/dashboard" className="text-[10px] font-bold bg-gray-100 hover:bg-gray-200 text-black px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors">
                            <Users size={12} /> COLLABORATION
                        </Link>
                        <button onClick={() => setActiveProjectId(null)} className="text-[10px] font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors">EXIT</button>
                    </div>

                    <div className="hidden md:block w-px h-4 bg-white/10 mx-2" />

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveSheet({ type: 'invite' })}
                            className="bg-white text-black px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight flex items-center gap-2 hover:bg-gray-200 transition-colors"
                        >
                            <UserPlus size={12} /> <span className="hidden sm:inline">Invite Crew</span>
                        </button>
                        <button
                            onClick={() => setIsAdminCatalogOpen(true)}
                            className="bg-white/5 hover:bg-white/10 text-white/40 hover:text-white p-1.5 rounded-full transition-all"
                            title="Catalog Admin"
                        >
                            <ShieldCheck size={16} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Application Interface */}
            <main className="flex-1 flex overflow-hidden relative">
                <div className="hidden lg:flex w-[350px] border-r border-[#E5E5EA] flex-col shrink-0 bg-white h-full z-10">
                    {/* Scrollable Project Metadata */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar">
                        <ProjectMetadataPanel
                            project={activeProject!}
                            onUpdateProject={async (id, data) => handleUpdateMetadata(data)}
                            onInviteTeam={() => setActiveSheet({ type: 'invite' })}
                        />
                    </div>
                    {/* Pinned Documents Area (Pinned to sidebar bottom) */}
                    <div className="shrink-0 p-6 pt-0 pb-10">
                        <div className="h-[2px] bg-[#F2F2F7] mb-6 w-full rounded-full opacity-50"></div>
                        <DocumentsPanel
                            project={activeProject!}
                            onExport={handleExportPDF}
                        />
                    </div>
                </div>

                {/* Center Content: Inventory List */}
                <div className="flex-1 flex flex-col min-w-0 bg-[var(--background)] overflow-hidden">
                    <div className="flex-1 flex flex-col overflow-y-auto">
                        <div className="max-w-5xl mx-auto w-full flex flex-col p-6 min-h-full">
                            <InventoryPanel
                                inventory={inventory}
                                catalog={initialItems}
                                warnings={warnings}
                                onAddItem={handleAddEquipment}
                                onUpdateItem={handleUpdateEntry}
                                onToggleOption={handleToggleOption}
                                onQtyChange={handleQtyChange}
                                onSetConfigEntry={handleSetConfigEntry}
                                onOpenAdmin={() => setIsAdminCatalogOpen(true)}
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Tab Bar - Fixed Bottom - 5 Items */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-[#E5E5EA] bg-white flex items-center justify-around z-50 pb-safe">
                    <button
                        onClick={() => setActiveMobileTab('gear')}
                        className={cn("flex flex-col items-center gap-0.5 w-1/5", activeMobileTab === 'gear' ? "text-[#007AFF]" : "text-[#8E8E93]")}
                    >
                        <Camera size={20} />
                        <span className="text-[9px] font-bold uppercase">Gear</span>
                    </button>
                    <button
                        onClick={() => setActiveMobileTab('info')}
                        className={cn("flex flex-col items-center gap-0.5 w-1/5", activeMobileTab === 'info' ? "text-[#007AFF]" : "text-[#8E8E93]")}
                    >
                        <Layout size={20} />
                        <span className="text-[9px] font-bold uppercase">Info</span>
                    </button>
                    <button
                        onClick={() => setActiveMobileTab('docs')}
                        className={cn("flex flex-col items-center gap-0.5 w-1/5", activeMobileTab === 'docs' ? "text-[#007AFF]" : "text-[#8E8E93]")}
                    >
                        <FileText size={20} />
                        <span className="text-[9px] font-bold uppercase">Docs</span>
                    </button>
                    <button
                        onClick={() => setActiveMobileTab('team')}
                        className={cn("flex flex-col items-center gap-0.5 w-1/5", activeMobileTab === 'team' ? "text-[#007AFF]" : "text-[#8E8E93]")}
                    >
                        <Users size={20} />
                        <span className="text-[9px] font-bold uppercase">Team</span>
                    </button>
                    <button
                        onClick={() => setActiveMobileTab('profile')}
                        className={cn("flex flex-col items-center gap-0.5 w-1/5", activeMobileTab === 'profile' ? "text-[#007AFF]" : "text-[#8E8E93]")}
                    >
                        <User size={20} />
                        <span className="text-[9px] font-bold uppercase">Profile</span>
                    </button>
                </div>

                {/* Mobile Overlays for Info/Docs/Team/Profile */}
                {activeMobileTab !== 'gear' && (
                    <div className="lg:hidden absolute inset-0 bg-[#050505] z-40 overflow-y-auto p-6 animate-in slide-in-from-bottom duration-300 pb-20">
                        <button
                            onClick={() => setActiveMobileTab('gear')}
                            className="absolute top-4 right-4 bg-white/10 p-2 rounded-full text-white z-50"
                        >
                            <X size={20} />
                        </button>

                        {activeMobileTab === 'info' && (
                            <div className="mt-8">
                                <ProjectMetadataPanel
                                    project={activeProject!}
                                    onUpdateProject={async (id, data) => handleUpdateMetadata(data)}
                                    onInviteTeam={() => setActiveSheet({ type: 'invite' })}
                                />
                            </div>
                        )}
                        {activeMobileTab === 'docs' && (
                            <div className="mt-8">
                                <DocumentsPanel
                                    project={activeProject!}
                                    onExport={handleExportPDF}
                                />
                            </div>
                        )}
                        {activeMobileTab === 'team' && (
                            <div className="mt-8">
                                <h2 className="text-2xl font-bold uppercase tracking-tight text-white mb-6">Team Collaboration</h2>
                                <div className="bg-white rounded-[32px] p-6">
                                    <TeamPanel projectId={activeProjectId!} />
                                </div>
                            </div>
                        )}
                        {activeMobileTab === 'profile' && (
                            <div className="mt-12 flex flex-col items-center text-white">
                                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-4">
                                    <User size={48} className="text-white/50" />
                                </div>
                                <h2 className="text-2xl font-bold mb-1">{session?.user?.name}</h2>
                                <p className="text-white/50 text-sm mb-8">{session?.user?.email}</p>

                                <div className="w-full max-w-sm space-y-4">
                                    <button
                                        onClick={() => setIsAdminCatalogOpen(true)}
                                        className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-wide transition-colors"
                                    >
                                        <ShieldCheck size={20} /> Admin Catalog
                                    </button>

                                    <button
                                        onClick={() => setActiveProjectId(null)}
                                        className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl font-bold uppercase tracking-wide transition-colors"
                                    >
                                        Exit Project
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Administrative Catalog Manager */}
            <CatalogManager
                isOpen={isAdminCatalogOpen}
                onClose={() => setIsAdminCatalogOpen(false)}
            />

            {/* Invitation Modal (Desktop) */}
            {activeSheet.type === 'invite' && (
                <InvitationModal
                    projectId={activeProjectId!}
                    onClose={() => setActiveSheet({ type: null })}
                />
            )}
        </div>
    );
}

// --- SUBMODAL COMPONENTS ---

function TeamPanel({ projectId }: { projectId: string }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [team, setTeam] = useState<any>(null);

    useEffect(() => {
        getProjectTeamAction(projectId).then(setTeam);
    }, [projectId]);

    const handleInvite = async () => {
        if (!email.includes("@")) return;
        setLoading(true);
        const res = await inviteUserAction(projectId, email);
        if (res.success) {
            setEmail("");
            // Refresh team list
            const updatedTeam = await getProjectTeamAction(projectId);
            setTeam(updatedTeam);
        } else {
            alert(res.error);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] ml-1">Invite by Email</label>
                <div className="flex gap-2">
                    <input
                        className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#1A1A1A] outline-none transition-all text-[#1A1A1A] font-medium"
                        placeholder="colleague@cinematography.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        onClick={handleInvite}
                        disabled={loading}
                        className="bg-[#1A1A1A] text-white px-8 rounded-2xl font-bold hover:bg-[#333] transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <RefreshCcw className="animate-spin w-4 h-4" /> : "INVITE"}
                    </button>
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] ml-1 border-b border-[#F1F5F9] pb-2">Active Collaborators</h3>
                <div className="max-h-[200px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                    {team?.members?.map((m: any) => (
                        <div key={m.id} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-2xl border border-[#F1F5F9]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white font-bold text-xs">
                                    {m.user?.name?.[0] || m.user?.email?.[0]}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-[#1A1A1A]">{m.user?.name}</div>
                                    <div className="text-[10px] text-[#64748B] font-medium">{m.user?.email}</div>
                                </div>
                            </div>
                            <div className="text-[9px] font-bold uppercase bg-white border border-[#E2E8F0] px-2 py-1 rounded-md text-[#64748B]">
                                {m.role}
                            </div>
                        </div>
                    ))}

                    {team?.invitations?.map((inv: any) => (
                        <div key={inv.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E2E8F0] border-dashed">
                            <div className="flex items-center gap-3 opacity-60">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 font-bold text-xs">
                                    ?
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-500">Pending...</div>
                                    <div className="text-[10px] text-gray-400 font-medium">{inv.email}</div>
                                </div>
                            </div>
                            <div className="text-[8px] font-bold uppercase bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                                Invited
                            </div>
                        </div>
                    ))}

                    {(!team?.members || team.members.length === 0) && (!team?.invitations || team.invitations.length === 0) && (
                        <div className="text-center py-8 text-[#94A3B8] italic text-sm">
                            No collaborators yet. Start by inviting someone!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function InvitationModal({ projectId, onClose }: { projectId: string, onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in">
            <div className="bg-white rounded-[32px] p-8 w-full max-w-lg shadow-2xl border border-[#E2E8F0]">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-[#1A1A1A]">Team Collaboration</h2>
                        <p className="text-[#64748B] text-sm font-medium mt-1">Invite colleagues to edit this project list</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-[#F8FAFC] rounded-full text-[#64748B] hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <TeamPanel projectId={projectId} />
            </div>
        </div>
    );
}
