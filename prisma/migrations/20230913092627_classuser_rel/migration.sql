-- CreateTable
CREATE TABLE "ClassUserRelation" (
    "id" TEXT NOT NULL DEFAULT concat('cur_', replace((gen_random_uuid())::text, '-'::text, ''::text)),
    "role" "role" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "ClassUserRelation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClassUserRelation" ADD CONSTRAINT "ClassUserRelation_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassUserRelation" ADD CONSTRAINT "ClassUserRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
