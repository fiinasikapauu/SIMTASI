/*
  Warnings:

  - You are about to drop the column `topik_konsultasi` on the `konsultasi` table. All the data in the column will be lost.
  - Added the required column `topik_konsultasi` to the `feedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `feedback` ADD COLUMN `topik_konsultasi` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `konsultasi` DROP COLUMN `topik_konsultasi`;
