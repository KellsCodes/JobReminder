/*
  Warnings:

  - You are about to drop the column `emailVerificationToken` on the `EmailVerificationToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `EmailVerificationToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `EmailVerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `EmailVerificationToken_emailVerificationToken_key` ON `EmailVerificationToken`;

-- AlterTable
ALTER TABLE `EmailVerificationToken` DROP COLUMN `emailVerificationToken`,
    ADD COLUMN `token` VARCHAR(256) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `EmailVerificationToken_token_key` ON `EmailVerificationToken`(`token`);
