-- AlterEnum
ALTER TYPE "LeadershipRole" ADD VALUE 'SOME_MANAGER';

COMMIT;

INSERT INTO "LeadershipPeriodRole" ("role", "periodId", "playerId")
SELECT 'SOME_MANAGER' as "role", "periodId", "playerId"
FROM "LeadershipPeriodRole" WHERE "role" = 'SOCIAL_MANAGER';
