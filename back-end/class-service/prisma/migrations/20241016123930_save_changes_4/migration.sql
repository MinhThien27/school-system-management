/*
  Warnings:

  - A unique constraint covering the columns `[form_teacher_id]` on the table `classes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "classes_form_teacher_id_key" ON "classes"("form_teacher_id");
