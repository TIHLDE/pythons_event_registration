import axios from 'axios';
import { PaginationResponse, TIHLDEMembership } from 'tihlde';
import { getAuthHeaders } from 'tihlde/auth';
import { PYTHONS_GROUP_SLUG, TIHLDE_API_URL } from 'values';

export const getUserMemberships = async () => {
  return axios.get<PaginationResponse<TIHLDEMembership>>(`${TIHLDE_API_URL}/users/me/memberships/`, getAuthHeaders()).then((response) => response.data);
};

export const isMemberOfPythonsGroup = async () => {
  const memberships = await getUserMemberships();
  return memberships.results.some((membership) => membership.group.slug === PYTHONS_GROUP_SLUG);
};

export const getAllPythonsMemberships = async () => {
  return axios
    .get<PaginationResponse<TIHLDEMembership>>(`${TIHLDE_API_URL}/groups/${PYTHONS_GROUP_SLUG}/memberships/?None=500`, getAuthHeaders())
    .then((response) => response.data);
};
