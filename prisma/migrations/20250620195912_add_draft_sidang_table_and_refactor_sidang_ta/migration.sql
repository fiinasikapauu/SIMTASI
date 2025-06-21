/*
  Warnings:

  - You are about to drop the column `file_draft_sidang` on the `sidang_ta` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sidang_ta` DROP COLUMN `file_draft_sidang`;

-- CreateTable
CREATE TABLE `draft_sidang` (
    `id_draftsidang` INTEGER NOT NULL AUTO_INCREMENT,
    `email_user` VARCHAR(191) NOT NULL,
    `file_draft_sidang` VARCHAR(191) NOT NULL,
    `tgl_upload` DATETIME(3) NULL,
    `balasan_dosen` VARCHAR(191) NULL,
    `status_draft` VARCHAR(191) NOT NULL,

    INDEX `draft_sidang_email_user_idx`(`email_user`),
    PRIMARY KEY (`id_draftsidang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `draft_sidang` ADD CONSTRAINT `draft_sidang_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
