/*
  Warnings:

  - You are about to drop the column `academic_year` on the `semesters` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[start_date,end_date,academic_year_id]` on the table `semesters` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `academic_year_id` to the `semesters` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "semesters_start_date_end_date_academic_year_key";

-- AlterTable
ALTER TABLE "semesters" DROP COLUMN "academic_year",
ADD COLUMN     "academic_year_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "academic_years" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_years_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "academic_years_start_date_end_date_key" ON "academic_years"("start_date", "end_date");

-- CreateIndex
CREATE UNIQUE INDEX "semesters_start_date_end_date_academic_year_id_key" ON "semesters"("start_date", "end_date", "academic_year_id");

-- AddForeignKey
ALTER TABLE "semesters" ADD CONSTRAINT "semesters_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;
