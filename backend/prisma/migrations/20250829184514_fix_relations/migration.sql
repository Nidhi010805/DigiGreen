/*
  Warnings:

  - You are about to drop the column `material` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ReturnPackaging` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `ReturnPackaging` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `ReturnPackaging` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `ReturnPackaging` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ReturnPackaging` table. All the data in the column will be lost.
  - Added the required column `packageId` to the `ReturnPackaging` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ReturnPackaging" DROP CONSTRAINT "ReturnPackaging_orderId_fkey";

-- DropIndex
DROP INDEX "public"."Product_category_idx";

-- DropIndex
DROP INDEX "public"."Product_material_idx";

-- DropIndex
DROP INDEX "public"."ReturnPackaging_orderId_key";

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "material",
DROP COLUMN "size";

-- AlterTable
ALTER TABLE "public"."Retailer" ADD COLUMN     "incentiveEarned" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."ReturnPackaging" DROP COLUMN "createdAt",
DROP COLUMN "material",
DROP COLUMN "orderId",
DROP COLUMN "size",
DROP COLUMN "updatedAt",
ADD COLUMN     "cashback" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "orderPackageId" TEXT,
ADD COLUMN     "packageId" TEXT NOT NULL,
ADD COLUMN     "retailerId" TEXT,
ADD COLUMN     "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "public"."Package" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "recyclable" BOOLEAN NOT NULL DEFAULT true,
    "biodegradable" BOOLEAN NOT NULL DEFAULT false,
    "barcode" TEXT NOT NULL,
    "isReturned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderPackage" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,

    CONSTRAINT "OrderPackage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Package_barcode_key" ON "public"."Package"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "OrderPackage_orderId_packageId_key" ON "public"."OrderPackage"("orderId", "packageId");

-- AddForeignKey
ALTER TABLE "public"."Package" ADD CONSTRAINT "Package_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderPackage" ADD CONSTRAINT "OrderPackage_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderPackage" ADD CONSTRAINT "OrderPackage_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReturnPackaging" ADD CONSTRAINT "ReturnPackaging_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReturnPackaging" ADD CONSTRAINT "ReturnPackaging_retailerId_fkey" FOREIGN KEY ("retailerId") REFERENCES "public"."Retailer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReturnPackaging" ADD CONSTRAINT "ReturnPackaging_orderPackageId_fkey" FOREIGN KEY ("orderPackageId") REFERENCES "public"."OrderPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
