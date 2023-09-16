/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ClassUserRelation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[classId]` on the table `ClassUserRelation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `TenantUserRelation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId]` on the table `TenantUserRelation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ClassUserRelation_userId_key" ON "ClassUserRelation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassUserRelation_classId_key" ON "ClassUserRelation"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "TenantUserRelation_userId_key" ON "TenantUserRelation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TenantUserRelation_tenantId_key" ON "TenantUserRelation"("tenantId");
