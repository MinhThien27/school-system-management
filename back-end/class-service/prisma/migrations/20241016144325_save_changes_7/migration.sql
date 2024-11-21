/*
  Warnings:

  - Changed the type of `academic_year` on the `classes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "classes" DROP COLUMN "academic_year",
ADD COLUMN     "academic_year" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "classes_name_academic_year_form_teacher_id_key" ON "classes"("name", "academic_year", "form_teacher_id");

-- CreateIndex
CREATE UNIQUE INDEX "classes_name_academic_year_room_code_key" ON "classes"("name", "academic_year", "room_code");
