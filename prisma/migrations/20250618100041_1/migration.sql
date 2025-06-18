/*
  Warnings:

  - You are about to drop the column `feedback_dosen` on the `konsultasi` table. All the data in the column will be lost.
  - You are about to drop the column `topik_konsultasi` on the `konsultasi` table. All the data in the column will be lost.
  - Added the required column `dosen_pembimbing` to the `konsultasi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `konsultasi` DROP COLUMN `feedback_dosen`,
    DROP COLUMN `topik_konsultasi`,
    ADD COLUMN `dosen_pembimbing` VARCHAR(191) NOT NULL;
