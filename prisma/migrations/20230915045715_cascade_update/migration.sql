-- DropForeignKey
ALTER TABLE "ClassUserRelation" DROP CONSTRAINT "ClassUserRelation_classId_fkey";

-- AddForeignKey
ALTER TABLE "ClassUserRelation" ADD CONSTRAINT "ClassUserRelation_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
