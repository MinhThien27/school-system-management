/*
  Warnings:

  - A unique constraint covering the columns `[subject_id]` on the table `departments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "departments_subject_id_key" ON "departments"("subject_id");
