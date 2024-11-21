/*
  Warnings:

  - A unique constraint covering the columns `[semester_number,academic_year_id]` on the table `semesters` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `semester_number` to the `semesters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "semesters" ADD COLUMN     "semester_number" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "semesters_semester_number_academic_year_id_key" ON "semesters"("semester_number", "academic_year_id");
