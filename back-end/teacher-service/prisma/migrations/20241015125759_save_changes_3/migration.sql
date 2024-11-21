/*
  Warnings:

  - You are about to drop the column `headTeacherId` on the `departments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[head_teacher_id]` on the table `departments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "departments" DROP CONSTRAINT "departments_headTeacherId_fkey";

-- DropIndex
DROP INDEX "departments_headTeacherId_key";

-- AlterTable
ALTER TABLE "departments" DROP COLUMN "headTeacherId",
ADD COLUMN     "head_teacher_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "departments_head_teacher_id_key" ON "departments"("head_teacher_id");

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_head_teacher_id_fkey" FOREIGN KEY ("head_teacher_id") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
