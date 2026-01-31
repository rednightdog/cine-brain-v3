"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Trash2, Edit, Save, LogOut, User as UserIcon, Users } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

// Types for the form
type ProjectForm = {
    name: string;
    productionCo: string;
    producer: string;
    director: string;
    cinematographer: string;
    assistantCamera: string;
    rentalHouse: string;
    // Dates
    shootDateStart: string;
    shootDateEnd: string;
    testDateStart: string;
    testDateEnd: string;
    // Contacts (Simplified for UI, stored as JSON)
    producerPhone: string;
    producerEmail: string;
    dpPhone: string;
    dpEmail: string;
    // Rental Contact
    rentalContactName: string;
    rentalPhone: string;
    rentalEmail: string;
};

const INITIAL_FORM: ProjectForm = {
    name: "",
    productionCo: "",
    producer: "",
    director: "",
    cinematographer: "",
    assistantCamera: "",
    rentalHouse: "",
    shootDateStart: "",
    shootDateEnd: "",
    testDateStart: "",
    testDateEnd: "",
    producerPhone: "",
    producerEmail: "",
    dpPhone: "",
    dpEmail: "",
    rentalContactName: "",
    rentalPhone: "",
    rentalEmail: ""
};

export default function ProjectDashboard({
    projects,
    onSelectProject,
    onCreateProject,
    onUpdateProject,
    onDeleteProject,
    session
}: {
    projects: any[],
    onSelectProject: (id: string) => void,
    onCreateProject: (data: any) => void,
    onUpdateProject: (id: string, data: any) => void,
    onDeleteProject: (id: string) => void,
    session: any
}) {
    const [view, setView] = useState<'LIST' | 'CREATE'>('LIST');
    const [formData, setFormData] = useState<ProjectForm>(INITIAL_FORM);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleChange = (field: keyof ProjectForm, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleEdit = (p: any, e: any) => {
        e.stopPropagation();
        // Parse JSONs
        const contacts = p.contactsJson ? JSON.parse(p.contactsJson) : {};
        const dates = p.datesJson ? JSON.parse(p.datesJson) : {};

        setFormData({
            name: p.name,
            productionCo: p.productionCo || "",
            producer: p.producer || "",
            director: p.director || "",
            cinematographer: p.cinematographer || "",
            assistantCamera: p.assistantCamera || "",
            rentalHouse: p.rentalHouse || "",
            // Dates
            shootDateStart: dates.shoot?.start || "",
            shootDateEnd: dates.shoot?.end || "",
            testDateStart: dates.test?.start || "",
            testDateEnd: dates.test?.end || "",
            // Contacts
            producerPhone: contacts.producer?.phone || "",
            producerEmail: contacts.producer?.email || "",
            dpPhone: contacts.dp?.phone || "",
            dpEmail: contacts.dp?.email || "",
            rentalContactName: contacts.rental?.name || "",
            rentalPhone: contacts.rental?.phone || "",
            rentalEmail: contacts.rental?.email || ""
        });
        setEditingId(p.id);
        setView('CREATE');
    };

    const handleDelete = (id: string, e: any) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            onDeleteProject(id);
        }
    };

    const handleSubmit = () => {
        // Validate?
        if (!formData.name) return alert("Project Name is required");

        // Structure the data for Prisma
        const finalData = {
            name: formData.name,
            productionCo: formData.productionCo,
            producer: formData.producer,
            director: formData.director,
            cinematographer: formData.cinematographer,
            assistantCamera: formData.assistantCamera,
            rentalHouse: formData.rentalHouse,
            // JSON Pack
            contactsJson: JSON.stringify({
                producer: { phone: formData.producerPhone, email: formData.producerEmail },
                dp: { phone: formData.dpPhone, email: formData.dpEmail },
                rental: { name: formData.rentalContactName, phone: formData.rentalPhone, email: formData.rentalEmail }
            }),
            datesJson: JSON.stringify({
                shoot: { start: formData.shootDateStart, end: formData.shootDateEnd },
                test: { start: formData.testDateStart, end: formData.testDateEnd }
            })
        };

        if (editingId) {
            onUpdateProject(editingId, finalData);
        } else {
            onCreateProject(finalData);
        }

        // Reset
        setView('LIST');
        setEditingId(null);
        setFormData(INITIAL_FORM);
    };

    // Cancel Helper
    const handleCancel = () => {
        setView('LIST');
        setEditingId(null);
        setFormData(INITIAL_FORM);
    };

    if (view === 'LIST') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#F2F2F7] p-4 text-[#1C1C1E]">
                {/* User Header */}
                <div className="absolute top-4 right-4 flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-[#E5E5EA]">
                    <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-100 rounded-full text-[10px] font-black uppercase transition-colors">
                        <Users size={14} className="text-[#007AFF]" />
                        <span>Collaboration</span>
                    </Link>
                    <div className="w-px h-4 bg-[#E5E5EA]" />
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-tight text-[#1A1A1A]">{session?.user?.name || "User"}</span>
                        <span className="text-[8px] text-[#8E8E93] font-medium leading-none">{session?.user?.email}</span>
                    </div>
                    <div className="w-8 h-8 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white">
                        <UserIcon size={14} />
                    </div>
                    <div className="w-px h-4 bg-[#E5E5EA]" />
                    <button
                        onClick={() => signOut()}
                        className="p-1.5 hover:bg-red-50 rounded-full text-[#8E8E93] hover:text-[#FF3B30] transition-colors"
                        title="Logout"
                    >
                        <LogOut size={14} />
                    </button>
                </div>

                <div className="w-full max-w-md space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-black uppercase tracking-tight">CineBrain Pro</h1>
                        <p className="text-sm text-[#8E8E93] font-medium">Select a project to begin</p>
                    </div>

                    <div className="space-y-3">
                        {projects.length === 0 ? (
                            <div className="text-center py-8 text-[#C7C7CC] text-xs font-bold uppercase border-2 border-dashed border-[#E5E5EA] rounded-xl">
                                No Projects Found
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {projects.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => onSelectProject(p.id)}
                                        className="bg-white p-4 rounded-xl shadow-sm border border-[#E5E5EA] text-left hover:border-[#007AFF] transition-all group cursor-pointer relative"
                                    >
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-lg text-[#1C1C1E] group-hover:text-[#007AFF]">{p.name}</h3>

                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-mono bg-[#F2F2F7] px-1.5 py-0.5 rounded text-[#8E8E93]">v{p.version || 1}</span>
                                                <button onClick={(e) => handleEdit(p, e)} className="p-1.5 hover:bg-[#F2F2F7] rounded text-[#8E8E93] hover:text-[#007AFF]">
                                                    <Edit className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={(e) => handleDelete(p.id, e)} className="p-1.5 hover:bg-[#F2F2F7] rounded text-[#8E8E93] hover:text-[#FF3B30]">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-[#8E8E93] mt-1">{p.productionCo || 'No Production Co.'}</p>
                                        <div className="mt-3 flex gap-2 text-[10px] font-medium text-[#C7C7CC]">
                                            <span>DP: {p.cinematographer || '-'}</span>
                                            <span>•</span>
                                            <span suppressHydrationWarning>Last: {new Date(p.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => { setView('CREATE'); setEditingId(null); setFormData(INITIAL_FORM); }}
                            className="w-full py-4 bg-[#1C1C1E] text-white font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all"
                        >
                            + NEW PROJECT
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // CREATE FORM
    return (
        <div className="min-h-screen bg-white text-[#1C1C1E] font-sans pb-20">
            <header className="sticky top-0 bg-white/95 backdrop-blur z-20 border-b border-[#E5E5EA] px-4 py-3 flex justify-between items-center">
                <button
                    onClick={handleCancel}
                    className="text-xs font-bold text-[#8E8E93] uppercase"
                >
                    ← Cancel
                </button>
                <span className="text-sm font-black">{editingId ? 'EDIT PROJECT' : 'NEW PROJECT'}</span>
                <button
                    onClick={handleSubmit}
                    className="text-xs font-bold text-[#007AFF] uppercase disabled:opacity-50"
                    disabled={!formData.name}
                >
                    {editingId ? 'Update' : 'Create'}
                </button>
            </header>

            <div className="max-w-md mx-auto p-4 space-y-8">

                {/* 1. Basic Info */}
                <section className="space-y-4">
                    <h3 className="text-xs font-black uppercase text-[#8E8E93] tracking-wider mb-2">Project Details</h3>
                    <div className="space-y-3">
                        <Input label="Project Name" value={formData.name} onChange={v => handleChange('name', v)} required placeholder="e.g. The Great Movie" />
                        <Input label="Production Company" value={formData.productionCo} onChange={v => handleChange('productionCo', v)} placeholder="e.g. Warner Bros." />
                    </div>
                </section>

                {/* 2. Key Crew */}
                <section className="space-y-4">
                    <h3 className="text-xs font-black uppercase text-[#8E8E93] tracking-wider mb-2">Key Crew</h3>
                    <div className="grid gap-3">
                        <Input label="Producer" value={formData.producer} onChange={v => handleChange('producer', v)} />
                        <div className="grid grid-cols-2 gap-2">
                            <Input label="Phone" value={formData.producerPhone} onChange={v => handleChange('producerPhone', v)} type="tel" />
                            <Input label="Email" value={formData.producerEmail} onChange={v => handleChange('producerEmail', v)} type="email" />
                        </div>

                        <div className="h-px bg-[#F2F2F7] my-1" />

                        <Input label="Director" value={formData.director} onChange={v => handleChange('director', v)} />

                        <div className="h-px bg-[#F2F2F7] my-1" />

                        <Input label="Cinematographer (DP)" value={formData.cinematographer} onChange={v => handleChange('cinematographer', v)} />
                        <div className="grid grid-cols-2 gap-2">
                            <Input label="Phone" value={formData.dpPhone} onChange={v => handleChange('dpPhone', v)} type="tel" />
                            <Input label="Email" value={formData.dpEmail} onChange={v => handleChange('dpEmail', v)} type="email" />
                        </div>

                        <div className="h-px bg-[#F2F2F7] my-1" />

                        <Input label="1st AC" value={formData.assistantCamera} onChange={v => handleChange('assistantCamera', v)} />
                    </div>
                </section>

                {/* 3. Shoot Dates & Rental */}
                <section className="space-y-4">
                    <h3 className="text-xs font-black uppercase text-[#8E8E93] tracking-wider mb-2">Logistics</h3>

                    <div className="bg-[#F2F2F7] rounded-lg p-3 space-y-3">
                        <span className="text-[10px] font-bold uppercase text-[#8E8E93]">Shoot Dates</span>
                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Start" value={formData.shootDateStart} onChange={v => handleChange('shootDateStart', v)} type="date" />
                            <Input label="End" value={formData.shootDateEnd} onChange={v => handleChange('shootDateEnd', v)} type="date" />
                        </div>
                    </div>

                    <div className="bg-[#F2F2F7] rounded-lg p-3 space-y-3">
                        <span className="text-[10px] font-bold uppercase text-[#8E8E93]">Camera Test Dates</span>
                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Start" value={formData.testDateStart} onChange={v => handleChange('testDateStart', v)} type="date" />
                            <Input label="End" value={formData.testDateEnd} onChange={v => handleChange('testDateEnd', v)} type="date" />
                        </div>
                    </div>

                    <div className="pt-2">
                        <Input label="Rental House" value={formData.rentalHouse} onChange={v => handleChange('rentalHouse', v)} />
                        <div className="mt-2 grid grid-cols-1 gap-2">
                            <Input label="Contact Name" value={formData.rentalContactName} onChange={v => handleChange('rentalContactName', v)} placeholder="Rental Agent Name" />
                            <div className="grid grid-cols-2 gap-2">
                                <Input label="Phone" value={formData.rentalPhone} onChange={v => handleChange('rentalPhone', v)} type="tel" />
                                <Input label="Email" value={formData.rentalEmail} onChange={v => handleChange('rentalEmail', v)} type="email" />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-20" /> {/* Spacer */}
            </div>
        </div>
    );
}

interface InputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    type?: string;
    placeholder?: string;
}

function Input({ label, value, onChange, required, type = "text", placeholder }: InputProps) {
    return (
        <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#1C1C1E]">{label} {required && <span className="text-red-500">*</span>}</label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white border border-[#E5E5EA] rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-[#007AFF] transition-colors placeholder:text-[#C7C7CC]"
            />
        </div>
    );
}
