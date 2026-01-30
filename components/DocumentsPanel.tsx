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
        <div className="h-full flex flex-col bg-gray-50 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Documents</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Main Export Card */}
                <div
                    onClick={onExport}
                    className="group bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-400 hover:shadow-sm cursor-pointer transition-all"
                >
                    <div className="flex items-start justify-between mb-2">
                        <div className="p-2 bg-blue-50 rounded-md text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <FileText size={20} />
                        </div>
                        <span className="text-xs text-gray-400 font-mono">V{project.version || 1}.0</span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Equipment List (PDF)</h3>
                    <p className="text-xs text-gray-500 mb-3">Full inventory export with serials and notes.</p>
                    <div className="flex items-center text-xs font-medium text-blue-600">
                        <Download size={12} className="mr-1" />
                        Generate PDF
                    </div>
                </div>

                {/* Placeholder for Version History */}
                <div className="mt-8">
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-3 ml-1">Version History</h4>
                    <div className="space-y-2">
                        <div className="flex items-center p-2 rounded hover:bg-white transition-colors">
                            <Clock size={14} className="text-gray-400 mr-3" />
                            <div className="flex-1">
                                <div className="text-xs font-medium text-gray-900">Current Version</div>
                                <div className="text-[10px] text-gray-500">Last edited just now</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
