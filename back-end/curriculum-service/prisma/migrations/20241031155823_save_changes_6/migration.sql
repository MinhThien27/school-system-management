/*
  Warnings:

  - A unique constraint covering the columns `[level_id,semester_number,subject_id]` on the table `level_subjects` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "level_subjects_level_id_subject_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "level_subjects_level_id_semester_number_subject_id_key" ON "level_subjects"("level_id", "semester_number", "subject_id");
