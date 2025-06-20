/*
  Warnings:

  - Added the required column `original_filename` to the `laporan_kemajuan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `judul_ta` to the `pendaftaran_ta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `laporan_kemajuan` ADD COLUMN `original_filename` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `pendaftaran_ta` ADD COLUMN `judul_ta` VARCHAR(191) NOT NULL;
