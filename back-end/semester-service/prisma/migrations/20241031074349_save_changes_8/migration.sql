/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `academic_years` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "academic_years_name_key" ON "academic_years"("name");
