import React from 'react';
import { ProjectWithItems } from './CineBrainInterface';
import { Download, FileText, Clock } from 'lucide-react';

interface DocumentsPanelProps {
    project: ProjectWithItems | null; // Nullable if no project selected
    onExport: () => void;
}

export function DocumentsPanel({ project, onExport }: DocumentsPanelProps) {
    if (!project) return <div className="p-4 text-gray-400">Select a project</div>;

    return (
        <div className="flex flex-col">
            <h2 className="text-[10px] font-black uppercase text-[#8E8E93] tracking-[0.2em] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
                Documents
            </h2>

            <div className="space-y-6">
                {/* Main Export Card */}
                <div
                    onClick={onExport}
                    className="group bg-[#F2F2F7] rounded-xl p-5 hover:bg-[#E5E5EA] cursor-pointer transition-all border border-transparent hover:border-[#D1D1D6]"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-white rounded-lg text-[#007AFF] shadow-sm group-hover:scale-110 transition-transform">
                            <FileText size={20} />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-[#8E8E93] font-black uppercase tracking-widest">Version</span>
                            <span className="text-xs text-[#1C1C1E] font-bold">V{project.version || 1}.0</span>
                        </div>
                    </div>

                    <h3 className="text-sm font-bold text-[#1C1C1E] mb-1">Equipment List (PDF)</h3>
                    <p className="text-[10px] text-[#8E8E93] font-medium leading-relaxed mb-4">Full inventory export with technical specs and unit assignments.</p>

                    <div className="inline-flex items-center text-[10px] font-black uppercase tracking-wider text-[#007AFF] bg-white px-3 py-1.5 rounded-full shadow-sm group-hover:bg-[#007AFF] group-hover:text-white transition-all">
                        <Download size={12} className="mr-1.5" />
                        Generate PDF
                    </div>
                </div>

                {/* Vertical History Segment */}
                <div className="pt-2">
                    <div className="flex items-center gap-3 px-1">
                        <div className="w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#8E8E93]">
                            <Clock size={14} />
                        </div>
                        <div className="flex-1">
                            <div className="text-[11px] font-bold text-[#1C1C1E]">Current Version</div>
                            <div className="text-[9px] text-[#8E8E93] font-medium uppercase tracking-tight">Last edited just now</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
