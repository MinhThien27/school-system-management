/*
  Warnings:

  - You are about to drop the column `academic_year` on the `classes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,academic_year_id]` on the table `classes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[room_code,academic_year_id]` on the table `classes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[academic_year_id,form_teacher_id]` on the table `classes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `academic_year_id` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "classes_academic_year_form_teacher_id_key";

-- DropIndex
DROP INDEX "classes_name_academic_year_key";

-- DropIndex
DROP INDEX "classes_room_code_academic_year_key";

-- AlterTable
ALTER TABLE "class_subject" ALTER COLUMN "status" SET DEFAULT 'Active',
ALTER COLUMN "start_date" DROP NOT NULL,
ALTER COLUMN "end_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "academic_year",
ADD COLUMN     "academic_year_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "classes_name_academic_year_id_key" ON "classes"("name", "academic_year_id");

-- CreateIndex
CREATE UNIQUE INDEX "classes_room_code_academic_year_id_key" ON "classes"("room_code", "academic_year_id");

-- CreateIndex
CREATE UNIQUE INDEX "classes_academic_year_id_form_teacher_id_key" ON "classes"("academic_year_id", "form_teacher_id");
