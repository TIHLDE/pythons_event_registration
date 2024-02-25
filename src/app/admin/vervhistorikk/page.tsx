import { LeadershipPeriod, LeadershipPeriodRole } from '@prisma/client';

import { getLeadershipPeriodsPlayers } from '~/functions/getLeadershipPeriodsPlayers';

import { LeadershipHistoryAccordions } from '~/components/leadershipHistory/LeadershipsHistoryAccordion';
import { NewLeadershipPeriod } from '~/components/leadershipHistory/NewLeadershipPeriod';

export type LeadershipPeriodRoleWithPlayer = LeadershipPeriodRole & {
  player: { id: number; name: string };
};

export type LeadershipPeriodWithRoles = LeadershipPeriod & {
  leadershipPeriodRole: LeadershipPeriodRoleWithPlayer[];
};

const LeadershipHistoryAdmin = async () => {
  const leadershipPeriods = await getLeadershipPeriodsPlayers();

  return (
    <>
      <NewLeadershipPeriod />
      <div className='mt-6 flex flex-col gap-2'>
        {leadershipPeriods.length > 0 ? (
          <LeadershipHistoryAccordions adminMode leadershipPeriods={leadershipPeriods} />
        ) : (
          <div className='my-16 text-center'>Det finnes ingen statistikk for vervhistorikk for øyeblikket.</div>
        )}
      </div>
    </>
  );
};

export default LeadershipHistoryAdmin;
