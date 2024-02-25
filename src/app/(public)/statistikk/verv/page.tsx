import type { Metadata } from 'next';

import { getLeadershipPeriodsPlayers } from '~/functions/getLeadershipPeriodsPlayers';

import { LeadershipHistoryAccordions } from '~/components/leadershipHistory/LeadershipsHistoryAccordion';

export const metadata: Metadata = {
  title: 'Vervhistorikk - TIHLDE Pythons',
};

const LeadershipHistory = async () => {
  const leadershipPeriods = await getLeadershipPeriodsPlayers();

  return leadershipPeriods.length > 0 ? (
    <LeadershipHistoryAccordions adminMode={false} leadershipPeriods={leadershipPeriods} />
  ) : (
    <div className='my-16 text-center'>Det finnes ingen statistikk for vervhistorikk for øyeblikket.</div>
  );
};

export default LeadershipHistory;
