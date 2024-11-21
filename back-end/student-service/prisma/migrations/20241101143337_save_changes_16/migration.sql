/*
  Warnings:

  - You are about to drop the column `conduct_score` on the `student_details` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `student_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student_details" DROP COLUMN "conduct_score",
DROP COLUMN "grade",
ADD COLUMN     "achievements" TEXT,
ADD COLUMN     "hobbies" TEXT;
