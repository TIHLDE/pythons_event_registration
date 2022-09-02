-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "teamId" INTEGER;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "teamId" INTEGER;

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
