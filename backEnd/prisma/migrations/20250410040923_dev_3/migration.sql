/*
  Warnings:

  - You are about to drop the column `status` on the `issues` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `projects` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_workspaceId_fkey`;

-- AlterTable
ALTER TABLE `issue_labels` ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE `issues` DROP COLUMN `status`,
    ADD COLUMN `issueStatus` ENUM('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE') NOT NULL DEFAULT 'TODO';

-- AlterTable
ALTER TABLE `projects` DROP COLUMN `workspaceId`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE `workspace_projects` (
    `workspaceId` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',

    PRIMARY KEY (`workspaceId`, `projectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `workspace_projects` ADD CONSTRAINT `workspace_projects_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspace_projects` ADD CONSTRAINT `workspace_projects_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
