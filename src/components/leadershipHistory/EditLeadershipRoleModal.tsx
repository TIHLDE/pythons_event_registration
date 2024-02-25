'use client';

import { Button } from '@nextui-org/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Select, SelectItem } from '@nextui-org/react';
import { useDisclosure } from '@nextui-org/use-disclosure';
import { LeadershipPeriodRole } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MdEdit } from 'react-icons/md';

import { usePlayers } from '~/hooks/useQuery';

import { LeadershipPeriodRoleDelete } from '~/components/leadershipHistory/LeadershipRoleDelete';

export type EditLeadershipRoleModalProps = {
  player: {
    id: number;
    name: string;
  };
  role: string;
  id: number;
};

type FormDataProps = {
  playerId: number;
};

const EditLeadershipRoleModal = ({ player, role, id }: EditLeadershipRoleModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const { data: players = [], isLoading: isPlayersLoading } = usePlayers({ enabled: true });

  const { control, handleSubmit } = useForm<FormDataProps>({
    defaultValues: { playerId: player.id },
  });

  const onSubmit = useCallback(
    async (formData: FormDataProps) => {
      if (formData.playerId !== undefined) {
        const data: { playerId: LeadershipPeriodRole['playerId'] } = {
          ...formData,
          playerId: Number(formData.playerId),
        };
        await axios.put(`/api/leadershiprole/${id}`, { data: data });
        onClose();
        router.refresh();
      }
    },
    [onClose, id, router],
  );

  if (isPlayersLoading) {
    return;
  }

  return (
    <>
      <Button className='h-6 w-6 min-w-0' isIconOnly onClick={onOpen} size='sm' variant='light'>
        <MdEdit className='h-6 w-6' />
      </Button>
      <Modal hideCloseButton isOpen={isOpen} onClose={onClose} scrollBehavior='inside'>
        <ModalContent as='form' onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Rediger {role}</ModalHeader>
          <ModalBody className='flex flex-col gap-4'>
            <Controller
              control={control}
              name='playerId'
              render={({ field: { onChange, value } }) => (
                <Select
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
            />
          </ModalBody>
          <ModalFooter>
            <div className='flex w-full flex-row items-center justify-between'>
              <LeadershipPeriodRoleDelete id={id} />
              <div className='flex-1'></div>
              <div>
                <Button color='danger' onPress={onClose} variant='flat'>
                  Avbryt
                </Button>
                <Button className='ml-2' color='primary' isDisabled={false} type='submit'>
                  Lagre
                </Button>
              </div>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditLeadershipRoleModal;
