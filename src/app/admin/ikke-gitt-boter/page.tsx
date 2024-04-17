import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { EventType } from '@prisma/client';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { prismaClient } from '~/prismaClient';
import { ACTIVE_CLUB } from '~/values';

const getData = async () => {
  const prevFinesParty = await prismaClient.event.findFirst({
    where: {
      eventType: EventType.SOCIAL,
      title: {
        mode: 'insensitive',
        contains: '%b%o%t%f%e%s%t%',
      },
      time: {
        lt: new Date(),
      },
    },
    orderBy: {
      time: 'desc',
    },
  });
  return { prevFinesParty };
};

const dateSchema = z.object({
  date: z.coerce.date(),
});

const GoToDateForPreviousFinesParty = async () => {
  const { prevFinesParty } = await getData();

  async function goToDate(formData: FormData) {
    'use server';

    const data = dateSchema.safeParse(Object.fromEntries(formData));
    if (data.success) {
      console.log(data, `/admin/ikke-gitt-boter/${format(data.data.date, 'yyyy-MM-dd')}`);
      redirect(`/admin/ikke-gitt-boter/${format(data.data.date, 'yyyy-MM-dd')}`);
    }
    return { error: data.error.message };
  }
  return (
    <>
      <p className='text-md mb-4'>
        For å finne ut hvilke spillere som skal motta bot for brudd på paragraf <i>§11 - Snitches don&apos;t get stitches</i> på bakgrunn av{' '}
        <Link href={`https://tihlde.org/grupper/${ACTIVE_CLUB.pythonsGroupSlug}/lovverk/`} isExternal underline='always'>
          lovverket
        </Link>
        , må vi vite når forrige botfest var.
        {prevFinesParty !== null &&
          ` Ved å søke etter tidligere arrangementer med "Botfest" i tittel fant vi "${prevFinesParty.title}" som ble arrangert ${format(prevFinesParty.time, 'dd. MMMM yyyy', { locale: nb })} på ${prevFinesParty.location}. Tidspunktet har blitt forhåndsutfylt, men du kan endre tidspunktet hvis det ikke stemmer.`}
      </p>
      <form action={goToDate} className='mx-auto flex max-w-lg flex-col gap-2'>
        <Input
          defaultValue={prevFinesParty ? format(prevFinesParty.time, 'yyyy-MM-dd') : undefined}
          isRequired
          label='Tidspunkt for forrige botfest'
          name='date'
          placeholder='Tidspunkt'
          type='date'
          variant='faded'
        />
        <Button color='primary' fullWidth type='submit' variant='solid'>
          Finn spillere
        </Button>
      </form>
    </>
  );
};

export default GoToDateForPreviousFinesParty;
