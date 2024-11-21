-- CreateTable
CREATE TABLE "class_subject" (
    "id" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "subject_id" TEXT NOT NULL,
    "semester_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,

    CONSTRAINT "class_subject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "class_subject_class_id_semester_id_subject_id_key" ON "class_subject"("class_id", "semester_id", "subject_id");

-- AddForeignKey
ALTER TABLE "class_subject" ADD CONSTRAINT "class_subject_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
