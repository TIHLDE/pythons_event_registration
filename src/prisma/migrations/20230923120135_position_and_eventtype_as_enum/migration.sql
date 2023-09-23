-- CreateEnum
CREATE TYPE "PositionEnum" AS ENUM ('KEEPER', 'BACK', 'CENTER_BACK', 'MIDTFIELDER', 'WINGER', 'STRIKER');

-- CreateEnum
CREATE TYPE "EventTypeEnum" AS ENUM ('TRAINING', 'MATCH', 'SOCIAL');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "eventType" "EventTypeEnum" NOT NULL DEFAULT 'SOCIAL';

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "positionEnum" "PositionEnum" NOT NULL DEFAULT 'KEEPER';

update "Event"
set "eventType" = case 
  when "eventTypeSlug" = 'trening' then 'TRAINING'::"EventTypeEnum"
  when "eventTypeSlug" = 'kamp' then 'MATCH'::"EventTypeEnum"
  when "eventTypeSlug" = 'sosialt' then 'SOCIAL'::"EventTypeEnum"
END;

update "Player"
set "positionEnum" = case 
  when "positionId" = 1 then 'KEEPER'::"PositionEnum"
  when "positionId" = 2 then 'BACK'::"PositionEnum"
  when "positionId" = 3 then 'CENTER_BACK'::"PositionEnum"
  when "positionId" = 4 then 'MIDTFIELDER'::"PositionEnum"
  when "positionId" = 5 then 'WINGER'::"PositionEnum"
  when "positionId" = 6 then 'STRIKER'::"PositionEnum"
END;
