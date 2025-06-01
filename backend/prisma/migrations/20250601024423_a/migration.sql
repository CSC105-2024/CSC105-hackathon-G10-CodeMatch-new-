/*
  Warnings:

  - You are about to drop the `GameScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MatchedCardPair` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Card` DROP FOREIGN KEY `Card_matchId_fkey`;

-- DropForeignKey
ALTER TABLE `GameScore` DROP FOREIGN KEY `GameScore_gameModeId_fkey`;

-- DropForeignKey
ALTER TABLE `GameScore` DROP FOREIGN KEY `GameScore_userId_fkey`;

-- DropForeignKey
ALTER TABLE `MatchedCardPair` DROP FOREIGN KEY `MatchedCardPair_card1Id_fkey`;

-- DropForeignKey
ALTER TABLE `MatchedCardPair` DROP FOREIGN KEY `MatchedCardPair_card2Id_fkey`;

-- DropForeignKey
ALTER TABLE `MatchedCardPair` DROP FOREIGN KEY `MatchedCardPair_gameId_fkey`;

-- DropIndex
DROP INDEX `Card_matchId_fkey` ON `Card`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `liveScore` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `GameScore`;

-- DropTable
DROP TABLE `MatchedCardPair`;
