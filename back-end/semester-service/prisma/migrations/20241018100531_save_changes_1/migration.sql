/*
  Warnings:

  - You are about to drop the column `academicYear` on the `semesters` table. All the data in the column will be lost.
  - Added the required column `academic_year` to the `semesters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "semesters" DROP COLUMN "academicYear",
ADD COLUMN     "academic_year" INTEGER NOT NULL;
