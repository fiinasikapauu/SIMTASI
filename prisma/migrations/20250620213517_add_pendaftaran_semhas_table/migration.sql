-- CreateTable
CREATE TABLE `pendaftaran_semhas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email_user` VARCHAR(191) NOT NULL,
    `tanggal_seminar` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `waktu_pendaftaran` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `pendaftaran_semhas_email_user_idx`(`email_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pendaftaran_semhas` ADD CONSTRAINT `pendaftaran_semhas_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
