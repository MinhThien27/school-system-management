/*
  Warnings:

  - You are about to drop the column `citizen_identification` on the `teachers` table. All the data in the column will be lost.
  - Added the required column `address` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "teachers_citizen_identification_key";

-- AlterTable
ALTER TABLE "teachers" DROP COLUMN "citizen_identification",
ADD COLUMN     "address" TEXT NOT NULL;
