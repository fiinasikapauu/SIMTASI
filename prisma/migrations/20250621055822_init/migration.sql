/*
  Warnings:

  - A unique constraint covering the columns `[id_pendaftaran]` on the table `sidang_ta` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_pendaftaran` to the `sidang_ta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `pendaftaran_ta` DROP FOREIGN KEY `Pendaftaran_TA_email_user_fkey`;

-- DropForeignKey
ALTER TABLE `pendaftaran_ta` DROP FOREIGN KEY `Pendaftaran_TA_id_topikta_fkey`;

-- DropForeignKey
ALTER TABLE `sidang_ta` DROP FOREIGN KEY `Sidang_TA_email_user_fkey`;

-- AlterTable
ALTER TABLE `sidang_ta` ADD COLUMN `id_pendaftaran` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `sidang_ta_id_pendaftaran_key` ON `sidang_ta`(`id_pendaftaran`);

-- AddForeignKey
ALTER TABLE `pendaftaran_ta` ADD CONSTRAINT `pendaftaran_ta_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pendaftaran_ta` ADD CONSTRAINT `pendaftaran_ta_id_topikta_fkey` FOREIGN KEY (`id_topikta`) REFERENCES `topikta`(`id_topikta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sidang_ta` ADD CONSTRAINT `sidang_ta_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sidang_ta` ADD CONSTRAINT `sidang_ta_id_pendaftaran_fkey` FOREIGN KEY (`id_pendaftaran`) REFERENCES `pendaftaran_ta`(`id_pendaftaran`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `pendaftaran_ta_email_user_idx` ON `pendaftaran_ta`(`email_user`);
DROP INDEX `Pendaftaran_TA_email_user_fkey` ON `pendaftaran_ta`;

-- RedefineIndex
CREATE INDEX `pendaftaran_ta_id_topikta_idx` ON `pendaftaran_ta`(`id_topikta`);
DROP INDEX `Pendaftaran_TA_id_topikta_fkey` ON `pendaftaran_ta`;

-- RedefineIndex
CREATE INDEX `sidang_ta_email_user_idx` ON `sidang_ta`(`email_user`);
DROP INDEX `Sidang_TA_email_user_fkey` ON `sidang_ta`;
