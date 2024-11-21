-- CreateTable
CREATE TABLE "class_student" (
    "id" TEXT NOT NULL,
    "academic_year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "class_id" TEXT NOT NULL,

    CONSTRAINT "class_student_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "class_student" ADD CONSTRAINT "class_student_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
