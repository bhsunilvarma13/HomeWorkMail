-- CreateTable
CREATE TABLE "HomeworkUserRelation" (
    "id" TEXT NOT NULL DEFAULT concat('hur_', replace((gen_random_uuid())::text, '-'::text, ''::text)),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "homeworkId" TEXT NOT NULL,

    CONSTRAINT "HomeworkUserRelation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HomeworkUserRelation" ADD CONSTRAINT "HomeworkUserRelation_homeworkId_fkey" FOREIGN KEY ("homeworkId") REFERENCES "Homework"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkUserRelation" ADD CONSTRAINT "HomeworkUserRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
