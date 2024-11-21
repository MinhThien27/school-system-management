/*
  Warnings:

  - You are about to drop the column `updateAt` on the `students` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" DROP COLUMN "updateAt",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
