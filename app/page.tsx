import { prisma } from "@/lib/db";
import CineBrainInterface, { InventoryItem } from "@/components/CineBrainInterface";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Force dynamic since we're fetching data
export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const userId = session.user?.id;

  // 1. Fetch Global Catalog + User's Private Items
  const dbItems = await prisma.equipmentItem.findMany({
    where: {
      AND: [
        { status: 'APPROVED' }, // Only show approved items in the main catalog
        {
          OR: [
            { isPrivate: false },
            { ownerId: userId }
          ]
        }
      ]
    },
    orderBy: { category: 'asc' }
  });

  // 2. Map DB items to UI shape (InventoryItem)
  const inventoryItems: InventoryItem[] = (dbItems as any[]).map(item => ({
    id: item.id,
    name: item.name,
    brand: item.brand,
    model: item.model,
    category: item.category,
    subcategory: item.subcategory,
    mount: item.mount,
    lens_type: item.lens_type,
    sensor_size: item.sensor_size,
    sensor_type: item.sensor_type,
    focal_length: item.focal_length,
    aperture: item.aperture,
    weight_kg: item.weight_kg,
    front_diameter_mm: item.front_diameter_mm,
    image_circle_mm: item.image_circle_mm,
    coverage: item.coverage,
    isAIGenerated: !!item.isAiResearched,
    isAiResearched: !!item.isAiResearched,
    isVerified: !!item.isVerified,
    status: item.status,
    sourceUrl: item.sourceUrl,
    parentId: item.parentId,
    imageUrl: item.imageUrl,
    description: item.description,
    specs_json: item.specs_json,
    isPrivate: item.isPrivate, // <--- Added missing field
    ownerId: item.ownerId      // Useful for ownership checks

  }));

  // 3. Fetch Projects for the User (Owned or part of a Team)
  const projects = await prisma.kit.findMany({
    where: {
      OR: [
        { ownerId: userId },
        {
          team: {
            members: {
              some: { userId: userId }
            }
          }
        }
      ]
    },
    orderBy: { updatedAt: 'desc' },
    include: {
      items: {
        include: { equipment: true }
      }
    }
  });

  return (
    <CineBrainInterface
      initialItems={inventoryItems}
      initialProjects={projects}
      session={session}
    />
  );
}
