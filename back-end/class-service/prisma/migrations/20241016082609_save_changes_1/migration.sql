/*
  Warnings:

  - You are about to drop the column `academicYear` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `formTeacherId` on the `classes` table. All the data in the column will be lost.
  - Added the required column `academic_year` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `form_teacher_id` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classes" DROP COLUMN "academicYear",
DROP COLUMN "formTeacherId",
ADD COLUMN     "academic_year" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "form_teacher_id" TEXT NOT NULL;
