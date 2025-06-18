-- CreateTable
CREATE TABLE `topikta` (
    `id_topikta` INTEGER NOT NULL AUTO_INCREMENT,
    `topik` VARCHAR(255) NOT NULL,
    `dosen` VARCHAR(255) NOT NULL,
    `waktu` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_topikta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `email_user` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `nomorInduk` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MAHASISWA', 'DOSEN') NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `beban_bimbingan` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `User_nomorInduk_key`(`nomorInduk`),
    PRIMARY KEY (`email_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kalender_sidang` (
    `id_kalender` INTEGER NOT NULL AUTO_INCREMENT,
    `email_user` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `jenis_sidang` VARCHAR(191) NOT NULL,

    INDEX `Kalender_Sidang_email_user_fkey`(`email_user`),
    PRIMARY KEY (`id_kalender`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `konsultasi` (
    `id_konsultasi` INTEGER NOT NULL AUTO_INCREMENT,
    `email_user` VARCHAR(191) NOT NULL,
    `tanggal_konsultasi` DATETIME(3) NOT NULL,
    `topik_konsultasi` VARCHAR(191) NOT NULL,
    `dosen_pembimbing` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    INDEX `Konsultasi_email_user_fkey`(`email_user`),
    PRIMARY KEY (`id_konsultasi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pendaftaran_ta` (
    `id_pendaftaran` INTEGER NOT NULL AUTO_INCREMENT,
    `email_user` VARCHAR(191) NOT NULL,
    `id_topikta` INTEGER NOT NULL,
    `tanggal_daftar` DATETIME(3) NOT NULL,
    `status_approval` VARCHAR(191) NOT NULL,
    `id_dosen_pembimbing` VARCHAR(191) NOT NULL,

    INDEX `Pendaftaran_TA_email_user_fkey`(`email_user`),
    INDEX `Pendaftaran_TA_id_topikta_fkey`(`id_topikta`),
    PRIMARY KEY (`id_pendaftaran`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proposal_ta` (
    `id_proposal` INTEGER NOT NULL AUTO_INCREMENT,
    `email_user` VARCHAR(191) NOT NULL,
    `file_proposal` VARCHAR(191) NOT NULL,
    `tanggal_upload` DATETIME(3) NOT NULL,
    `status_review` VARCHAR(191) NOT NULL,
    `feedback_dosen` VARCHAR(191) NOT NULL,

    INDEX `Proposal_TA_email_user_fkey`(`email_user`),
    PRIMARY KEY (`id_proposal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `revisi_laporan` (
    `id_revisi` INTEGER NOT NULL AUTO_INCREMENT,
    `email_user` VARCHAR(191) NOT NULL,
    `file_laporan` VARCHAR(191) NOT NULL,
    `tanggal_upload` DATETIME(3) NOT NULL,
    `feedback_dosen` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    INDEX `Revisi_Laporan_email_user_fkey`(`email_user`),
    PRIMARY KEY (`id_revisi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seminar_hasil` (
    `id_semhas` INTEGER NOT NULL AUTO_INCREMENT,
    `email_user` VARCHAR(191) NOT NULL,
    `file_draft` VARCHAR(191) NOT NULL,
    `tanggal_daftar` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `jadwal` DATETIME(3) NOT NULL,

    INDEX `Seminar_Hasil_email_user_fkey`(`email_user`),
    PRIMARY KEY (`id_semhas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sidang_ta` (
    `id_sidang` INTEGER NOT NULL AUTO_INCREMENT,
    `email_user` VARCHAR(191) NOT NULL,
    `file_draft_sidang` VARCHAR(191) NOT NULL,
    `tanggal_daftar` DATETIME(3) NOT NULL,
    `jadwal` DATETIME(3) NOT NULL,
    `nilai_akhir` DOUBLE NOT NULL,

    INDEX `Sidang_TA_email_user_fkey`(`email_user`),
    PRIMARY KEY (`id_sidang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `timeline_project` (
    `id_timeline` INTEGER NOT NULL AUTO_INCREMENT,
    `email_user` VARCHAR(191) NOT NULL,
    `tahapan` VARCHAR(191) NOT NULL,
    `tanggal_mulai` DATETIME(3) NOT NULL,
    `tanggal_selesai` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    INDEX `Timeline_Project_email_user_fkey`(`email_user`),
    PRIMARY KEY (`id_timeline`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `kalender_sidang` ADD CONSTRAINT `Kalender_Sidang_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `konsultasi` ADD CONSTRAINT `Konsultasi_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pendaftaran_ta` ADD CONSTRAINT `Pendaftaran_TA_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pendaftaran_ta` ADD CONSTRAINT `Pendaftaran_TA_id_topikta_fkey` FOREIGN KEY (`id_topikta`) REFERENCES `topikta`(`id_topikta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proposal_ta` ADD CONSTRAINT `Proposal_TA_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `revisi_laporan` ADD CONSTRAINT `Revisi_Laporan_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seminar_hasil` ADD CONSTRAINT `Seminar_Hasil_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sidang_ta` ADD CONSTRAINT `Sidang_TA_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `timeline_project` ADD CONSTRAINT `Timeline_Project_email_user_fkey` FOREIGN KEY (`email_user`) REFERENCES `user`(`email_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
