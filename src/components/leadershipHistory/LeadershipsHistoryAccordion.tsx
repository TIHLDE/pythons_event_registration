import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { BiSolidParty } from 'react-icons/bi';
import { FaMoneyBillWave, FaUser, FaUserFriends, FaUserTie } from 'react-icons/fa';
import { FaMoneyBillTrendUp, FaPeopleGroup } from 'react-icons/fa6';
import { PiNumberCircleSevenFill } from 'react-icons/pi';

import { LeadershipPeriodWithDetails } from '~/functions/getLeadershipPeriodsPlayers';

import { StandaloneExpand } from '~/components/Expand';
import { EditLeadershipPeriod } from '~/components/leadershipHistory/EditLeadershipPeriod';
import EditLeadershipRoleModal from '~/components/leadershipHistory/EditLeadershipRoleModal';
import { LeadershipPeriodDelete } from '~/components/leadershipHistory/LeadershipPeriodDelete';
import NewLeadershipRoleModal from '~/components/leadershipHistory/NewLeadershipRoleModal';

import { leadershipRolesList, leadershipRolesMap } from '~/utils';

const iconComponents = {
  IconCoach: <FaUser />,
  IconAssistantCoach: <FaUserFriends />,
  IconReserveTeamCoach: <PiNumberCircleSevenFill />,
  IconTeamLeader: <FaUserTie />,
  IconFinesManager: <FaMoneyBillWave />,
  IconSocialManager: <BiSolidParty />,
  IconFinanceManager: <FaMoneyBillTrendUp />,
};

export const LeadershipHistoryAccordions = ({
  leadershipPeriods,
  adminMode = false,
}: {
  leadershipPeriods: LeadershipPeriodWithDetails[];
  adminMode: boolean;
}) => {
  return (
    <>
      {leadershipPeriods.map((period, index) => {
        const formattedStartDate = format(new Date(period.startDate), 'MMM yyyy', { locale: nb });
        const formattedEndDate = format(new Date(period.endDate), 'MMM yyyy', { locale: nb });

        const currentRoles = period.leadershipPeriodRole
          .map((role) => ({
            ...role,
            ...leadershipRolesMap[role.role],
            reElected:
              index + 1 < leadershipPeriods.length &&
              leadershipPeriods[index + 1].leadershipPeriodRole.some((prevRole) => prevRole.playerId === role.playerId && prevRole.role === role.role),
          }))
          .sort((a, b) => a.order - b.order);

        const missingRoles = leadershipRolesList.filter((role) => !currentRoles.some((currentRole) => role.label === currentRole.label));

        return (
          <StandaloneExpand
            className='mb-4'
            icon={<FaPeopleGroup className='h-6 w-6' />}
            key={period.id}
            primary={`Styre nr. ${leadershipPeriods.length - index} ${index + 1 === leadershipPeriods.length ? '(Founding Fathers)' : ''}`}
            secondary={`Fra ${formattedStartDate} til ${formattedEndDate}`}>
            <div className='flex flex-col gap-2'>
              {currentRoles.length > 0
                ? currentRoles.map((role) => {
                    const RoleIcon = iconComponents[role.icon as keyof typeof iconComponents] || <FaUser />;
                    return (
                      <div className='m-1 flex items-center gap-2' key={role.id}>
                        {adminMode && <EditLeadershipRoleModal id={role.id} player={role.player} role={role.label} />}
                        {RoleIcon}
                        <span>
                          <span className='font-light'>{role.label}</span>: <span className='text-violet-400'>{role.player.name}</span>
                          {role.reElected && <span className='text-violet-200'> (Gjenvalgt)</span>}
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
      })}
    </>
  );
};
