-- CreateTable
CREATE TABLE `Tasks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(256) NOT NULL,
    `startAt` DATETIME(3) NOT NULL,
    `endAt` DATETIME(3) NOT NULL,
    `timeZone` VARCHAR(64) NOT NULL,
    `reminded24h` BOOLEAN NOT NULL DEFAULT false,
    `reminded1hStart` BOOLEAN NOT NULL DEFAULT false,
    `reminded1hEnd` BOOLEAN NOT NULL DEFAULT false,
    `remindedEnd` BOOLEAN NOT NULL DEFAULT false,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Tasks_reminded24h_startAt_idx`(`reminded24h`, `startAt`),
    INDEX `Tasks_reminded1hStart_startAt_idx`(`reminded1hStart`, `startAt`),
    INDEX `Tasks_reminded1hEnd_endAt_idx`(`reminded1hEnd`, `endAt`),
    INDEX `Tasks_remindedEnd_endAt_idx`(`remindedEnd`, `endAt`),
    INDEX `Tasks_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tasks` ADD CONSTRAINT `Tasks_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
