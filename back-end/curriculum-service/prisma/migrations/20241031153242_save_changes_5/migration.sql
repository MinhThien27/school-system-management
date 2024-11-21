/*
  Warnings:

  - Added the required column `semester_number` to the `level_subjects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "level_subjects" ADD COLUMN     "semester_number" INTEGER NOT NULL;
