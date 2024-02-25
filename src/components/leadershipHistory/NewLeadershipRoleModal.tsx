'use client';

import { Button } from '@nextui-org/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Select, SelectItem } from '@nextui-org/react';
import { useDisclosure } from '@nextui-org/use-disclosure';
import { LeadershipPeriod, LeadershipPeriodRole } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { usePlayers } from '~/hooks/useQuery';

type LeadershipRole = { type: string; label: string; order: number; icon: string };

export type NewLeadershipRoleModalProps = {
  periodId: number;
  missingRoles: LeadershipRole[];
};

type FormDataProps = {
  role: LeadershipPeriodRole['role'];
  playerId: LeadershipPeriodRole['playerId'];
  periodId: LeadershipPeriod['id'];
};

const NewLeadershipRoleModal = ({ periodId, missingRoles }: NewLeadershipRoleModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const { data: players = [], isLoading: isPlayersLoading } = usePlayers({ enabled: true });

  const { control, handleSubmit, reset } = useForm<FormDataProps>();

  const onSubmit = useCallback(
    async (formData: FormDataProps) => {
      if (formData.playerId !== undefined) {
        const data: { role: LeadershipPeriodRole['role']; playerId: LeadershipPeriodRole['playerId']; periodId: LeadershipPeriod['id'] } = {
          ...formData,
          playerId: Number(formData.playerId),
          periodId: periodId,
        };
        await axios.post(`/api/leadershipperiod/newrole`, { data: data });
        onClose();
        reset();
        router.refresh();
      }
    },
    [onClose, periodId, reset, router],
  );

  if (isPlayersLoading) {
    return;
  }

  return (
    <>
      <Button color='primary' onClick={onOpen} variant='bordered'>
        Legg til ny rolle
      </Button>
      <Modal hideCloseButton isOpen={isOpen} onClose={onClose} scrollBehavior='inside'>
        <ModalContent as='form' onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Ny rolle</ModalHeader>
          <ModalBody className='flex flex-col gap-4'>
            <Controller
              control={control}
              name='role'
              render={({ field: { onChange, value } }) => (
                <Select
                  isRequired
                  items={missingRoles}
                  label='Rolle'
                  onChange={(e) => onChange(e.target.value)}
                  selectedKeys={new Set(value ? [value] : [])}
                  variant='faded'>
                  {(role) => (
                    <SelectItem key={role.type} value={role.type}>
                      {role.label}
                    </SelectItem>
                  )}
                </Select>
              )}
              rules={{ required: 'Du må velge en rolle' }}
            />
            <Controller
              control={control}
              name='playerId'
              render={({ field: { onChange, value } }) => (
                <Select
                  isRequired
                  items={[...players]}
                  label='Spiller'
                  onChange={(e) => onChange(e.target.value)}
                  selectedKeys={new Set(value ? [String(value)] : [])}
                  variant='faded'>
                  {(player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name}
                    </SelectItem>
                  )}
                </Select>
              )}
              rules={{ required: 'Du må velge en spiller' }}
            />
          </ModalBody>
          <ModalFooter>
            <div className='flex w-full flex-row items-center justify-between'>
              <div className='flex-1'></div>
              <div>
                <Button color='danger' onPress={onClose} variant='flat'>
                  Avbryt
                </Button>
                <Button className='ml-2' color='primary' isDisabled={false} type='submit'>
                  Opprett
                </Button>
              </div>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewLeadershipRoleModal;
