/*
  Warnings:

  - A unique constraint covering the columns `[uniqueBarcode]` on the table `ReturnPackaging` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uniqueBarcode` to the `ReturnPackaging` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ReturnPackaging" ADD COLUMN     "uniqueBarcode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ReturnPackaging_uniqueBarcode_key" ON "public"."ReturnPackaging"("uniqueBarcode");
