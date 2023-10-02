'use client';

import { Button } from '@nextui-org/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/modal';
import { Event, Prisma } from '@prisma/client';
import Image from 'next/image';
import { useMemo } from 'react';
import { eventTypeBgGradient, positionsList } from 'utils';

type ExtendedRegistrations = Prisma.RegistrationsGetPayload<{
  include: {
    player: true;
  };
}>;

export type PlayersModalProps = {
  registrations: ExtendedRegistrations[];
  title: string;
  eventType: Event['eventType'];
};

const PlayersModal = ({ eventType, registrations, title }: PlayersModalProps) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const groupedPlayers = useMemo(
    () =>
      positionsList.map((position) => ({
        ...position,
        players: registrations.filter((registration) => registration.player.position === position.type),
      })),
    [registrations],
  );

  return (
    <>
      <Button className='flex h-auto flex-1 flex-col gap-0' onClick={onOpen} size='md' variant='light'>
        <span className='font-cabin text-2xl'>{registrations.length}</span>
        <span className='text-sm font-light uppercase'>{title}</span>
      </Button>
      <Modal className={`${eventTypeBgGradient[eventType]}`} hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='inside'>
        <ModalContent>
          <ModalHeader className='flex items-center gap-4 pb-0 pt-6'>
            <Image alt='Logo' height={37.625} src='/pythons.png' width={25} />
            <h2 className='flex-1 font-oswald text-3xl'>{`${title} (${registrations.length})`}</h2>
          </ModalHeader>
          <ModalBody className='flex flex-col gap-2 pb-4'>
            {groupedPlayers.map((position) => (
              <div className='flex flex-col gap-2' key={position.type}>
                <h3 className='font-cabin text-2xl font-bold'>
                  {position.label} ({position.players.length})
                </h3>
                <div className='grid grid-cols-[repeat(auto-fill,_minmax(130px,_1fr))] gap-2'>
                  {position.players.map((registration: ExtendedRegistrations) => (
                    <div key={registration.playerId}>
                      <p className='text-sm font-bold'>{registration.player.name}</p>
                      {registration.reason && <p className='text-sm'>- {registration.reason}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button color='default' onPress={onClose} variant='light'>
              Lukk
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PlayersModal;
