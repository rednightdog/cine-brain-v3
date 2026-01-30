import { prisma } from "@/lib/db";
import CineBrainInterface, { InventoryItem } from "@/components/CineBrainInterface";

// Force dynamic since we're fetching data
export const dynamic = "force-dynamic";

export default async function Page() {
  // 1. Fetch Catalog
  const dbItems = await prisma.equipmentItem.findMany({
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
    weight_kg: item.weight_kg,
    front_diameter_mm: item.front_diameter_mm,
    image_circle_mm: item.image_circle_mm,
    coverage: item.coverage, // Critical for Lens Filters
    isAIGenerated: !!item.isAIGenerated,
    isVerified: !!item.isVerified,
    parentId: item.parentId,
    imageUrl: item.imageUrl,
    description: item.description
  }));

  // 3. Fetch Projects
  const projects = await prisma.kit.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { items: true }
  });

  return (
    <CineBrainInterface
      initialItems={inventoryItems}
      initialProjects={projects}
    />
  );
}
