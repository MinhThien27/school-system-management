/*
  Warnings:

  - A unique constraint covering the columns `[name,academic_year]` on the table `classes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[room_code,academic_year]` on the table `classes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[academic_year,form_teacher_id]` on the table `classes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "classes_name_academic_year_form_teacher_id_key";

-- DropIndex
DROP INDEX "classes_name_academic_year_room_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "classes_name_academic_year_key" ON "classes"("name", "academic_year");

-- CreateIndex
CREATE UNIQUE INDEX "classes_room_code_academic_year_key" ON "classes"("room_code", "academic_year");

-- CreateIndex
CREATE UNIQUE INDEX "classes_academic_year_form_teacher_id_key" ON "classes"("academic_year", "form_teacher_id");
