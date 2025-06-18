/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.
  - Added the required column `email_user` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `kalender_sidang` DROP FOREIGN KEY `Kalender_Sidang_email_user_fkey`;

-- DropForeignKey
ALTER TABLE `konsultasi` DROP FOREIGN KEY `Konsultasi_email_user_fkey`;

-- DropForeignKey
ALTER TABLE `pendaftaran_ta` DROP FOREIGN KEY `Pendaftaran_TA_email_user_fkey`;

-- DropForeignKey
ALTER TABLE `proposal_ta` DROP FOREIGN KEY `Proposal_TA_email_user_fkey`;

-- DropForeignKey
ALTER TABLE `revisi_laporan` DROP FOREIGN KEY `Revisi_Laporan_email_user_fkey`;

-- DropForeignKey
ALTER TABLE `seminar_hasil` DROP FOREIGN KEY `Seminar_Hasil_email_user_fkey`;

-- DropForeignKey
ALTER TABLE `sidang_ta` DROP FOREIGN KEY `Sidang_TA_email_user_fkey`;

-- DropForeignKey
ALTER TABLE `timeline_project` DROP FOREIGN KEY `Timeline_Project_email_user_fkey`;

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `email`,
    ADD COLUMN `email_user` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`email_user`);

-- AddForeignKey
ALTER TABLE `kalender_sidang` ADD CONSTRAINT `Kalender_Sidang_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `konsultasi` ADD CONSTRAINT `Konsultasi_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pendaftaran_ta` ADD CONSTRAINT `Pendaftaran_TA_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proposal_ta` ADD CONSTRAINT `Proposal_TA_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `revisi_laporan` ADD CONSTRAINT `Revisi_Laporan_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seminar_hasil` ADD CONSTRAINT `Seminar_Hasil_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sidang_ta` ADD CONSTRAINT `Sidang_TA_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `timeline_project` ADD CONSTRAINT `Timeline_Project_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
