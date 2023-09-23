/*
  Warnings:

  - You are about to drop the column `eventTypeSlug` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `positionId` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the `EventType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Position` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_eventTypeSlug_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_positionId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "eventTypeSlug";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "positionId";

-- DropTable
DROP TABLE "EventType";

-- DropTable
DROP TABLE "Position";

-- Rename Enum
ALTER TYPE "PositionEnum" RENAME TO "Position";

-- Rename Enum
ALTER TYPE "EventTypeEnum" RENAME TO "EventType";

-- RenameColumn
ALTER TABLE "Player" RENAME COLUMN "positionEnum" TO "position";
