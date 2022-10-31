import CloudSyncIcon from '@mui/icons-material/CloudSyncRounded';
import { NoSsr, styled, Typography } from '@mui/material';

import { useUser } from 'hooks/useUser';

import { StandaloneExpand, StandaloneExpandProps } from 'components/Expand';

export const Pre = styled('pre')(({ theme }) => ({
  color: theme.palette.text.primary,
  background: theme.palette.action.selected,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  overflowX: 'auto',
  userSelect: 'all',
}));

export const CalendarSubscription = (props: Partial<StandaloneExpandProps>) => {
  const { data: user } = useUser();

  return (
    <StandaloneExpand icon={<CloudSyncIcon />} primary='Kalender-abonnement' secondary='Treninger, kamper og sosialt i din kalender' {...props}>
      <Typography variant='body2'>
        Du kan abonnere på din arrangement-kalender slik at nye treninger, kamper og sosiale arrangementer kommer automatisk inn i kalenderen din. Om du melder
        deg av vil arrangementet fjernes fra din kalender. Kopier URLen under og åpne{' '}
        <a href='https://calendar.google.com/calendar/u/0/r/settings/addbyurl' rel='noopener noreferrer' target='_blank'>
          Google Calendar
        </a>
        ,{' '}
        <a href='https://support.apple.com/no-no/guide/calendar/icl1022/mac' rel='noopener noreferrer' target='_blank'>
          Apple Calendar (fremgangsmåte)
        </a>
        ,{' '}
        <a href='https://support.microsoft.com/nb-no/office/cff1429c-5af6-41ec-a5b4-74f2c278e98c' rel='noopener noreferrer' target='_blank'>
          Microsoft Outlook (fremgangsmåte)
        </a>{' '}
        eller en annen kalender for å begynne å abonnere på arrangement-kalenderen din. Hvis arrangementer ikke oppdateres i kalenderen din umiddelbart, så kan
        det være fordi kalenderen sjelden ser etter oppdateringer. Oppdaterings-frekvensen varierer fra kalender til kalender, enkelte oppdateres kun daglig.
      </Typography>
      <NoSsr>
        <Pre>{`${typeof window !== 'undefined' ? window.location.origin : ''}/api/ics/${user?.tihlde_user_id}.ics`}</Pre>
      </NoSsr>
    </StandaloneExpand>
  );
};
