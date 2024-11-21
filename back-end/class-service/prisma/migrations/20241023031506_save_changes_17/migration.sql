/*
  Warnings:

  - A unique constraint covering the columns `[semester_id,class_id,subject_id]` on the table `class_subject` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "class_subject_class_id_semester_id_subject_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "class_subject_semester_id_class_id_subject_id_key" ON "class_subject"("semester_id", "class_id", "subject_id");
