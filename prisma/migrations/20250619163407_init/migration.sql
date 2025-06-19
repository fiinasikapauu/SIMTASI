/*
  Warnings:

  - Added the required column `judul_ta` to the `pendaftaran_ta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pendaftaran_ta` ADD COLUMN `judul_ta` VARCHAR(191) NOT NULL;
