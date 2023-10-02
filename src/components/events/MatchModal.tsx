'use client';

import { Button } from '@nextui-org/button';
import { Card } from '@nextui-org/card';
import { Input } from '@nextui-org/input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/modal';
import { Prisma } from '@prisma/client';
import axios from 'axios';
import clsx from 'clsx';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { eventTypeBgGradient } from 'utils';

import MatchEvents from 'components/events/MatchEvents';

export type MatchModalProps = {
  className?: string;
  isAdmin?: boolean;
  event: Prisma.EventGetPayload<{
    include: {
      team: true;
      match: true;
    };
  }>;
};

type FormDataProps = {
  homeGoals: string;
  awayGoals: string;
};

const MatchModal = ({ event, isAdmin = false, className }: MatchModalProps) => {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [shouldRefreshOnClose, setShouldRefreshOnClose] = useState(false);

  const { handleSubmit, control } = useForm<FormDataProps>({
    defaultValues: {
      homeGoals: String(event.match?.homeGoals ?? 0),
      awayGoals: String(event.match?.awayGoals ?? 0),
    },
  });

  const onUpdate = () => setShouldRefreshOnClose(true);

  const handleClose = () => {
    if (shouldRefreshOnClose) {
      router.refresh();
    }
    onClose();
    setShouldRefreshOnClose(false);
  };

  const onSubmit = async (data: FormDataProps) => axios.put(`/api/matches/${event.match?.id}`, { data }).then(onUpdate);

  return (
    <>
      <Button className={clsx([`normal-case text-inherit`, className])} fullWidth onClick={onOpen} variant='light'>
        <span className='text-md flex w-full items-center gap-2'>
          <span className='flex-1 py-1 text-right'>{event.team?.name}</span>
          <span className='flex gap-1 rounded-md bg-[#ffffff44] px-2 py-1 font-bold'>
            <span className='flex-1 text-right'>{event.match?.homeGoals ?? '?'}</span>-<span className='flex-1 text-left'>{event.match?.awayGoals ?? '?'}</span>
          </span>
          <span className='flex-1 py-1 text-left'>{event.title}</span>
        </span>
      </Button>
      <Modal classNames={{ base: `${eventTypeBgGradient[event.eventType]}` }} hideCloseButton isOpen={isOpen} onOpenChange={handleClose}>
        <ModalContent>
          <ModalHeader className='pb-0 pt-6'>
            <h2 className='font-oswald text-3xl'>{`${event.team?.name} ${event.match?.homeGoals} - ${event.match?.awayGoals} ${event.title}`}</h2>
          </ModalHeader>
          <ModalBody className='flex flex-col gap-2 pb-4'>
            <p className='text-sm capitalize'>
              {format(new Date(event.time), "EEEE dd. MMMM yyyy' 'HH:mm", {
                locale: nb,
              })}
            </p>
            {isAdmin && (
              <Card as='form' className='flex flex-col gap-2 p-4' isBlurred onSubmit={handleSubmit(onSubmit)}>
                <div className='mt-2 flex gap-2'>
                  <Controller
                    control={control}
                    name='homeGoals'
                    render={({ field }) => (
                      <Input fullWidth inputMode='numeric' label={`Mål av oss (${event.team?.name})`} required variant='faded' {...field} />
                    )}
                  />
                  <Controller
                    control={control}
                    name='awayGoals'
                    render={({ field }) => <Input fullWidth inputMode='numeric' label={`Mål av ${event.title}`} required variant='faded' {...field} />}
                  />
                </div>
                <Button color='primary' type='submit' variant='solid'>
                  Lagre resultat
                </Button>
              </Card>
            )}
            {isAdmin && <h3 className='mt-2 font-cabin text-xl'>Hendelser</h3>}
            <MatchEvents event={event} isAdmin={isAdmin} />
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

export default MatchModal;
