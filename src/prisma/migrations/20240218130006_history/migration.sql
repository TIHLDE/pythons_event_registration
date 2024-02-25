-- CreateEnum
CREATE TYPE "LeadershipRole" AS ENUM ('COACH', 'ASSISTANT_COACH', 'RESERVE_TEAM_COACH', 'TEAM_LEADER', 'FINES_MANAGER', 'SOCIAL_MANAGER', 'FINANCE_MANAGER');

-- CreateEnum
CREATE TYPE "StudyProgramme" AS ENUM ('BIDATA', 'DIGSEC', 'DIGFOR', 'DIGSAM', 'ITBAINFO');

-- CreateTable
CREATE TABLE "LeadershipPeriod" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadershipPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadershipPeriodRole" (
    "id" SERIAL NOT NULL,
    "role" "LeadershipRole" NOT NULL,
    "name" TEXT NOT NULL,
    "studyProgramme" "StudyProgramme" NOT NULL,
    "periodId" INTEGER NOT NULL,

    CONSTRAINT "LeadershipPeriodRole_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LeadershipPeriodRole" ADD CONSTRAINT "LeadershipPeriodRole_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "LeadershipPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
