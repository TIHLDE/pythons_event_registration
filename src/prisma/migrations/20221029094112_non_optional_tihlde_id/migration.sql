/*
  Warnings:

  - Made the column `tihlde_user_id` on table `Player` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "tihlde_user_id" SET NOT NULL;
