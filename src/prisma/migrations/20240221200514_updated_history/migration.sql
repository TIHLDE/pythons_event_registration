/*
  Warnings:

  - You are about to drop the column `name` on the `LeadershipPeriodRole` table. All the data in the column will be lost.
  - You are about to drop the column `studyProgramme` on the `LeadershipPeriodRole` table. All the data in the column will be lost.
  - Added the required column `playerId` to the `LeadershipPeriodRole` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeadershipPeriodRole" DROP COLUMN "name",
DROP COLUMN "studyProgramme",
ADD COLUMN     "playerId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "StudyProgramme";

-- AddForeignKey
ALTER TABLE "LeadershipPeriodRole" ADD CONSTRAINT "LeadershipPeriodRole_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
