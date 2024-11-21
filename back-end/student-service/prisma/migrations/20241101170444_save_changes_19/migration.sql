-- AlterTable
ALTER TABLE "parents" ALTER COLUMN "dob" DROP DEFAULT;

-- AlterTable
ALTER TABLE "students" ALTER COLUMN "dob" DROP DEFAULT,
ALTER COLUMN "enrollment_date" DROP DEFAULT;
