/*
  Warnings:

  - You are about to drop the column `type` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `ProjectRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectRecordAttachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectRecordResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Project` DROP COLUMN `type`;

-- DropTable
DROP TABLE `ProjectRecord`;

-- DropTable
DROP TABLE `ProjectRecordAttachment`;

-- DropTable
DROP TABLE `ProjectRecordResult`;

-- CreateTable
CREATE TABLE `Eye` (
    `id` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `num` INTEGER NOT NULL,
    `projectId` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Eye_projectId_num_key`(`projectId`, `num`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EyeRecord` (
    `id` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `eyeId` VARCHAR(255) NOT NULL,
    `clientId` VARCHAR(255) NOT NULL DEFAULT 'default',
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data` JSON NULL,
    `projectId` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EyeRecordResult` (
    `id` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `eyeId` VARCHAR(255) NOT NULL,
    `recordId` VARCHAR(255) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` VARCHAR(255) NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 0,
    `projectId` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EyeRecordAttachment` (
    `id` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `size` INTEGER NOT NULL,
    `key` VARCHAR(255) NOT NULL,
    `url` VARCHAR(255) NOT NULL,
    `eyeId` VARCHAR(255) NOT NULL,
    `recordId` VARCHAR(255) NULL,
    `projectId` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `EyeRecordAttachment_recordId_key`(`recordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
