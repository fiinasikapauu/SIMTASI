/*
  Warnings:

  - You are about to drop the column `feedback_dosen` on the `seminar_hasil` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `seminar_hasil` DROP COLUMN `feedback_dosen`,
    ADD COLUMN `tanggapan_dosen` VARCHAR(191) NULL;
