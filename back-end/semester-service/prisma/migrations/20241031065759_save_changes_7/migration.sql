/*
  Warnings:

  - Added the required column `status` to the `academic_years` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "academic_years" ADD COLUMN     "status" "Status" NOT NULL;
