"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { researchEquipment, normalizeName } from "@/lib/catalog-research";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

export async function createProjectAction(data: any) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Authentication failed. Please log out and log in again." };
        }
        console.log("Create Project Session User ID:", session.user.id);

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
            ownerId: session?.user?.id || null, // Correct field name
            version: 1
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
            version: { increment: 1 } // Increment version for sync
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

        // Bump project version for sync
        await prisma.kit.update({
            where: { id: projectId },
            data: { version: { increment: 1 } }
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

        // Bump project version for sync
        await prisma.kit.update({
            where: { id: updatedItem.kitId },
            data: { version: { increment: 1 } }
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
        const item = await prisma.kitItem.findUnique({ where: { id: itemId } });
        if (!item) return { success: false, error: "Item not found" };

        await prisma.kitItem.delete({ where: { id: itemId } });

        // Bump project version for sync
        await prisma.kit.update({
            where: { id: item.kitId },
            data: { version: { increment: 1 } }
        });

        revalidatePath("/");
        return { success: true };
    } catch (e: any) {
        console.error("Delete Item Error:", e);
        return { success: false, error: e.message };
    }
}

// --- CATALOG & ADMIN ACTIONS ---

export async function getGlobalCatalogAction() {
    const session = await auth();
    const userId = session?.user?.id;

    const whereClause: any = {
        OR: [
            { isPrivate: false }, // Public items
        ]
    };

    if (userId) {
        whereClause.OR.push({ ownerId: userId }); // User's private items
    }

    return await prisma.equipmentItem.findMany({
        where: whereClause,
        orderBy: { updatedAt: 'desc' }
    });
}

export async function deleteEquipmentAction(id: string) {
    try {
        await prisma.equipmentItem.deleteMany({
            where: {
                id: id,
                status: 'PENDING'
            }
        });
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
                isAiResearched: true,
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
                        isAiResearched: true,
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
                    isAiResearched: true, // Mark as AI Researched
                    isVerified: false,
                    status: 'PENDING', // Set as PENDING for approval
                    sourceUrl: draft.source_url, // Store the source URL 🔗
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
                            isAiResearched: true,
                            isVerified: false,
                            status: 'PENDING',
                            sourceUrl: acc.source_url
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

export async function approveEquipmentAction(id: string) {
    try {
        const approvedItem = await prisma.equipmentItem.update({
            where: { id },
            data: {
                status: 'APPROVED',
                updatedAt: new Date()
            }
        });
        revalidatePath("/");
        return { success: true, item: approvedItem };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getPendingEquipmentAction() {
    try {
        const pending = await prisma.equipmentItem.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, items: pending };
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

export async function createTeamAction(name: string) {
    try {
        const session = await auth();
        if (!session || !session.user?.id) return { success: false, error: "Unauthorized" };

        const team = await prisma.team.create({
            data: {
                name,
                members: {
                    create: { userId: session.user.id, role: "OWNER" }
                }
            }
        });

        revalidatePath("/dashboard");
        return { success: true, team };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getUserTeamsAction() {
    try {
        const session = await auth();
        if (!session || !session.user?.id) return { success: false, error: "Unauthorized" };

        const teams = await prisma.team.findMany({
            where: {
                members: { some: { userId: session.user.id } }
            },
            include: {
                members: { include: { user: true } },
                kits: true,
                invitations: { where: { accepted: false } }
            },
            orderBy: { updatedAt: 'desc' }
        });

        return { success: true, teams };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function acceptInvitationAction(token: string) {
    try {
        const session = await auth();
        if (!session || !session.user?.id) return { success: false, error: "Unauthorized" };

        const invitation = await prisma.invitation.findUnique({
            where: { token, accepted: false },
            include: { team: true }
        });

        if (!invitation) return { success: false, error: "Invalid or expired invitation" };
        if (invitation.expires < new Date()) return { success: false, error: "Invitation expired" };

        // 1. Add user to team
        await prisma.teamMember.create({
            data: {
                teamId: invitation.teamId,
                userId: session.user.id,
                role: invitation.role
            }
        });

        // 2. Mark invitation as accepted
        await prisma.invitation.update({
            where: { id: invitation.id },
            data: { accepted: true }
        });

        revalidatePath("/dashboard");
        revalidatePath("/");
        return { success: true, teamId: invitation.teamId };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function removeTeamMemberAction(teamId: string, userId: string) {
    try {
        const session = await auth();
        if (!session || !session.user?.id) return { success: false, error: "Unauthorized" };

        // Ensure requester is OWNER or ADMIN
        const requester = await prisma.teamMember.findUnique({
            where: { teamId_userId: { teamId, userId: session.user.id } }
        });

        if (!requester || (requester.role !== "OWNER" && requester.role !== "ADMIN")) {
            return { success: false, error: "Insufficient permissions" };
        }

        // Prevent removing the owner unless by self? (Actually owners shouldn't be removable except by deleting team)
        const target = await prisma.teamMember.findUnique({
            where: { teamId_userId: { teamId, userId } }
        });

        if (target?.role === "OWNER") return { success: false, error: "Cannot remove team owner" };

        await prisma.teamMember.delete({
            where: { teamId_userId: { teamId, userId } }
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function deleteTeamAction(teamId: string) {
    try {
        const session = await auth();
        if (!session || !session.user?.id) return { success: false, error: "Unauthorized" };

        const member = await prisma.teamMember.findUnique({
            where: { teamId_userId: { teamId, userId: session.user.id } }
        });

        if (member?.role !== "OWNER") return { success: false, error: "Only the owner can delete a team" };

        await prisma.team.delete({ where: { id: teamId } });

        revalidatePath("/dashboard");
        revalidatePath("/");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getPendingInvitationsAction() {
    try {
        const session = await auth();
        if (!session || !session.user?.email) return { success: false, error: "Unauthorized" };

        const invitations = await prisma.invitation.findMany({
            where: {
                email: session.user.email,
                accepted: false,
                expires: { gt: new Date() }
            },
            include: { team: true }
        });

        return { success: true, invitations };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
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

// --- CUSTOM ITEM ACTIONS ---

export async function createCustomItemAction(data: any) {
    try {
        const session = await auth();
        if (!session || !session.user?.id) return { success: false, error: "Unauthorized" };

        const newItem = await prisma.equipmentItem.create({
            data: {
                name: data.model ? `${data.brand} ${data.model}` : data.name,
                brand: data.brand || "Generic",
                model: data.model || "Custom",
                category: data.category,
                subcategory: data.subcategory,
                description: data.description || "Custom Item",
                daily_rate_est: 0,
                isPrivate: true,
                ownerId: session.user.id,
                status: 'APPROVED', // Auto-approve private items
                isVerified: true
            }
        });

        revalidatePath("/");
        return { success: true, item: newItem };
    } catch (e: any) {
        console.error("Create Custom Item Error:", e);
        return { success: false, error: e.message };
    }
}

export async function deleteCustomItemAction(id: string) {
    try {
        const session = await auth();
        if (!session || !session.user?.id) return { success: false, error: "Unauthorized" };

        const item = await prisma.equipmentItem.findUnique({ where: { id } });

        if (!item) return { success: false, error: "Item not found" };
        if (item.ownerId !== session.user.id) return { success: false, error: "Unauthorized" };

        // Manual Cascade: Delete all KitItems referencing this custom item first
        await prisma.kitItem.deleteMany({
            where: { equipmentId: id }
        });

        await prisma.equipmentItem.delete({ where: { id } });

        revalidatePath("/");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
