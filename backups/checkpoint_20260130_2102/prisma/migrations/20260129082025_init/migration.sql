-- CreateTable
CREATE TABLE "EquipmentItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "description" TEXT NOT NULL,
    "daily_rate_est" INTEGER NOT NULL,
    "mount" TEXT,
    "weight_kg" REAL,
    "resolution" TEXT,
    "focal_length" TEXT,
    "aperture" TEXT,
    "power_draw_w" INTEGER,
    "sensor_size" TEXT,
    "sensor_type" TEXT,
    "image_circle_mm" INTEGER,
    "close_focus_m" REAL,
    "front_diameter_mm" INTEGER,
    "length_mm" INTEGER,
    "squeeze" TEXT,
    "sensor_coverage" TEXT,
    "recordingFormats" TEXT,
    "technicalData" TEXT,
    "labMetrics" TEXT,
    "specs_json" TEXT,
    "imageUrl" TEXT,
    "payload_kg" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "jobTitle" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "language" TEXT NOT NULL DEFAULT 'TR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Kit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareToken" TEXT,
    "projectDetails" TEXT,
    "ownerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Kit_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KitItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kitId" TEXT NOT NULL,
    "equipmentId" TEXT,
    "customName" TEXT,
    "customBrand" TEXT,
    "customCategory" TEXT,
    "customDescription" TEXT,
    "notes" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "KitItem_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "Kit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "KitItem_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "EquipmentItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "KitItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "KitItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Kit_shareToken_key" ON "Kit"("shareToken");
