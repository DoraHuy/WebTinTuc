-- AlterTable
ALTER TABLE `tintucs` ADD COLUMN `gia` INTEGER NULL,
    ADD COLUMN `isPremium` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `Cart` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maNguoiDung` INTEGER NOT NULL,
    `maTinTuc` INTEGER NOT NULL,
    `ngayThem` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Cart_maNguoiDung_maTinTuc_key`(`maNguoiDung`, `maTinTuc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maNguoiDung` INTEGER NOT NULL,
    `tongTien` INTEGER NOT NULL,
    `trangThai` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngayCapNhat` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maOrder` INTEGER NOT NULL,
    `maTinTuc` INTEGER NOT NULL,
    `gia` INTEGER NOT NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maOrder` INTEGER NOT NULL,
    `phuongThuc` VARCHAR(191) NOT NULL,
    `soTien` INTEGER NOT NULL,
    `trangThai` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `transactionId` VARCHAR(191) NULL,
    `ngayThanhToan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Payment_maOrder_key`(`maOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RedeemCode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `loaiCode` VARCHAR(191) NOT NULL,
    `giaTri` INTEGER NOT NULL,
    `soLanDung` INTEGER NOT NULL DEFAULT 1,
    `daDung` INTEGER NOT NULL DEFAULT 0,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngayHetHan` DATETIME(3) NULL,
    `nguoiTao` INTEGER NOT NULL,
    `trangThai` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `RedeemCode_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RedeemCodeUsage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maCode` INTEGER NOT NULL,
    `maNguoiDung` INTEGER NOT NULL,
    `ngayDung` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RedeemCodeUsage_maCode_maNguoiDung_key`(`maCode`, `maNguoiDung`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wallet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maNguoiDung` INTEGER NOT NULL,
    `soDu` INTEGER NOT NULL DEFAULT 0,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngayCapNhat` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Wallet_maNguoiDung_key`(`maNguoiDung`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WalletTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maVi` INTEGER NOT NULL,
    `loaiGD` VARCHAR(191) NOT NULL,
    `soTien` INTEGER NOT NULL,
    `moTa` VARCHAR(191) NULL,
    `ngayGD` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchasedPost` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maNguoiDung` INTEGER NOT NULL,
    `maTinTuc` INTEGER NOT NULL,
    `ngayMua` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `gia` INTEGER NOT NULL,

    UNIQUE INDEX `PurchasedPost_maNguoiDung_maTinTuc_key`(`maNguoiDung`, `maTinTuc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostSubmission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tieuDe` VARCHAR(191) NOT NULL,
    `noiDung` LONGTEXT NOT NULL,
    `hinhAnh` VARCHAR(191) NULL,
    `isPremium` BOOLEAN NOT NULL DEFAULT false,
    `maNguoiDung` INTEGER NOT NULL,
    `trangThai` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `maCodeTao` INTEGER NULL,
    `ngayGui` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngayDuyet` DATETIME(3) NULL,
    `nguoiDuyet` INTEGER NULL,
    `ghiChu` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_maNguoiDung_fkey` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidungs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_maTinTuc_fkey` FOREIGN KEY (`maTinTuc`) REFERENCES `TinTucs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_maNguoiDung_fkey` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidungs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_maOrder_fkey` FOREIGN KEY (`maOrder`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_maTinTuc_fkey` FOREIGN KEY (`maTinTuc`) REFERENCES `TinTucs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_maOrder_fkey` FOREIGN KEY (`maOrder`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RedeemCode` ADD CONSTRAINT `RedeemCode_nguoiTao_fkey` FOREIGN KEY (`nguoiTao`) REFERENCES `nguoidungs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RedeemCodeUsage` ADD CONSTRAINT `RedeemCodeUsage_maCode_fkey` FOREIGN KEY (`maCode`) REFERENCES `RedeemCode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RedeemCodeUsage` ADD CONSTRAINT `RedeemCodeUsage_maNguoiDung_fkey` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidungs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wallet` ADD CONSTRAINT `Wallet_maNguoiDung_fkey` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidungs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WalletTransaction` ADD CONSTRAINT `WalletTransaction_maVi_fkey` FOREIGN KEY (`maVi`) REFERENCES `Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchasedPost` ADD CONSTRAINT `PurchasedPost_maNguoiDung_fkey` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidungs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchasedPost` ADD CONSTRAINT `PurchasedPost_maTinTuc_fkey` FOREIGN KEY (`maTinTuc`) REFERENCES `TinTucs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostSubmission` ADD CONSTRAINT `PostSubmission_maNguoiDung_fkey` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidungs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
