-- CreateTable
CREATE TABLE "grades" (
    "id" TEXT NOT NULL,
    "oral_test" INTEGER NOT NULL,
    "small_test" INTEGER NOT NULL,
    "big_test" INTEGER NOT NULL,
    "midterm_exam" INTEGER NOT NULL,
    "final_exam" INTEGER NOT NULL,
    "subject_average" INTEGER NOT NULL,
    "class_subject_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "grades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "grades_class_subject_id_student_id_key" ON "grades"("class_subject_id", "student_id");

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
