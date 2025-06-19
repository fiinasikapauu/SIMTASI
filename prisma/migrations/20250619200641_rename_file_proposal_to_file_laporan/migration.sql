/*
  Warnings:

  - You are about to drop the column `file_proposal` on the `laporan_kemajuan` table. All the data in the column will be lost.
  - Added the required column `file_laporan` to the `laporan_kemajuan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `laporan_kemajuan` DROP COLUMN `file_proposal`,
    ADD COLUMN `file_laporan` VARCHAR(191) NOT NULL;
