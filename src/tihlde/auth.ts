import { AxiosRequestConfig } from 'axios';
import { cookies } from 'next/headers';
import type { Player } from '@prisma/client';

import { getUserMemberships } from '~/tihlde/memberships';

import { prismaClient } from '~/prismaClient';
import { MOCK_TIHLDE_USER_ID, SHOULD_MOCK_TIHLDE_API } from '~/serverEnv';
import { ACTIVE_CLUB, AUTH_TOKEN_COOKIE_KEY } from '~/values';

/**
 * Photon tar tokenet som en vanlig bearer. Lepton ville ha det i
 * x-csrf-token, som er grunnen til at hvert kallsted måtte endres.
 */
export const getAuthHeaders = (): Pick<AxiosRequestConfig<unknown>, 'headers'> => {
  const token = cookies().get(AUTH_TOKEN_COOKIE_KEY);
  return { headers: { Authorization: `Bearer ${token?.value}` } };
};

/**
 * Fullfører innloggingen etter at OAuth-callbacken har hentet et token:
 * sjekker Pythons-medlemskap og finner eller oppretter spillerprofilen.
 * Passordkontrollen skjer på tihlde.org.
 *
 * Tar tokenet som argument og *returnerer* spilleren i stedet for å sette
 * cookies selv. I en route handler settes cookies på responsen, og de er ikke
 * lesbare via `cookies()` i samme forespørsel — så både lesing og skriving må
 * eies av kalleren.
 *
 * Spillerraden nøkles fortsatt på `tihlde_user_id`, altså brukernavnet, ikke
 * Photons interne id. Eksisterende rader er skrevet med brukernavnet, og å
 * bytte nøkkel her ville laget nye profiler for samtlige spillere.
 */
export const completeLogin = async (username: string, displayName: string, token: string): Promise<Player> => {
  const membershipsQuery = getUserMemberships(token);
  const playerQuery = prismaClient.player.findFirst({
    where: {
      tihlde_user_id: {
        equals: username,
        mode: 'insensitive',
      },
      active: true,
    },
  });

  const [memberships, activePlayer] = await Promise.all([membershipsQuery, playerQuery]);
  const isMemberOfPythons = memberships.results.some((membership) => membership.group.slug === ACTIVE_CLUB.pythonsGroupSlug);

  if (!isMemberOfPythons) {
    // Teksten nevnte tidligere at gruppeledere for Index også slapp inn.
    // Sjekken over har aldri åpnet for det — bare medlemskap i Pythons-gruppa —
    // så meldingen sendte folk på leting etter en vei som ikke fantes.
    throw Error(`Du må være medlem av Pythons-gruppen på tihlde.org/grupper/${ACTIVE_CLUB.pythonsGroupSlug} for å logge inn`);
  }

  if (activePlayer) {
    return activePlayer;
  }

  const existingPlayer = await prismaClient.player.findFirst({
    where: {
      tihlde_user_id: {
        equals: username,
        mode: 'insensitive',
      },
    },
  });

  if (existingPlayer) {
    return prismaClient.player.update({
      where: { id: existingPlayer.id },
      data: { active: true },
    });
  }

  return prismaClient.player.create({
    data: {
      tihlde_user_id: username,
      name: displayName || username,
      position: 'KEEPER',
      active: true,
    },
  });
};

/** Brukernavnet mock-modus later som er innlogget. */
export const getMockUsername = () => (SHOULD_MOCK_TIHLDE_API ? MOCK_TIHLDE_USER_ID : null);
