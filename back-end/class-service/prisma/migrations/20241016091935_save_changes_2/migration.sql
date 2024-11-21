/*
  Warnings:

  - A unique constraint covering the columns `[name,academic_year,form_teacher_id]` on the table `classes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,academic_year,room_code]` on the table `classes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "classes_name_academic_year_form_teacher_id_key" ON "classes"("name", "academic_year", "form_teacher_id");

-- CreateIndex
CREATE UNIQUE INDEX "classes_name_academic_year_room_code_key" ON "classes"("name", "academic_year", "room_code");
