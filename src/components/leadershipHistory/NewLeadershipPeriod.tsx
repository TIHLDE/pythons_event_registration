'use client';

import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/react';
import { useDisclosure } from '@nextui-org/use-disclosure';
import { LeadershipPeriod } from '@prisma/client';
import axios from 'axios';
import { addYears, format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { MdAdd } from 'react-icons/md';

type FormDataProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startDate: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endDate: any;
};

const dateFormat = 'yyyy-MM-dd';

export const NewLeadershipPeriod = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { handleSubmit, control, reset } = useForm<FormDataProps>({
    defaultValues: {
      startDate: format(new Date(), dateFormat),
      endDate: format(addYears(new Date(), 1), dateFormat),
    },
  });
  const router = useRouter();

  const onSubmit = async (data: Pick<LeadershipPeriod, 'startDate' | 'endDate'>) => {
    await axios.post('/api/leadershipperiod', { data });
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
                    label='Estimert sluttdato'
                    onChange={onChange}
                    placeholder='Estimert sluttdato'
                    type='date'
                    value={value}
                    variant='faded'
                  />
                )}
                rules={{ required: 'Styret må ha en estimert sluttdato' }}
              />
            </div>
            <div className='flex flex-row justify-between'>
              <Button color='danger' onClick={onClose} variant='bordered'>
                Avbryt
              </Button>
              <Button color='primary' type='submit' variant='solid'>
                Legg til
              </Button>
            </div>
          </form>
        </>
      ) : (
        <Button color='primary' fullWidth onClick={onOpen} startContent={<MdAdd className='h-6 w-6' />} variant='bordered'>
          Nytt styre
        </Button>
      )}
    </>
  );
};
