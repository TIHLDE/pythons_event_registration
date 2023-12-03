import axios from 'axios';

import { PaginationResponse, TIHLDEMembership } from '~/tihlde';
import { getAuthHeaders } from '~/tihlde/auth';
import { mockPaginationResponse, mockTihldeMembership } from '~/tihlde/mocks';

import { SHOULD_MOCK_TIHLDE_API } from '~/serverEnv';
import { ACTIVE_CLUB, TIHLDE_API_URL } from '~/values';

export const getUserMemberships = async (): Promise<PaginationResponse<TIHLDEMembership>> => {
  if (SHOULD_MOCK_TIHLDE_API) {
    return mockPaginationResponse(mockTihldeMembership());
  }
  return axios.get<PaginationResponse<TIHLDEMembership>>(`${TIHLDE_API_URL}/users/me/memberships/`, getAuthHeaders()).then((response) => response.data);
};

export const isMemberOfPythonsGroup = async (): Promise<boolean> => {
  if (SHOULD_MOCK_TIHLDE_API) {
    return true;
  }
  const memberships = await getUserMemberships();
  return memberships.results.some((membership) => membership.group.slug === ACTIVE_CLUB.pythonsGroupSlug);
};

export const getAllPythonsMemberships = async (): Promise<PaginationResponse<TIHLDEMembership>> => {
  if (SHOULD_MOCK_TIHLDE_API) {
    return mockPaginationResponse(mockTihldeMembership());
  }
  return axios
    .get<PaginationResponse<TIHLDEMembership>>(`${TIHLDE_API_URL}/groups/${ACTIVE_CLUB.pythonsGroupSlug}/memberships/?None=500`, getAuthHeaders())
    .then((response) => response.data);
};
