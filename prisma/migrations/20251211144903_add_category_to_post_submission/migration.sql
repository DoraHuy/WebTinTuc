-- AlterTable
ALTER TABLE `postsubmission` ADD COLUMN `maDanhMuc` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `PostSubmission` ADD CONSTRAINT `PostSubmission_maDanhMuc_fkey` FOREIGN KEY (`maDanhMuc`) REFERENCES `danhmucs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
