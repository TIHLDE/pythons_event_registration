import { Link } from '@nextui-org/link';
import { Snippet } from '@nextui-org/snippet';
import { MdOutlineCloudSync } from 'react-icons/md';

import { getSignedInUser } from '~/functions/getUser';

import { StandaloneExpand, StandaloneExpandProps } from '~/components/Expand';

import { ACTIVE_CLUB } from '~/values';

export const CalendarSubscription = async (props: Partial<StandaloneExpandProps>) => {
  const user = await getSignedInUser();

  return (
    <StandaloneExpand
      icon={<MdOutlineCloudSync className='h-6 w-6' />}
      primary='Kalender-abonnement'
      secondary='Treninger, kamper og sosialt i din kalender'
      {...props}>
      <p className='mb-2 text-sm'>
        Du kan abonnere på din arrangement-kalender slik at nye treninger, kamper og sosiale arrangementer kommer automatisk inn i kalenderen din. Om du melder
        deg av vil arrangementet fjernes fra din kalender. Kopier URLen under og åpne{' '}
        <Link href='https://calendar.google.com/calendar/u/0/r/settings/addbyurl' rel='noopener noreferrer' size='sm' target='_blank'>
          Google Calendar
        </Link>
        ,{' '}
        <Link href='https://support.apple.com/no-no/guide/calendar/icl1022/mac' rel='noopener noreferrer' size='sm' target='_blank'>
          Apple Calendar (fremgangsmåte)
        </Link>
        ,{' '}
        <Link href='https://support.microsoft.com/nb-no/office/cff1429c-5af6-41ec-a5b4-74f2c278e98c' rel='noopener noreferrer' size='sm' target='_blank'>
          Microsoft Outlook (fremgangsmåte)
        </Link>{' '}
        eller en annen kalender for å begynne å abonnere på arrangement-kalenderen din. Hvis arrangementer ikke oppdateres i kalenderen din umiddelbart, så kan
        det være fordi kalenderen sjelden ser etter oppdateringer. Oppdaterings-frekvensen varierer fra kalender til kalender, enkelte oppdateres kun daglig.
      </p>
      <Snippet className='w-full' symbol='' variant='bordered'>{`${ACTIVE_CLUB.url}/api/ics/${user?.tihlde_user_id}`}</Snippet>
    </StandaloneExpand>
  );
};
