-- CreateEnum
CREATE TYPE "questionType" AS ENUM ('MULTIPLE_CHOICE', 'SHORT_ANSWER', 'LONG_ANSWER', 'FILE_UPLOAD', 'TRUE_FALSE', 'ESSAY', 'FILL_IN_THE_BLANK', 'MULTIPLE_RESPONSE');

-- CreateTable
CREATE TABLE "Homework" (
    "id" TEXT NOT NULL DEFAULT concat('hwm_', replace((gen_random_uuid())::text, '-'::text, ''::text)),
    "heading" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "Homework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL DEFAULT concat('qst_', replace((gen_random_uuid())::text, '-'::text, ''::text)),
    "question" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "options" TEXT[],
    "answer" TEXT,
    "fileID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "homeworkId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_homeworkId_fkey" FOREIGN KEY ("homeworkId") REFERENCES "Homework"("id") ON DELETE CASCADE ON UPDATE CASCADE;
