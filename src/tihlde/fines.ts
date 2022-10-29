import axios from 'axios';
import { PaginationResponse, TIHLDEGroupFine } from 'tihlde';
import { getAuthHeaders, NextResponseRequest } from 'tihlde/auth';
import { PYTHONS_GROUP_SLUG, TIHLDE_API_URL } from 'values';

export const getAllnotPayedFines = async ({ req, res }: NextResponseRequest) => {
  return axios
    .get<PaginationResponse<TIHLDEGroupFine>>(`${TIHLDE_API_URL}/groups/${PYTHONS_GROUP_SLUG}/fines/?&payed=false&None=1500`, getAuthHeaders({ req, res }))
    .then((response) => response.data);
};
