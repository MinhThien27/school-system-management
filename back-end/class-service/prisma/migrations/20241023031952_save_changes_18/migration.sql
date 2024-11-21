/*
  Warnings:

  - A unique constraint covering the columns `[class_id,studentId]` on the table `class_student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "class_student_academic_year_studentId_key";

-- CreateIndex
CREATE UNIQUE INDEX "class_student_class_id_studentId_key" ON "class_student"("class_id", "studentId");
