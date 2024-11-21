/*
  Warnings:

  - You are about to drop the column `enrollment_date` on the `student_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student_details" DROP COLUMN "enrollment_date";

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "enrollment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
