import React, { useState } from 'react';
import { ProjectWithItems } from './CineBrainInterface';

interface ProjectMetadataPanelProps {
    project: ProjectWithItems;
    onUpdateProject: (id: string, data: any) => Promise<void>;
}

export function ProjectMetadataPanel({ project, onUpdateProject }: ProjectMetadataPanelProps) {
    const [isEditing, setIsEditing] = useState(false);

    // Local state for form
    const [formData, setFormData] = useState({
        name: project.name,
        productionCo: project.productionCo || '',
        producer: project.producer || '',
        director: project.director || '',
        cinematographer: project.cinematographer || '',
        assistantCamera: project.assistantCamera || '',
        rentalHouse: project.rentalHouse || '',
        testDates: (project as any).testDates || '',
        shootDates: (project as any).shootDates || '',
        datesJson: project.datesJson || '{}'
    });

    const handleSave = async () => {
        setIsEditing(false);
        await onUpdateProject(project.id, formData);
    };

    return (
        <div className="h-full flex flex-col bg-white border-r border-[#E5E5EA]">
            <div className="p-4 border-b border-[#E5E5EA] flex justify-between items-center bg-[#F2F2F7]/50">
                <h2 className="text-[10px] font-black uppercase text-[#8E8E93] tracking-[0.1em]">Project Info</h2>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="text-[10px] font-black uppercase text-[#007AFF] tracking-wider hover:opacity-70 transition-opacity"
                >
                    {isEditing ? 'Save' : 'Edit'}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-8">
                <div>
                    <label className="block text-[10px] font-black uppercase text-[#8E8E93] tracking-widest mb-2">Project Name</label>
                    {isEditing ? (
                        <input
                            className="w-full text-2xl font-black text-[#1C1C1E] border-b-2 border-[#007AFF] bg-transparent outline-none pb-2 uppercase tracking-tighter"
                            value={formData.name}
                            placeholder="PROJECT NAME"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                        />
                    ) : (
                        <div className="text-2xl font-black text-[#1C1C1E] uppercase tracking-tighter leading-none break-words">
                            {project.name}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Main Credits */}
                    <div className="grid grid-cols-1 gap-5">
                        <Field
                            label="Production Co"
                            value={formData.productionCo}
                            isEditing={isEditing}
                            onChange={(val) => setFormData({ ...formData, productionCo: val })}
                        />
                        <Field
                            label="Producer"
                            value={formData.producer}
                            isEditing={isEditing}
                            onChange={(val) => setFormData({ ...formData, producer: val })}
                        />
                        <Field
                            label="Director"
                            value={formData.director}
                            isEditing={isEditing}
                            onChange={(val) => setFormData({ ...formData, director: val })}
                        />
                        <Field
                            label="Cinematographer"
                            value={formData.cinematographer}
                            isEditing={isEditing}
                            onChange={(val) => setFormData({ ...formData, cinematographer: val })}
                        />
                        <Field
                            label="Assistant Camera (1st AC)"
                            value={formData.assistantCamera}
                            isEditing={isEditing}
                            onChange={(val) => setFormData({ ...formData, assistantCamera: val })}
                        />
                        <Field
                            label="Rental House"
                            value={formData.rentalHouse}
                            isEditing={isEditing}
                            onChange={(val) => setFormData({ ...formData, rentalHouse: val })}
                        />
                    </div>

                    {/* Dates Section */}
                    <div className="pt-4 border-t border-[#F2F2F7] space-y-5">
                        <Field
                            label="Test Dates"
                            value={formData.testDates}
                            isEditing={isEditing}
                            onChange={(val) => setFormData({ ...formData, testDates: val })}
                        />
                        <Field
                            label="Shoot Dates"
                            value={formData.shootDates}
                            isEditing={isEditing}
                            onChange={(val) => setFormData({ ...formData, shootDates: val })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Field({ label, value, isEditing, onChange }: { label: string, value: string, isEditing: boolean, onChange: (v: string) => void }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[9px] font-black uppercase text-[#AEAEB2] tracking-wider">{label}</label>
            {isEditing ? (
                <input
                    className="w-full text-sm font-bold text-[#1C1C1E] bg-[#F2F2F7] rounded-lg p-2.5 border-none outline-none focus:ring-1 focus:ring-[#007AFF] transition-all"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <div className="text-sm font-bold text-[#3A3A3C] border-b border-[#F2F2F7] pb-1">
                    {value || '-'}
                </div>
            )}
        </div>
    );
}
