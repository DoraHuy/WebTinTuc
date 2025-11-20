/*
  Warnings:

  - You are about to drop the column `trangThaiDang` on the `tintucs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tintucs` DROP COLUMN `trangThaiDang`,
    ADD COLUMN `ngayDang` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `trangThaiDuyet` BOOLEAN NULL;

-- CreateTable
CREATE TABLE `KhoLuuTin` (
    `id` INTEGER NOT NULL,
    `thoiGianTao` DATETIME(3) NOT NULL,
    `tenKhoLuuTru` VARCHAR(191) NOT NULL,
    `moTaKho` VARCHAR(191) NULL,
    `idNguoiDung` INTEGER NOT NULL,

    UNIQUE INDEX `KhoLuuTin_tenKhoLuuTru_key`(`tenKhoLuuTru`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_KhoLuuTinToTinTucs` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_KhoLuuTinToTinTucs_AB_unique`(`A`, `B`),
    INDEX `_KhoLuuTinToTinTucs_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `KhoLuuTin` ADD CONSTRAINT `KhoLuuTin_idNguoiDung_fkey` FOREIGN KEY (`idNguoiDung`) REFERENCES `nguoidungs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_KhoLuuTinToTinTucs` ADD CONSTRAINT `_KhoLuuTinToTinTucs_A_fkey` FOREIGN KEY (`A`) REFERENCES `KhoLuuTin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_KhoLuuTinToTinTucs` ADD CONSTRAINT `_KhoLuuTinToTinTucs_B_fkey` FOREIGN KEY (`B`) REFERENCES `TinTucs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
