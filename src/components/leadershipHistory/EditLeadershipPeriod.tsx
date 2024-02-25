'use client';

import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/react';
import { useDisclosure } from '@nextui-org/use-disclosure';
import { LeadershipPeriod } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

type FormDataProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startDate: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endDate: any;
};

type EditLeadershipPeriodProps = {
  id: LeadershipPeriod['id'];
  startDate: LeadershipPeriod['startDate'];
  endDate: LeadershipPeriod['endDate'];
};

const dateFormat = 'yyyy-MM-dd';

export const EditLeadershipPeriod = ({ id, startDate, endDate }: EditLeadershipPeriodProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { handleSubmit, control, reset } = useForm<FormDataProps>({
    defaultValues: {
      startDate: format(startDate, dateFormat),
      endDate: format(endDate, dateFormat),
    },
  });
  const router = useRouter();

  const onSubmit = async (formData: Pick<LeadershipPeriod, 'startDate' | 'endDate'>) => {
    const data = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
    };
    await axios.put(`/api/leadershipperiod/${id}`, { data: data });
    onClose();
    reset();
    router.refresh();
  };
  return (
    <>
      {isOpen ? (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-2 flex flex-row gap-2'>
              <Controller
                control={control}
                name={'startDate'}
                render={({ field: { onChange, value }, fieldState }) => (
                  <Input
                    autoFocus
                    errorMessage={fieldState.error?.message}
                    isInvalid={Boolean(fieldState.error?.message)}
                    isRequired
                    label='Startdato'
                    onChange={onChange}
                    placeholder='Startdato'
                    type='date'
                    value={value}
                    variant='faded'
                  />
                )}
                rules={{ required: 'Styret må ha en startdato' }}
              />
              <Controller
                control={control}
                name={'endDate'}
                render={({ field: { onChange, value }, fieldState }) => (
                  <Input
                    autoFocus
                    errorMessage={fieldState.error?.message}
                    isInvalid={Boolean(fieldState.error?.message)}
                    isRequired
                    label='Sluttdato'
                    onChange={onChange}
                    placeholder='Sluttdato'
                    type='date'
                    value={value}
                    variant='faded'
                  />
                )}
                rules={{ required: 'Styret må ha en sluttdato' }}
              />
            </div>
            <div className='flex flex-row justify-between'>
              <Button color='danger' onClick={onClose} variant='bordered'>
                Avbryt
              </Button>
              <Button color='primary' type='submit' variant='solid'>
                Oppdater
              </Button>
            </div>
          </form>
        </>
      ) : (
        <Button color='primary' fullWidth onClick={onOpen} variant='bordered'>
          Endre styrets start- og sluttdato
        </Button>
      )}
    </>
  );
};
