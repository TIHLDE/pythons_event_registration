import type { EventType } from '@prisma/client';
import { MdGavel } from 'react-icons/md';

import { StandaloneExpand, StandaloneExpandProps } from '~/components/Expand';

import { eventTypesMap } from '~/utils';
import { ACTIVE_CLUB, Rule } from '~/values';

const amountToText = (amount: number) => `${amount} ${amount > 1 ? 'bøter' : 'bot'}`;

const createRuleDescription = (rule: Rule) => {
  const lines = [];
  lines.push(
    `Påmeldingsfrist: ${rule.deadlines.signupBefore} timer før${
      rule.deadlines.signupBefore > 23 ? ` (${Math.floor(rule.deadlines.signupBefore / 24)} dager)` : ''
    }`,
  );
  lines.push(`- Manglende påmelding: ${amountToText(rule.fines.noRegistration.amount)} (${rule.fines.noRegistration.paragraph})`);
  lines.push(`- Påmelding etter frist: ${amountToText(rule.fines.tooLateRegistration.amount)} (${rule.fines.tooLateRegistration.paragraph})`);
  if (rule.fines.tooLateRegistrationNotAttending) {
    lines.push(
      `- Påmelding etter frist og kommer ikke: ${amountToText(rule.fines.tooLateRegistrationNotAttending.amount)} (${
        rule.fines.tooLateRegistrationNotAttending.paragraph
      })`,
    );
  }
  if (rule.fines.registrationNotAttending) {
    lines.push(`- Kommer ikke: ${amountToText(rule.fines.registrationNotAttending.amount)} (${rule.fines.registrationNotAttending.paragraph})`);
  }
  return lines.join(`\n`);
};

export const RulesOverview = async (props: Partial<StandaloneExpandProps>) => {
  return (
    <StandaloneExpand
      icon={<MdGavel className='h-6 w-6' />}
      primary='Påmeldingsregler'
      secondary='Gjeldene frister for påmelding og tilhørende bøtesatser'
      {...props}>
      {Object.entries(ACTIVE_CLUB.rules).map(([eventType, rule]) => (
        <div className='mb-2' key={eventType}>
          <h4 className='font-bold'>{eventTypesMap[eventType as EventType].label}</h4>
          <p className='ml-2 whitespace-break-spaces text-sm'>{createRuleDescription(rule)}</p>
        </div>
      ))}
      <p className='mt-4 text-xs'>
        Du får maks bot fra én regel per arrangement. Om du kvalifiserer til bot fra flere regler på samme arrangement vil du kun få bot fra den øverste regelen
        i listen over
      </p>
    </StandaloneExpand>
  );
};
