-- AlterTable
ALTER TABLE `Tasks` ADD COLUMN `localDate` VARCHAR(10) NULL,
    ADD COLUMN `localHour` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Tasks_remindedStart_startAt_idx` ON `Tasks`(`remindedStart`, `startAt`);
