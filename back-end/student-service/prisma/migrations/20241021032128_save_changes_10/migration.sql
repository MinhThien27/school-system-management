/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `parents` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone_number]` on the table `parents` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "parents_phoneNumber_key";

-- AlterTable
ALTER TABLE "parents" DROP COLUMN "phoneNumber",
ADD COLUMN     "phone_number" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "parents_phone_number_key" ON "parents"("phone_number");
