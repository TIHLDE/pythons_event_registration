import axios from 'axios';

import { PaginationResponse, TIHLDEGroupFine } from '~/tihlde';
import { getAuthHeaders } from '~/tihlde/auth';
import { mockPaginationResponse, mockTihldeGroupFine } from '~/tihlde/mocks';

import { SHOULD_MOCK_TIHLDE_API } from '~/serverEnv';
import { ACTIVE_CLUB, TIHLDE_API_URL } from '~/values';

export const getAllnotPayedFines = async (): Promise<PaginationResponse<TIHLDEGroupFine>> => {
  if (SHOULD_MOCK_TIHLDE_API) {
    return mockPaginationResponse(mockTihldeGroupFine());
  }
  return axios
    .get<PaginationResponse<TIHLDEGroupFine>>(`${TIHLDE_API_URL}/groups/${ACTIVE_CLUB.pythonsGroupSlug}/fines/?&payed=false&None=1500`, getAuthHeaders())
    .then((response) => response.data);
};

export type FineCreate = Pick<TIHLDEGroupFine, 'amount' | 'description' | 'reason' | 'image'> & {
  user: TIHLDEGroupFine['user']['user_id'][];
};

export const createFine = async (fine: FineCreate): Promise<PaginationResponse<TIHLDEGroupFine>> => {
  if (SHOULD_MOCK_TIHLDE_API) {
    return mockPaginationResponse(mockTihldeGroupFine());
  }
  return axios
    .post<PaginationResponse<TIHLDEGroupFine>>(`${TIHLDE_API_URL}/groups/${ACTIVE_CLUB.pythonsGroupSlug}/fines/`, fine, getAuthHeaders())
    .then((response) => response.data);
};
