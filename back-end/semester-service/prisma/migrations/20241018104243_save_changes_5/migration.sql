/*
  Warnings:

  - A unique constraint covering the columns `[start_date,end_date,academic_year]` on the table `semesters` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "semesters_start_date_end_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "semesters_start_date_end_date_academic_year_key" ON "semesters"("start_date", "end_date", "academic_year");
