-- DropForeignKey
ALTER TABLE "student_details" DROP CONSTRAINT "student_details_student_id_fkey";

-- AddForeignKey
ALTER TABLE "student_details" ADD CONSTRAINT "student_details_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
