"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { researchEquipment, normalizeName } from "@/lib/catalog-research";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

export async function createProjectAction(data: any) {
    try {
        const session = await auth();

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
            userId: session?.user?.id || null // Link to owner
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


// --- AUTH & TEAM ACTIONS ---

export async function registerUserAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email || !password) return { success: false, error: "Missing fields" };

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return { success: false, error: "User already exists" };

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || email.split("@")[0]
            }
        });

        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function inviteUserAction(projectId: string, email: string) {
    try {
        const session = await auth();
        if (!session || !session.user?.id) return { success: false, error: "Unauthorized" };

        const project = await prisma.kit.findUnique({
            where: { id: projectId },
            include: { team: true }
        });

        if (!project) return { success: false, error: "Project not found" };

        // 1. Ensure project has a team
        let teamId = project.teamId;
        if (!teamId) {
            const newTeam = await prisma.team.create({
                data: {
                    name: `Team for ${project.name}`,
                    kits: { connect: { id: projectId } },
                    members: {
                        create: { userId: session.user.id, role: "OWNER" }
                    }
                }
            });
            teamId = newTeam.id;
        }

        // 2. Create invitation
        const invitation = await prisma.invitation.create({
            data: {
                email,
                teamId: teamId!,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            }
        });

        return { success: true, invitation };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getProjectTeamAction(projectId: string) {
    const project = await prisma.kit.findUnique({
        where: { id: projectId },
        include: {
            team: {
                include: {
                    members: { include: { user: true } },
                    invitations: { where: { accepted: false } }
                }
            }
        }
    });
    return project?.team || null;
}

export async function checkForUpdatesAction(projectId: string, currentVersion: string) {
    const project = await prisma.kit.findUnique({
        where: { id: projectId },
        select: { updatedAt: true }
    });

    if (!project) return { changed: false };

    const lastUpdate = project.updatedAt.getTime().toString();
    return { changed: lastUpdate !== currentVersion, version: lastUpdate };
}
