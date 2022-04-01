/*
  Warnings:

  - A unique constraint covering the columns `[runnerId]` on the table `Eye` will be added. If there are existing duplicate values, this will fail.
  - The required column `runnerId` was added to the `Eye` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `Eye` ADD COLUMN `runnerId` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Eye_runnerId_key` ON `Eye`(`runnerId`);
