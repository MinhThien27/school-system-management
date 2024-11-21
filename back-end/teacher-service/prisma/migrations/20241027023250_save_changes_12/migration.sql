-- CreateTable
CREATE TABLE "available_teacher_subjects" (
    "id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "teacher_id" TEXT NOT NULL,

    CONSTRAINT "available_teacher_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "available_teacher_subjects_teacher_id_subject_id_key" ON "available_teacher_subjects"("teacher_id", "subject_id");

-- AddForeignKey
ALTER TABLE "available_teacher_subjects" ADD CONSTRAINT "available_teacher_subjects_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "department_teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
