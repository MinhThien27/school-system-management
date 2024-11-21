-- DropForeignKey
ALTER TABLE "departments" DROP CONSTRAINT "departments_head_teacher_id_fkey";

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_head_teacher_id_fkey" FOREIGN KEY ("head_teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
