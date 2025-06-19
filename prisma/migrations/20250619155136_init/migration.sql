-- CreateTable
CREATE TABLE `feedback` (
    `id_feedback` INTEGER NOT NULL AUTO_INCREMENT,
    `email_user` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `feedback_text` VARCHAR(191) NOT NULL,

    INDEX `Feedback_email_user_fkey`(`email_user`),
    PRIMARY KEY (`id_feedback`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `Feedback_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
