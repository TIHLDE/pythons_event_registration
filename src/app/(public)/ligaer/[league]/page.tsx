import { startOfHour } from 'date-fns';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { PageProps } from '~/types';

const Leauge = async ({ params }: PageProps<{ league: string }>) => {
  const league = params.league;
  if (league === 'tsff') {
    return (
      <>
        <Image
          alt='TSFF tabell'
          className='mx-auto mb-4 max-h-unit-9xl w-auto rounded-md'
          height={1200}
          src={`https://raw.githubusercontent.com/tsff1/tables/main/Scripts/Output/H23/Avd_A_table.png?v=${startOfHour(new Date()).getTime()}`}
          width={850}
        />
        <iframe
          className='mb-4 rounded-md border-none'
          height='750'
          src='https://docs.google.com/spreadsheets/d/e/2PACX-1vQfKRznqZffHTSv1da8lbuuwrklrrQVrwBLsaZdhFeH860KhFmPWnP88z5uoNCSjUjXiZa5dIB16IRg/pubhtml/sheet?gid=0'
          width='100%'
        />
        <p className='text-center text-sm italic'>Hentet fra tsff.no</p>
      </>
    );
  }
  if (league === '7dentligaen') {
    return (
      <>
        <iframe
          className='mb-4 rounded-md border-none'
          height='750'
          src='https://wp.nif.no/PageTournamentDetailWithMatches.aspx?tournamentId=422366&seasonId=201017&number=all'
          width='100%'
        />
        <p className='text-center text-sm italic'>Hentet fra 7dentligaen</p>
      </>
    );
  }
  return redirect(`/ligaer`);
};

export default Leauge;
