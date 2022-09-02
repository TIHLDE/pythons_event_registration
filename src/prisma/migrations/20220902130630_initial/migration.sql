-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(60) NOT NULL,
    "positionId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT,
    "time" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "eventTypeSlug" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventType" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EventType_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Registrations" (
    "playerId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "willArrive" BOOLEAN NOT NULL,
    "reason" TEXT,

    CONSTRAINT "Registrations_pkey" PRIMARY KEY ("playerId","eventId")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "expiringDate" TIMESTAMP(3) NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Position_title_key" ON "Position"("title");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventTypeSlug_fkey" FOREIGN KEY ("eventTypeSlug") REFERENCES "EventType"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registrations" ADD CONSTRAINT "Registrations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registrations" ADD CONSTRAINT "Registrations_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
