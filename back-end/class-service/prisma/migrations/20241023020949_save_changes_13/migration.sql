/*
  Warnings:

  - A unique constraint covering the columns `[academic_year,class_id,studentId]` on the table `class_student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentId` to the `class_student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "class_student" ADD COLUMN     "studentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "class_student_academic_year_class_id_studentId_key" ON "class_student"("academic_year", "class_id", "studentId");
