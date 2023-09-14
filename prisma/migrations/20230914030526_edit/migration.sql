/*
  Warnings:

  - You are about to drop the `_ClassToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClassToUser" DROP CONSTRAINT "_ClassToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClassToUser" DROP CONSTRAINT "_ClassToUser_B_fkey";

-- DropTable
DROP TABLE "_ClassToUser";
