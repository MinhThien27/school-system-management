-- AlterTable
ALTER TABLE "grades" ALTER COLUMN "oral_test" DROP NOT NULL,
ALTER COLUMN "small_test" DROP NOT NULL,
ALTER COLUMN "big_test" DROP NOT NULL,
ALTER COLUMN "midterm_exam" DROP NOT NULL,
ALTER COLUMN "final_exam" DROP NOT NULL,
ALTER COLUMN "subject_average" DROP NOT NULL;
