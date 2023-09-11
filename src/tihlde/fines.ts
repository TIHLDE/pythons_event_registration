import axios from 'axios';
import { PaginationResponse, TIHLDEGroupFine } from 'tihlde';
import { getAuthHeaders } from 'tihlde/auth';
import { PYTHONS_GROUP_SLUG, TIHLDE_API_URL } from 'values';

export const getAllnotPayedFines = async () => {
  return axios
    .get<PaginationResponse<TIHLDEGroupFine>>(`${TIHLDE_API_URL}/groups/${PYTHONS_GROUP_SLUG}/fines/?&payed=false&None=1500`, getAuthHeaders())
    .then((response) => response.data);
};

export type FineCreate = Pick<TIHLDEGroupFine, 'amount' | 'description' | 'reason' | 'image'> & {
  user: TIHLDEGroupFine['user']['user_id'][];
};

export const createFine = async (fine: FineCreate) => {
  return axios
    .post<PaginationResponse<TIHLDEGroupFine>>(`${TIHLDE_API_URL}/groups/${PYTHONS_GROUP_SLUG}/fines/`, fine, getAuthHeaders())
    .then((response) => response.data);
};
