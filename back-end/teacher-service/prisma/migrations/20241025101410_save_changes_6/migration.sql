-- CreateTable
CREATE TABLE "department_subjects" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "subject_id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,

    CONSTRAINT "department_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "department_subjects_department_id_subject_id_key" ON "department_subjects"("department_id", "subject_id");

-- AddForeignKey
ALTER TABLE "department_subjects" ADD CONSTRAINT "department_subjects_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
