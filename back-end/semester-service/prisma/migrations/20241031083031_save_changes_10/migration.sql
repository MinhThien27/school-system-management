/*
  Warnings:

  - Added the required column `number_of_semesters` to the `academic_years` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "academic_years" ADD COLUMN     "number_of_semesters" INTEGER NOT NULL;
