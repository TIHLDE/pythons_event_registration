import { redirect } from 'next/navigation';

import { ACTIVE_CLUB } from '~/values';

const DEFAULT_LEAGUE = Object.keys(ACTIVE_CLUB.leagues)[0];

const Leauge = async () => redirect(DEFAULT_LEAGUE ? `/ligaer/${DEFAULT_LEAGUE}` : '/');

export default Leauge;
