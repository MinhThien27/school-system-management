/*
  Warnings:

  - Added the required column `image_url` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "image_url" TEXT NOT NULL,
ALTER COLUMN "dob" SET DEFAULT CURRENT_TIMESTAMP;
