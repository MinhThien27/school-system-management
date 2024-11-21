/*
  Warnings:

  - A unique constraint covering the columns `[citizen_identification]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `citizen_identification` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "citizen_identification" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "students_citizen_identification_key" ON "students"("citizen_identification");
