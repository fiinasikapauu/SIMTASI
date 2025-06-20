-- CreateTable
CREATE TABLE `jadwal_sidang_seminar` (
    `id_jadwal` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis_jadwal` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `waktu` DATETIME(3) NOT NULL,
    `admin_id` VARCHAR(191) NOT NULL,

    INDEX `Jadwal_Sidang_Seminar_admin_fkey`(`admin_id`),
    PRIMARY KEY (`id_jadwal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `jadwal_sidang_seminar` ADD CONSTRAINT `jadwal_sidang_seminar_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
