-- CreateTable
CREATE TABLE `ReminderLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `taskId` INTEGER NOT NULL,
    `reminderType` ENUM('BEFORE_24H', 'BEFORE_1H', 'AT_START', 'BEFORE_1H_END', 'AT_END') NOT NULL,
    `sentAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ReminderLog_sentAt_idx`(`sentAt`),
    UNIQUE INDEX `ReminderLog_taskId_reminderType_key`(`taskId`, `reminderType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ReminderLog` ADD CONSTRAINT `ReminderLog_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Tasks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
