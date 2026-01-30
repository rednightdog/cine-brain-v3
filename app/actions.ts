"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { researchEquipment, normalizeName } from "@/lib/catalog-research";

export async function createProjectAction(data: any) {
    try {
        const createData: any = {
            name: data.name,
            productionCo: data.productionCo,
            producer: data.producer,
            director: data.director,
            cinematographer: data.cinematographer,
            assistantCamera: data.assistantCamera,
            rentalHouse: data.rentalHouse,
            testDates: data.testDates,
            shootDates: data.shootDates,
            contactsJson: data.contactsJson,
            datesJson: data.datesJson,
        };

        const newProject = await prisma.kit.create({
            data: createData
        });

        revalidatePath("/");
        return { success: true, project: newProject };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: e.message || "Failed to create project" };
    }
}

export async function getProjectItemsAction(projectId: string) {
    const items = await prisma.kitItem.findMany({
        where: { kitId: projectId },
        include: { equipment: true }
    });
    return items;
}

export async function updateProjectAction(id: string, data: any) {
    try {
        const updateData: any = {
            name: data.name,
            productionCo: data.productionCo,
            producer: data.producer,
            director: data.director,
            cinematographer: data.cinematographer,
            assistantCamera: data.assistantCamera,
            rentalHouse: data.rentalHouse,
            testDates: data.testDates,
            shootDates: data.shootDates,
            contactsJson: data.contactsJson,
            datesJson: data.datesJson,
        };

        const updatedProject = await prisma.kit.update({
            where: { id },
            data: updateData
        });
        revalidatePath("/");
        return { success: true, project: updatedProject };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function deleteProjectAction(id: string) {
    try {
        await prisma.kit.delete({ where: { id } });
        revalidatePath("/");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// --- ITEM ACTIONS ---

export async function addKitItemAction(projectId: string, data: any) {
    try {
        console.log("Add Item Payload:", { projectId, ...data });

        // Ensure clean data for Prisma
        const createData = {
            kitId: projectId,
            equipmentId: data.equipmentId || data.catalogId, // Support both for now to be safe
            assignedCam: String(data.assignedCam || "A"), // Explicit String cast
            quantity: Number(data.quantity || 1), // Explicit Number cast
            configJson: String(data.configJson || "{}"),
        };

        const newItem = await prisma.kitItem.create({
            data: createData
        });

        revalidatePath("/");
        return { success: true, item: newItem };
    } catch (e: any) {
        console.error("Add Item Error:", e);
        return { success: false, error: e.message || "Database create failed" };
    }
}

export async function updateKitItemAction(itemId: string, data: any) {
    try {
        const updateData: any = {
            quantity: data.quantity,
            configJson: data.configJson,
            assignedCam: data.assignedCam
            // Add other updateable fields as needed
        };

        const updatedItem = await prisma.kitItem.update({
            where: { id: itemId },
            data: updateData
        });
        revalidatePath("/");
        return { success: true, item: updatedItem };
    } catch (e: any) {
        console.error("Update Item Error:", e);
        return { success: false, error: e.message };
    }
}

export async function deleteKitItemAction(itemId: string) {
    try {
        await prisma.kitItem.delete({ where: { id: itemId } });
        revalidatePath("/");
        return { success: true };
    } catch (e: any) {
        console.error("Delete Item Error:", e);
        return { success: false, error: e.message };
    }
}

// --- CATALOG & ADMIN ACTIONS ---

export async function getGlobalCatalogAction() {
    return await prisma.equipmentItem.findMany({
        orderBy: { updatedAt: 'desc' }
    });
}

export async function deleteEquipmentAction(id: string) {
    try {
        await prisma.equipmentItem.delete({ where: { id } });
        revalidatePath("/");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function researchAndAddEquipmentAction(query: string) {
    try {
        // 1. Fuzzy Deduplication Check
        const normalizedQuery = normalizeName(query);
        const existing = await prisma.equipmentItem.findMany();
        const duplicate = existing.find(i => {
            const n1 = normalizeName(i.name);
            return n1 === normalizedQuery || (n1.length > 5 && n1.includes(normalizedQuery)) || (normalizedQuery.length > 5 && normalizedQuery.includes(n1));
        });

        if (duplicate) {
            return { success: true, item: duplicate, isDuplicate: true };
        }

        // 2. Perform AI Research
        const results = await researchEquipment(query);
        if (!results || results.length === 0) return { success: false, error: "AI could not find detailed specs for this item." };

        const specs = results[0]; // Take the first result

        // 3. Create Main Item with hierarchical categorization
        const mainItem = await (prisma.equipmentItem as any).create({
            data: {
                name: specs.brand + " " + specs.model,
                brand: specs.brand,
                model: specs.model,
                category: specs.category,
                subcategory: specs.subcategory,
                coverage: specs.coverage,
                mount: specs.mount,
                sensor_size: specs.sensor_size,
                lens_type: specs.lens_type,
                front_diameter_mm: specs.front_diameter_mm,
                weight_kg: specs.weight_kg,
                description: `AI Researched ${specs.brand} ${specs.model}`,
                daily_rate_est: 0,
                isAIGenerated: true,
            }
        });

        // 4. Create Accessories if any
        if (specs.accessories) {
            for (const acc of specs.accessories) {
                await (prisma.equipmentItem as any).create({
                    data: {
                        name: acc.brand + " " + acc.model,
                        brand: acc.brand,
                        model: acc.model,
                        category: acc.category,
                        subcategory: acc.subcategory,
                        coverage: acc.coverage,
                        lens_type: acc.lens_type,
                        parentId: mainItem.id, // Link to parent equipment
                        description: `Accessory for ${mainItem.name}`,
                        daily_rate_est: 0,
                        isAIGenerated: true,
                    }
                });
            }
        }

        revalidatePath("/");
        return { success: true, item: mainItem };
    } catch (e: any) {
        console.error("Research Error:", e);
        return { success: false, error: e.message };
    }
}

export async function researchEquipmentDraftAction(query: string) {
    try {
        const specs = await researchEquipment(query);
        if (!specs || specs.length === 0) return { success: false, error: "AI could not find detailed specs." };
        return { success: true, drafts: specs };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function saveDraftsToCatalogAction(input: any) {
    console.log("saveDraftsToCatalogAction started", Array.isArray(input) ? input.length : 1);
    // Handle array or single item
    const drafts = Array.isArray(input) ? input : [input];

    try {
        const savedItems = [];
        for (const draft of drafts) {
            console.log("Saving draft:", draft.brand, draft.model);
            let finalCategory = draft.category;
            let finalSubcategory = draft.subcategory;

            // Sanity Check: If model looks like a lens but category is wrong (e.g. CAM), fix it.
            const modelLower = draft.model.toLowerCase();
            const isLensLike = modelLower.match(/(\d+mm)|(t\d\.\d)|(f\/\d)|(prime)|(zoom)/);

            if (finalCategory !== 'LNS' && isLensLike) {
                finalCategory = 'LNS';
                finalSubcategory = modelLower.includes('zoom') ? 'Zoom' : 'Prime';
                console.log(`Auto-corrected category for ${draft.model} to LNS`);
            }

            // 1. Create Main Item
            const mainItem = await prisma.equipmentItem.create({
                data: {
                    name: draft.brand + " " + draft.model,
                    brand: draft.brand,
                    model: draft.model,
                    category: finalCategory,
                    subcategory: finalSubcategory,
                    coverage: draft.coverage,
                    mount: draft.mount,
                    sensor_size: draft.sensor_size,
                    lens_type: draft.lens_type,
                    front_diameter_mm: draft.front_diameter_mm,
                    weight_kg: draft.weight_kg,
                    description: `AI Researched. ${draft.iris_range ? `Iris: ${draft.iris_range}. ` : ''}${draft.close_focus ? `CF: ${draft.close_focus}. ` : ''}${draft.description || ''}`,
                    daily_rate_est: 0,
                    isAIGenerated: true,
                    isVerified: false,
                }
            });
            console.log("Main item created:", mainItem.id);

            // 2. Create Accessories linked to Parent
            if (draft.accessories && Array.isArray(draft.accessories)) {
                for (const acc of draft.accessories) {
                    await prisma.equipmentItem.create({
                        data: {
                            name: acc.brand + " " + acc.model,
                            brand: acc.brand,
                            model: acc.model,
                            category: acc.category,
                            subcategory: acc.subcategory,
                            parentId: mainItem.id,
                            description: `Accessory for ${mainItem.name}`,
                            daily_rate_est: 0,
                            isAIGenerated: true,
                            isVerified: false
                        }
                    });
                }
            }
            savedItems.push(mainItem);
        }

        revalidatePath("/");
        console.log("Save complete. Count:", savedItems.length);
        return { success: true, count: savedItems.length };
    } catch (e: any) {
        console.error("Save Draft Error:", e);
        // Return clear error message
        return { success: false, error: "DB Error: " + e.message };
    }
}

export async function verifyEquipmentAction(id: string) {
    try {
        await prisma.equipmentItem.update({
            where: { id },
            data: { isVerified: true }
        });
        revalidatePath("/");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}


