-- AlterTable
ALTER TABLE `Eye` ADD COLUMN `settings` JSON NULL;

-- AlterTable
ALTER TABLE `Project` ADD COLUMN `type` VARCHAR(255) NULL;
