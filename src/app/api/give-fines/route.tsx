import { prismaClient } from '~/prismaClient';
import { createFine, FineCreate } from '~/tihlde/fines';

export const POST = async (request: Request) => {
  const { data } = await request.json();
  const fines: FineCreate[] = data.fines;

  await Promise.all(fines.map((fine) => createFine(fine)));

  await prismaClient.event.update({
    where: { id: data.eventId },
    data: { finesGiven: true },
  });

  return Response.json({});
};
