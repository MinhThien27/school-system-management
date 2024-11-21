-- CreateTable
CREATE TABLE "level_subjects" (
    "id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "level_id" TEXT NOT NULL,

    CONSTRAINT "level_subjects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "level_subjects" ADD CONSTRAINT "level_subjects_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
