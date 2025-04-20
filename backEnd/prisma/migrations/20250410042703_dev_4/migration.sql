/*
  Warnings:

  - You are about to drop the `workspace_projects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `workspace_projects` DROP FOREIGN KEY `workspace_projects_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `workspace_projects` DROP FOREIGN KEY `workspace_projects_workspaceId_fkey`;

-- AlterTable
ALTER TABLE `projects` ADD COLUMN `workspaceId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `workspace_projects`;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
