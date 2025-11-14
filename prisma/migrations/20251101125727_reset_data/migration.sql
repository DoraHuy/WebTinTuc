-- CreateTable
CREATE TABLE `TaiKhoan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `taiKhoan` VARCHAR(191) NOT NULL,
    `matKhau` VARCHAR(191) NOT NULL,
    `accessToken` VARCHAR(191) NULL,
    `refreshToken` VARCHAR(191) NULL,

    UNIQUE INDEX `TaiKhoan_taiKhoan_key`(`taiKhoan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nguoidungs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenNguoiDung` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `SDT` VARCHAR(191) NULL,
    `biDanh` VARCHAR(191) NULL,
    `diaChi` VARCHAR(191) NULL,
    `gioiTinh` VARCHAR(191) NULL,
    `tk` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `nguoidungs_email_key`(`email`),
    UNIQUE INDEX `nguoidungs_tk_key`(`tk`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NguoiDungVaiTro` (
    `ngayNhan` DATETIME(3) NOT NULL,
    `trangThai` BOOLEAN NOT NULL,
    `ngayHuy` DATETIME(3) NULL,
    `maNguoiDung` INTEGER NOT NULL,
    `maVaiTro` INTEGER NOT NULL,

    PRIMARY KEY (`maNguoiDung`, `maVaiTro`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VaiTros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenVaiTro` VARCHAR(191) NOT NULL,
    `moTaVaiTro` VARCHAR(191) NULL,

    UNIQUE INDEX `VaiTros_tenVaiTro_key`(`tenVaiTro`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permisions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenPermision` VARCHAR(191) NOT NULL,
    `moTa` VARCHAR(191) NULL,

    UNIQUE INDEX `Permisions_tenPermision_key`(`tenPermision`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VaiTroPermision` (
    `maVaiTro` INTEGER NOT NULL,
    `maPermision` INTEGER NOT NULL,
    `ngayNhan` DATETIME(3) NOT NULL,
    `trangThai` BOOLEAN NOT NULL,
    `ngayHuy` DATETIME(3) NULL,

    PRIMARY KEY (`maVaiTro`, `maPermision`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `danhmucs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenDanhMuc` VARCHAR(191) NOT NULL,
    `moTaDanhMuc` VARCHAR(191) NULL,
    `thoiGianTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `thoiGianCapNhat` DATETIME(3) NULL,
    `parentId` INTEGER NULL,

    UNIQUE INDEX `danhmucs_tenDanhMuc_key`(`tenDanhMuc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TinTucs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenTinTuc` VARCHAR(191) NOT NULL,
    `noiDungTinTuc` LONGTEXT NOT NULL,
    `thoiGianDang` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `trangThaiDuyet` BOOLEAN NOT NULL DEFAULT false,
    `trangThaiDang` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `thoiGianChinhSua` DATETIME(3) NULL,
    `tomTat` MEDIUMTEXT NULL,
    `maNguoiDung` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BinhLuans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `noiDungBinhLuan` LONGTEXT NOT NULL,
    `tenNguoiBinhLuan` VARCHAR(191) NULL,
    `trangThaiAnDanh` BOOLEAN NOT NULL DEFAULT false,
    `ngayBinhLuan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngayChinhSua` DATETIME(3) NULL,
    `parentID` INTEGER NULL,
    `maNguoiDung` INTEGER NOT NULL,
    `maTinTuc` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HinhAnhVideos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(255) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NULL,
    `size` INTEGER NOT NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `HinhAnhVideos_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tags` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenTag` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DanhMucsToTinTucs` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DanhMucsToTinTucs_AB_unique`(`A`, `B`),
    INDEX `_DanhMucsToTinTucs_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TagsToTinTucs` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TagsToTinTucs_AB_unique`(`A`, `B`),
    INDEX `_TagsToTinTucs_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `nguoidungs` ADD CONSTRAINT `nguoidungs_tk_fkey` FOREIGN KEY (`tk`) REFERENCES `TaiKhoan`(`taiKhoan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NguoiDungVaiTro` ADD CONSTRAINT `NguoiDungVaiTro_maNguoiDung_fkey` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidungs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NguoiDungVaiTro` ADD CONSTRAINT `NguoiDungVaiTro_maVaiTro_fkey` FOREIGN KEY (`maVaiTro`) REFERENCES `VaiTros`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VaiTroPermision` ADD CONSTRAINT `VaiTroPermision_maVaiTro_fkey` FOREIGN KEY (`maVaiTro`) REFERENCES `VaiTros`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VaiTroPermision` ADD CONSTRAINT `VaiTroPermision_maPermision_fkey` FOREIGN KEY (`maPermision`) REFERENCES `Permisions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `danhmucs` ADD CONSTRAINT `danhmucs_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `danhmucs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TinTucs` ADD CONSTRAINT `TinTucs_maNguoiDung_fkey` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidungs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BinhLuans` ADD CONSTRAINT `BinhLuans_parentID_fkey` FOREIGN KEY (`parentID`) REFERENCES `BinhLuans`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BinhLuans` ADD CONSTRAINT `BinhLuans_maNguoiDung_fkey` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidungs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BinhLuans` ADD CONSTRAINT `BinhLuans_maTinTuc_fkey` FOREIGN KEY (`maTinTuc`) REFERENCES `TinTucs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DanhMucsToTinTucs` ADD CONSTRAINT `_DanhMucsToTinTucs_A_fkey` FOREIGN KEY (`A`) REFERENCES `danhmucs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DanhMucsToTinTucs` ADD CONSTRAINT `_DanhMucsToTinTucs_B_fkey` FOREIGN KEY (`B`) REFERENCES `TinTucs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TagsToTinTucs` ADD CONSTRAINT `_TagsToTinTucs_A_fkey` FOREIGN KEY (`A`) REFERENCES `Tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TagsToTinTucs` ADD CONSTRAINT `_TagsToTinTucs_B_fkey` FOREIGN KEY (`B`) REFERENCES `TinTucs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
