/*
  Warnings:

  - Added the required column `level_id` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "level_id" TEXT NOT NULL;
