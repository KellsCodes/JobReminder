/*
  Warnings:

  - You are about to drop the column `localDate` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `localHour` on the `Tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Tasks` DROP COLUMN `localDate`,
    DROP COLUMN `localHour`,
    ADD COLUMN `localEndDate` VARCHAR(64) NULL,
    ADD COLUMN `localEndHour` INTEGER NULL,
    ADD COLUMN `localStartDate` VARCHAR(10) NULL,
    ADD COLUMN `localStartHour` INTEGER NULL;
