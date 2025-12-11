-- CreateTable
CREATE TABLE `Bookmark` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maNguoiDung` INTEGER NOT NULL,
    `maTinTuc` INTEGER NOT NULL,
    `ngayLuu` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Bookmark_maNguoiDung_maTinTuc_key`(`maNguoiDung`, `maTinTuc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rating` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maNguoiDung` INTEGER NOT NULL,
    `maTinTuc` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL DEFAULT 1,
    `ngayDanhGia` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Rating_maNguoiDung_maTinTuc_key`(`maNguoiDung`, `maTinTuc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_maNguoiDung_fkey` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidungs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_maTinTuc_fkey` FOREIGN KEY (`maTinTuc`) REFERENCES `TinTucs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_maNguoiDung_fkey` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidungs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_maTinTuc_fkey` FOREIGN KEY (`maTinTuc`) REFERENCES `TinTucs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
