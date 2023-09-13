/*
  Warnings:

  - A unique constraint covering the columns `[inviteKey]` on the table `Class` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "inviteKey" TEXT NOT NULL DEFAULT replace((gen_random_uuid())::text, '-'::text, ''::text);

-- AlterTable
ALTER TABLE "TenantUserRelation" ALTER COLUMN "role" SET DEFAULT 'OWNER';

-- CreateIndex
CREATE UNIQUE INDEX "Class_inviteKey_key" ON "Class"("inviteKey");
