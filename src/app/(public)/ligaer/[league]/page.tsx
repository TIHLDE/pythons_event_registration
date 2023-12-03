import { redirect } from 'next/navigation';

import { PageProps } from '~/types';

import { ACTIVE_CLUB } from '~/values';

const Leauge = async ({ params }: PageProps<{ league: string }>) => {
  const league = ACTIVE_CLUB.leagues[params.league];
  if (league) {
    return <>{league.content}</>;
  }
  return redirect(`/ligaer`);
};

export default Leauge;
