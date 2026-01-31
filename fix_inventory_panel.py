
import os

file_path = '/Users/arasdemiray/.gemini/antigravity/scratch/cine-brain-pro/components/InventoryPanel.tsx'

new_code = r"""                                {CATEGORIES.filter(cat => cat.id === activeTab).map(cat => {
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
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Category</label>
                                                            <div className="text-xs font-bold text-gray-800 bg-white px-3 py-2 rounded border border-gray-200">
                                                                {activeTab} / {technicalFilter === 'ALL' ? 'General' : technicalFilter}
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
                                                                    <div className="text-[#007AFF] text-lg font-light flex items-center justify-center h-6 w-6 rounded-full bg-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-colors">+</div>
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

                                                    {standaloneItems.map(item => (
                                                        <button
                                                            key={item.id}
                                                            onClick={() => handleAddWrapper(item)}
                                                            className="w-full flex items-center p-3 bg-white rounded-lg active:scale-[0.99] transition-all text-left group hover:shadow-sm border border-transparent hover:border-blue-100"
                                                        >
                                                            <div className="flex-1">
                                                                <div className="font-bold text-xs text-[#1C1C1E]">
                                                                    {item.isPrivate && <span className="text-[9px] bg-gray-100 text-gray-500 px-1 rounded mr-1">CUSTOM</span>}
                                                                    {item.name}
                                                                </div>
                                                                <div className="text-[9px] text-[#C7C7CC] group-hover:text-[#8E8E93]">
                                                                    {item.subcategory || 'General'}
                                                                    {activeTab === 'LNS' && (item as any).coverage && ` • ${(item as any).coverage}`}
                                                                </div>
                                                            </div>
                                                            <div className="text-[#007AFF] text-lg font-light flex items-center justify-center h-6 w-6 rounded-full bg-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-colors">+</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}"""

with open(file_path, 'r') as f:
    lines = f.readlines()

# Lines are 0-indexed in list
# We want to replace lines 983 to 1243 (1-based)
# 1-based start: 983 => 0-based index: 982
# 1-based end: 1243 => 0-based index: 1243 (exclusive in slice? no, want to include 1243)
# In python slice [start:end], end is exclusive.
# So we want [0:982] + [new_code] + [1243:]

# Verify lines using content check if possible, otherwise trust line numbers from recent view_file
print(f"Total lines: {len(lines)}")
print(f"Line 983 (index 982): {lines[982]}")
print(f"Line 1243 (index 1242): {lines[1242]}")

# Slice
before = lines[:982]
after = lines[1243:] # 1243 is correct index for line 1244 (1-based)

# Write back
with open(file_path, 'w') as f:
    f.writelines(before)
    f.write(new_code + '\n')
    f.writelines(after)

print("Successfully patched file.")
