-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED');

-- CreateTable
CREATE TABLE "HomeworkStudentRelation" (
    "id" TEXT NOT NULL DEFAULT concat('hur_', replace((gen_random_uuid())::text, '-'::text, ''::text)),
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "homeworkId" TEXT NOT NULL,

    CONSTRAINT "HomeworkStudentRelation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HomeworkStudentRelation" ADD CONSTRAINT "HomeworkStudentRelation_homeworkId_fkey" FOREIGN KEY ("homeworkId") REFERENCES "Homework"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkStudentRelation" ADD CONSTRAINT "HomeworkStudentRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
