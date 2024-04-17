import { LeadershipRole } from '@prisma/client';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { ReactNode, useMemo } from 'react';
import { BiSolidParty } from 'react-icons/bi';
import { FaMoneyBillWave, FaUser, FaUserFriends, FaUserTie } from 'react-icons/fa';
import { FaMoneyBillTrendUp, FaPeopleGroup } from 'react-icons/fa6';
import { PiNumberCircleSevenFill } from 'react-icons/pi';
import { TiSocialInstagram } from 'react-icons/ti';

import { LeadershipPeriodWithDetails } from '~/functions/getLeadershipPeriodsPlayers';

import { StandaloneExpand } from '~/components/Expand';
import { EditLeadershipPeriod } from '~/components/leadershipHistory/EditLeadershipPeriod';
import EditLeadershipRoleModal from '~/components/leadershipHistory/EditLeadershipRoleModal';
import { LeadershipPeriodDelete } from '~/components/leadershipHistory/LeadershipPeriodDelete';
import NewLeadershipRoleModal from '~/components/leadershipHistory/NewLeadershipRoleModal';

import { leadershipRolesList, leadershipRolesMap } from '~/utils';

const roleIcon: Record<LeadershipRole, ReactNode> = {
  [LeadershipRole.COACH]: <FaUser />,
  [LeadershipRole.ASSISTANT_COACH]: <FaUserFriends />,
  [LeadershipRole.RESERVE_TEAM_COACH]: <PiNumberCircleSevenFill />,
  [LeadershipRole.TEAM_LEADER]: <FaUserTie />,
  [LeadershipRole.FINES_MANAGER]: <FaMoneyBillWave />,
  [LeadershipRole.SOCIAL_MANAGER]: <BiSolidParty />,
  [LeadershipRole.SOME_MANAGER]: <TiSocialInstagram />,
  [LeadershipRole.FINANCE_MANAGER]: <FaMoneyBillTrendUp />,
};

export type LeadershipHistoryAccordionsProps = {
  leadershipPeriods: LeadershipPeriodWithDetails[];
  adminMode?: boolean;
};

export const LeadershipHistoryAccordions = ({ leadershipPeriods, adminMode = false }: LeadershipHistoryAccordionsProps) => {
  if (leadershipPeriods.length === 0) {
    return <p className='my-16 text-center'>Det finnes ingen statistikk for vervhistorikk for øyeblikket.</p>;
  }
  return (
    <>
      {leadershipPeriods.map((period, index) => (
        <LeadershipHistoryAccordion
          adminMode={adminMode}
          key={period.id}
          period={period}
          periodNr={leadershipPeriods.length - index}
          prevPeriod={leadershipPeriods[index + 1]}
        />
      ))}
    </>
  );
};

type LeadershipHistoryAccordionProps = {
  period: LeadershipPeriodWithDetails;
  periodNr: number;
  prevPeriod?: LeadershipPeriodWithDetails;
  adminMode?: boolean;
};

const LeadershipHistoryAccordion = ({ period, periodNr, prevPeriod, adminMode = false }: LeadershipHistoryAccordionProps) => {
  const formattedStartDate = format(new Date(period.startDate), 'MMM yyyy', { locale: nb });
  const formattedEndDate = format(new Date(period.endDate), 'MMM yyyy', { locale: nb });

  const currentRoles = useMemo(
    () =>
      period.leadershipPeriodRole
        .map((role) => ({
          ...role,
          ...leadershipRolesMap[role.role],
          reElected: prevPeriod?.leadershipPeriodRole.some((prevRole) => prevRole.playerId === role.playerId && prevRole.role === role.role),
        }))
        .sort((a, b) => a.order - b.order),
    [period.leadershipPeriodRole, prevPeriod?.leadershipPeriodRole],
  );

  const missingRoles = useMemo(
    () => leadershipRolesList.filter((role) => !currentRoles.some((currentRole) => role.label === currentRole.label)),
    [currentRoles],
  );

  return (
    <StandaloneExpand
      className='mb-2'
      icon={<FaPeopleGroup className='h-6 w-6' />}
      primary={`Styre nr. ${periodNr} ${!prevPeriod ? '(Founding Fathers)' : ''}`}
      secondary={`Fra ${formattedStartDate} til ${formattedEndDate}`}>
      <div className='flex flex-col gap-2'>
        {currentRoles.length > 0
          ? currentRoles.map((role) => {
              const RoleIcon = roleIcon[role.role];
              return (
                <div className='m-1 flex items-center gap-2' key={role.id}>
                  {adminMode && <EditLeadershipRoleModal id={role.id} player={role.player} role={role.label} />}
                  {RoleIcon}
                  <span>
                    <span className='font-light'>{role.label}</span>: <span className='text-[hsl(var(--pythons-primary)/1)]'>{role.player.name}</span>
                    {role.reElected && <span className='text-[hsl(var(--pythons-primary-200)/1)]'> (Gjenvalgt)</span>}
                  </span>
                </div>
              );
            })
          : 'Dette styret har ingen registrerte roller'}
        {adminMode && (
          <>
            {missingRoles.length > 0 && <NewLeadershipRoleModal missingRoles={missingRoles} periodId={period.id} />}
            <EditLeadershipPeriod endDate={period.endDate} id={period.id} startDate={period.startDate} />
            <LeadershipPeriodDelete id={period.id} />
          </>
        )}
      </div>
    </StandaloneExpand>
  );
};
