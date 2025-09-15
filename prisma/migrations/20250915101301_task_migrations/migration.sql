/*
  Warnings:

  - You are about to drop the column `reminded1hEnd` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `reminded1hStart` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `reminded24h` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `remindedEnd` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `remindedStart` on the `Tasks` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Tasks_reminded1hEnd_endAt_idx` ON `Tasks`;

-- DropIndex
DROP INDEX `Tasks_reminded1hStart_startAt_idx` ON `Tasks`;

-- DropIndex
DROP INDEX `Tasks_reminded24h_startAt_idx` ON `Tasks`;

-- DropIndex
DROP INDEX `Tasks_remindedEnd_endAt_idx` ON `Tasks`;

-- DropIndex
DROP INDEX `Tasks_remindedStart_startAt_idx` ON `Tasks`;

-- AlterTable
ALTER TABLE `Tasks` DROP COLUMN `reminded1hEnd`,
    DROP COLUMN `reminded1hStart`,
    DROP COLUMN `reminded24h`,
    DROP COLUMN `remindedEnd`,
    DROP COLUMN `remindedStart`;

-- CreateIndex
CREATE INDEX `Tasks_status_startAt_idx` ON `Tasks`(`status`, `startAt`);

-- CreateIndex
CREATE INDEX `Tasks_status_endAt_idx` ON `Tasks`(`status`, `endAt`);
