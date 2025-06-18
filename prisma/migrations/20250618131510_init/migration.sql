/*
  Warnings:

  - You are about to drop the column `dosen_pembimbing` on the `konsultasi` table. All the data in the column will be lost.
  - Added the required column `feedback_dosen` to the `konsultasi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topik_konsultasi` to the `konsultasi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `konsultasi` DROP COLUMN `dosen_pembimbing`,
    ADD COLUMN `feedback_dosen` VARCHAR(191) NOT NULL,
    ADD COLUMN `topik_konsultasi` VARCHAR(191) NOT NULL;
