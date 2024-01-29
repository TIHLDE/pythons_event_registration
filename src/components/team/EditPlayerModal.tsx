'use client';

import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Select, SelectItem } from '@nextui-org/select';
import { useDisclosure } from '@nextui-org/use-disclosure';
import { Player } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MdEdit } from 'react-icons/md';

import { useTeams } from '~/hooks/useQuery';

import { positionsList } from '~/utils';

export type EditPlayerModalProps = {
  player: Player;
};

type FormDataProps = {
  teamId: Player['teamId'] | '';
  position: Player['position'];
  disableRegistrations: Player['disableRegistrations'];
};

const EditPlayerModal = ({ player }: EditPlayerModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: teams = [] } = useTeams();
  const router = useRouter();
  const { control, handleSubmit } = useForm<FormDataProps>({
    defaultValues: { teamId: player.teamId || '', position: player.position, disableRegistrations: player.disableRegistrations },
  });
  const onSubmit = useCallback(
    async (formData: FormDataProps) => {
      const data: Pick<Player, 'teamId' | 'position' | 'disableRegistrations'> = {
        ...formData,
        teamId: formData.teamId === '' ? null : Number(formData.teamId),
      };
      await axios.put(`/api/players/${player.id}`, { data: data });
      onClose();
      router.refresh();
    },
    [onClose, player.id, router],
  );
  return (
    <>
      <Button className='h-6 w-6 min-w-0' isIconOnly onClick={onOpen} size='sm' variant='light'>
        <MdEdit className='h-6 w-6' />
      </Button>
      <Modal hideCloseButton isOpen={isOpen} onClose={onClose} scrollBehavior='inside'>
        <ModalContent as='form' onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Rediger spillerprofil</ModalHeader>
          <ModalBody className='flex flex-col gap-4'>
            <p className='text-md whitespace-break-spaces'>{`Navn: ${player.name}
TIHLDE-id: ${player.tihlde_user_id}
Opprettet: ${format(player.createdAt, 'dd. MMMM yyyy', { locale: nb })}
`}</p>
            <Controller
              control={control}
              name='teamId'
              render={({ field: { onChange, value } }) => (
                <Select
                  items={[{ id: '', name: 'Ingen tilknytning' }, ...teams]}
                  label='Lag'
                  onChange={(e) => onChange(e.target.value)}
                  selectedKeys={new Set(value ? [String(value)] : [])}
                  variant='faded'>
                  {(team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  )}
                </Select>
              )}
            />
            <Controller
              control={control}
              name='position'
              render={({ field: { onChange, value } }) => (
                <Select
                  items={positionsList}
                  label='Posisjon'
                  onChange={(e) => onChange(e.target.value)}
                  selectedKeys={new Set(value ? [value] : [])}
                  variant='faded'>
                  {(position) => (
                    <SelectItem key={position.type} value={position.type}>
                      {position.label}
                    </SelectItem>
                  )}
                </Select>
              )}
            />
            <Controller
              control={control}
              name='disableRegistrations'
              render={({ field: { onChange, value } }) => (
                <Checkbox isSelected={value} onValueChange={onChange}>
                  Deaktiver påmelding
                </Checkbox>
              )}
            />
            <p className='text-xs'>
              {`Ved å deaktivere påmelding til arrangementer vil spilleren heller ikke motta bøter for manglende påmelding. Spilleren vil fremdeles kunne melde
                seg på sosiale arrangementer, men vil ikke vises i listen over "Ikke svart" før den eventuelt har meldt seg på/av. Passende for spillere som midlertidig
                ikke trener og spiller kamper, for eksempel på grunn av langtidsskade eller utveksling. Om spilleren allerede har meldt seg på fremtidige arrangementer
                vil den fremdeles kunne endre påmelding på disse etter at "Deaktiver påmelding" skrus på.`}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color='danger' onPress={onClose} variant='flat'>
              Avbryt
            </Button>
            <Button color='primary' type='submit'>
              Lagre
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditPlayerModal;
