import axios from 'axios';
import { isAfter } from 'date-fns';

import { PaginationResponse, TIHLDEGroupFine } from '~/tihlde';
import { getAuthHeaders } from '~/tihlde/auth';
import { mockPaginationResponse, mockTihldeGroupFine } from '~/tihlde/mocks';

import { SHOULD_MOCK_TIHLDE_API } from '~/serverEnv';
import { ACTIVE_CLUB, TIHLDE_API_URL } from '~/values';

type PhotonUser = { id: string; name: string; username?: string | null };

type PhotonFine = {
  id: string;
  reason: string;
  amount: number;
  defense: string | null;
  image: string | null;
  status: string;
  createdAt: string;
  user: PhotonUser | null;
  createdByUser: PhotonUser | null;
};

type PhotonFinesResponse = { fines: PhotonFine[]; totalCount: number; nextPage: number | null };

const splitName = (name: string) => {
  const [first, ...rest] = (name ?? '').trim().split(/\s+/);
  return { first_name: first ?? '', last_name: rest.join(' ') };
};

const toUser = (user: PhotonUser | null) => ({
  ...splitName(user?.name ?? ''),
  user_id: user?.username ?? user?.id ?? '',
});

/**
 * Photon skiller ikke lenger mellom `approved` og `payed` som to flagg — en
 * bot har én status. `paid` er den eneste som betyr oppgjort, og alt annet
 * regnes som ikke betalt, slik at en bot under behandling ikke ser gjort opp.
 */
const toFine = (fine: PhotonFine): TIHLDEGroupFine => ({
  id: fine.id,
  user: toUser(fine.user),
  amount: fine.amount,
  approved: fine.status === 'approved' || fine.status === 'paid',
  payed: fine.status === 'paid',
  description: fine.reason,
  reason: fine.reason,
  defense: fine.defense ?? '',
  image: fine.image,
  created_by: toUser(fine.createdByUser),
  created_at: fine.createdAt,
});

export const getAllFinesSinceDate = async (from: Date): Promise<PaginationResponse<TIHLDEGroupFine>> => {
  const filterResultsBasedOnCreatedAt = (data: PaginationResponse<TIHLDEGroupFine>) => ({
    ...data,
    results: data.results.filter((fine) => isAfter(new Date(fine.created_at), from)),
  });

  if (SHOULD_MOCK_TIHLDE_API) {
    return mockPaginationResponse(mockTihldeGroupFine()).then(filterResultsBasedOnCreatedAt);
  }

  const response = await axios.get<PhotonFinesResponse>(
    `${TIHLDE_API_URL}/groups/${ACTIVE_CLUB.pythonsGroupSlug}/fines?limit=1500`,
    getAuthHeaders(),
  );
  const results = response.data.fines.map(toFine);
  return filterResultsBasedOnCreatedAt({ count: response.data.totalCount, next: null, previous: null, results });
};

export type FineCreate = Pick<TIHLDEGroupFine, 'amount' | 'description' | 'reason' | 'image'> & {
  user: TIHLDEGroupFine['user']['user_id'][];
};

/**
 * Lepton tok imot en liste med brukere per bot. Photon oppretter én bot per
 * bruker, så flere mottakere blir flere kall — sendt parallelt slik at det
 * ikke tar lengre tid enn den tregeste.
 */
export const createFine = async (fine: FineCreate): Promise<PaginationResponse<TIHLDEGroupFine>> => {
  if (SHOULD_MOCK_TIHLDE_API) {
    return mockPaginationResponse(mockTihldeGroupFine());
  }

  const created = await Promise.all(
    fine.user.map((userId) =>
      axios
        .post<PhotonFine>(
          `${TIHLDE_API_URL}/groups/${ACTIVE_CLUB.pythonsGroupSlug}/fines`,
          {
            userId,
            groupSlug: ACTIVE_CLUB.pythonsGroupSlug,
            reason: fine.reason || fine.description,
            amount: fine.amount,
            ...(fine.image ? { image: fine.image } : {}),
          },
          getAuthHeaders(),
        )
        .then((response) => toFine(response.data)),
    ),
  );

  return { count: created.length, next: null, previous: null, results: created };
};
