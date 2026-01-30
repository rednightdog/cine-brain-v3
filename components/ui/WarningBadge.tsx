import React from 'react';
import { AlertTriangle, Plug, Crop } from 'lucide-react';
import { cn } from '@/lib/utils';

export type WarningType = 'MOUNT' | 'SENSOR' | 'WEIGHT';

interface WarningBadgeProps {
    type: WarningType;
    message: string;
    compact?: boolean;
}

export function WarningBadge({ type, message, compact = false }: WarningBadgeProps) {
    const config = {
        MOUNT: {
            icon: Plug,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            label: 'Mount'
        },
        SENSOR: {
            icon: Crop,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            label: 'Coverage'
        },
        WEIGHT: {
            icon: AlertTriangle,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
            label: 'Weight'
        }
    };

    const { icon: Icon, color, bgColor, borderColor, label } = config[type];

    if (compact) {
        return (
            <div
                className={cn(
                    "inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wide transition-all",
                    bgColor, borderColor, color
                )}
                title={message}
            >
                <Icon className="w-2.5 h-2.5" />
                <span>{label}</span>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "flex items-start gap-2 p-2 rounded-lg border text-xs transition-all",
                bgColor, borderColor
            )}
        >
            <Icon className={cn("w-4 h-4 flex-shrink-0 mt-0.5", color)} />
            <div className="flex-1 min-w-0">
                <div className={cn("font-bold text-[10px] uppercase tracking-wide mb-0.5", color)}>
                    {label} Issue
                </div>
                <div className="text-[11px] text-gray-700 leading-tight whitespace-pre-line">
                    {message}
                </div>
            </div>
        </div>
    );
}

// Tooltip wrapper for inline badges
interface WarningTooltipProps {
    warnings: { type: WarningType; message: string; suggestedAdapters?: any[] }[];
    children: React.ReactNode;
}

import { createPortal } from 'react-dom';

export function WarningTooltip({ warnings, children }: WarningTooltipProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const triggerRef = React.useRef<HTMLDivElement>(null);
    const [position, setPosition] = React.useState<{ top: number; left: number }>({ top: 0, left: 0 });

    React.useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Calculate best position: Prefer Bottom-Left aligned with trigger
            // But ensure it fits on screen
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            let top = rect.bottom + scrollTop + 4; // 4px gap
            let left = rect.left;

            // Simple boundary check (assuming viewport width)
            if (left + 320 > window.innerWidth) { // 320px is approx tooltip width
                left = window.innerWidth - 330; // Snap to right edge with padding
            }

            setPosition({ top, left });
        }
    }, [isOpen]);

    if (warnings.length === 0) return <>{children}</>;

    return (
        <div
            ref={triggerRef}
            className="relative inline-block"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div className="cursor-help">
                {children}
            </div>
            {isOpen && createPortal(
                <div
                    className="fixed z-[9999] animate-in fade-in zoom-in-95 duration-200"
                    style={{
                        top: position.top - (window.scrollY || document.documentElement.scrollTop), // Convert back to fixed relative to viewport
                        left: position.left,
                        pointerEvents: 'none' // Let clicks pass through if needed, though usually tooltips block mouse
                    }}
                >
                    <div className="w-80 bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 p-2 space-y-1.5 ring-1 ring-black/5">
                        {warnings.map((w, i) => (
                            <div key={i}>
                                <WarningBadge type={w.type} message={w.message} />
                                {w.suggestedAdapters && w.suggestedAdapters.length > 0 && (
                                    <div className="mt-1.5 pl-6 space-y-1">
                                        <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wide">
                                            Suggested Adapters:
                                        </div>
                                        {w.suggestedAdapters.map((adapter, idx) => (
                                            <div key={idx} className="text-[10px] text-gray-700 flex items-center gap-1.5">
                                                <div className="w-1 h-1 rounded-full bg-blue-500" />
                                                <span className="font-semibold">{adapter.brand}</span>
                                                <span>{adapter.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
