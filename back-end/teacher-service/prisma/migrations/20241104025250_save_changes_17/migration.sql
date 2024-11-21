/*
  Warnings:

  - You are about to drop the column `subject_id` on the `departments` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "departments_subject_id_key";

-- AlterTable
ALTER TABLE "departments" DROP COLUMN "subject_id";
