/*
  Warnings:

  - You are about to drop the column `description` on the `Homework` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Homework" DROP COLUMN "description",
ALTER COLUMN "deadline" DROP NOT NULL,
ALTER COLUMN "classId" DROP NOT NULL;
