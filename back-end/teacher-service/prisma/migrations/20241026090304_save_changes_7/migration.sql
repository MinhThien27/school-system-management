-- CreateTable
CREATE TABLE "department_teachers" (
    "id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "department_teachers_department_id_teacher_id_key" ON "department_teachers"("department_id", "teacher_id");

-- AddForeignKey
ALTER TABLE "department_teachers" ADD CONSTRAINT "department_teachers_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_teachers" ADD CONSTRAINT "department_teachers_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
