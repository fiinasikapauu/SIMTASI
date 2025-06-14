-- CreateTable
CREATE TABLE `User` (
    `email` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `nomorInduk` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MAHASISWA', 'DOSEN') NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_nomorInduk_key`(`nomorInduk`),
    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
