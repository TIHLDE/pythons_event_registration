import type { Metadata } from 'next';

import { getLeadershipPeriodsPlayers } from '~/functions/getLeadershipPeriodsPlayers';

import { LeadershipHistoryAccordions } from '~/components/leadershipHistory/LeadershipsHistoryAccordion';

export const metadata: Metadata = {
  title: 'Vervhistorikk - TIHLDE Pythons',
};

const LeadershipHistory = async () => {
  const leadershipPeriods = await getLeadershipPeriodsPlayers();

  return <LeadershipHistoryAccordions leadershipPeriods={leadershipPeriods} />;
};

export default LeadershipHistory;
