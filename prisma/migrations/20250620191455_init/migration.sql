/*
  Warnings:

  - You are about to drop the `seminar_hasil` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `seminar_hasil` DROP FOREIGN KEY `Seminar_Hasil_email_user_fkey`;

-- DropTable
DROP TABLE `seminar_hasil`;

-- CreateTable
CREATE TABLE `draft_semhas` (
    `id_semhas` INTEGER NOT NULL AUTO_INCREMENT,
    `email_user` VARCHAR(191) NOT NULL,
    `file_draft` VARCHAR(191) NOT NULL,
    `tanggal_upload` DATETIME(3) NULL,
    `tanggapan_dosen` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,

    INDEX `draft_semhas_email_user_idx`(`email_user`),
    PRIMARY KEY (`id_semhas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `draft_semhas` ADD CONSTRAINT `draft_semhas_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
