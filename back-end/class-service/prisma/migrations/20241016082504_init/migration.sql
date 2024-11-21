-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'Inactive');

-- CreateTable
CREATE TABLE "classes" (
    "name" TEXT NOT NULL,
    "room_code" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "academicYear" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,
    "formTeacherId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "classes_name_key" ON "classes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "classes_room_code_key" ON "classes"("room_code");
