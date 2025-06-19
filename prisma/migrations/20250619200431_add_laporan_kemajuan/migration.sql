-- CreateTable
CREATE TABLE `laporan_kemajuan` (
    `id_laporan` INTEGER NOT NULL AUTO_INCREMENT,
    `email_user` VARCHAR(191) NOT NULL,
    `file_proposal` VARCHAR(191) NOT NULL,
    `tanggal_upload` DATETIME(3) NOT NULL,
    `status_review` VARCHAR(191) NOT NULL,
    `feedback_dosen` VARCHAR(191) NOT NULL,

    INDEX `Laporan_Kemajuan_email_user_fkey`(`email_user`),
    PRIMARY KEY (`id_laporan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `laporan_kemajuan` ADD CONSTRAINT `Laporan_Kemajuan_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
