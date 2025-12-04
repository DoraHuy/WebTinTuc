/*
  Warnings:

  - A unique constraint covering the columns `[maCodeTao]` on the table `PostSubmission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `PostSubmission_maCodeTao_key` ON `PostSubmission`(`maCodeTao`);

-- AddForeignKey
ALTER TABLE `PostSubmission` ADD CONSTRAINT `PostSubmission_maCodeTao_fkey` FOREIGN KEY (`maCodeTao`) REFERENCES `RedeemCode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
