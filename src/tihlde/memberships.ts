import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { PaginationResponse, TIHLDEMembership } from 'tihlde';
import { getAuthHeaders } from 'tihlde/auth';
import { PYTHONS_GROUP_SLUG, TIHLDE_API_URL } from 'values';

export const getUserMemberships = async (req: NextApiRequest, res: NextApiResponse) => {
  return axios.get<PaginationResponse<TIHLDEMembership>>(`${TIHLDE_API_URL}/users/me/memberships/`, getAuthHeaders(req, res)).then((response) => response.data);
};

export const isMemberOfPythonsGroup = async (req: NextApiRequest, res: NextApiResponse) => {
  const memberships = await getUserMemberships(req, res);
  return memberships.results.some((membership) => membership.group.slug === PYTHONS_GROUP_SLUG);
};

export const getAllPythonsMemberships = async (req: NextApiRequest, res: NextApiResponse) => {
  return axios
    .get<PaginationResponse<TIHLDEMembership>>(`${TIHLDE_API_URL}/groups/${PYTHONS_GROUP_SLUG}/memberships/?None=500`, getAuthHeaders(req, res))
    .then((response) => response.data);
};
