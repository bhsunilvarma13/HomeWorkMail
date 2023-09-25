/*
  Warnings:

  - You are about to drop the `HomeworkUserRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HomeworkUserRelation" DROP CONSTRAINT "HomeworkUserRelation_homeworkId_fkey";

-- DropForeignKey
ALTER TABLE "HomeworkUserRelation" DROP CONSTRAINT "HomeworkUserRelation_userId_fkey";

-- DropTable
DROP TABLE "HomeworkUserRelation";
