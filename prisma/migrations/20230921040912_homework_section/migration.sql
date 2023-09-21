/*
  Warnings:

  - You are about to drop the column `homeworkId` on the `Question` table. All the data in the column will be lost.
  - Added the required column `sectionId` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `questionType` on the `Question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_homeworkId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "homeworkId",
ADD COLUMN     "sectionId" TEXT NOT NULL,
DROP COLUMN "questionType",
ADD COLUMN     "questionType" "questionType" NOT NULL;

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL DEFAULT concat('sec_', replace((gen_random_uuid())::text, '-'::text, ''::text)),
    "heading" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "homeworkId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_homeworkId_fkey" FOREIGN KEY ("homeworkId") REFERENCES "Homework"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
