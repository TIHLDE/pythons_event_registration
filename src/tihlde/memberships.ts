import axios from 'axios';

import { PaginationResponse, TIHLDEMembership } from '~/tihlde';
import { getAuthHeaders } from '~/tihlde/auth';
import { mockPaginationResponse, mockTihldeMembership } from '~/tihlde/mocks';

import { SHOULD_MOCK_TIHLDE_API } from '~/serverEnv';
import { ACTIVE_CLUB, TIHLDE_API_URL } from '~/values';

/**
 * Photon returnerer gruppene med medlemskapet nøstet inni, der Lepton
 * returnerte medlemskap med gruppa nøstet inni. Resten av appen leser den
 * gamle formen, så den snus her framfor i hvert kallsted.
 */
type PhotonMyGroup = {
  slug: string;
  name: string;
  membership: { role: 'member' | 'leader'; joinedAt: string } | null;
};

type PhotonGroupMember = {
  role: 'member' | 'leader';
  createdAt: string;
  user: { id: string; name: string; username?: string | null } | null;
};

const splitName = (name: string) => {
  const [first, ...rest] = (name ?? '').trim().split(/\s+/);
  return { first_name: first ?? '', last_name: rest.join(' ') };
};

const asPagination = <T,>(results: T[]): PaginationResponse<T> => ({
  count: results.length,
  next: null,
  previous: null,
  results,
});

/**
 * `token` sendes inn fra OAuth-callbacken. Der er cookien satt på responsen og
 * ennå ikke lesbar via `cookies()`, så headeren må bygges eksplisitt.
 */
export const getUserMemberships = async (token?: string): Promise<PaginationResponse<TIHLDEMembership>> => {
  if (SHOULD_MOCK_TIHLDE_API) {
    return mockPaginationResponse(mockTihldeMembership());
  }
  const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : getAuthHeaders();
  const response = await axios.get<PhotonMyGroup[]>(`${TIHLDE_API_URL}/groups/mine`, headers);
  const memberships = response.data
    .filter((group) => group.membership !== null)
    .map<TIHLDEMembership>((group) => ({
      // /groups/mine sier hvilke grupper *jeg* er med i, så brukeren er
      // implisitt. Feltet fylles av kallstedene som trenger det.
      user: { first_name: '', last_name: '', user_id: '' },
      created_at: group.membership?.joinedAt ?? '',
      group: { name: group.name, slug: group.slug, viewer_is_member: true },
      membership_type: group.membership?.role === 'leader' ? 'LEADER' : 'MEMBER',
    }));
  return asPagination(memberships);
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
  const response = await axios.get<PhotonGroupMember[]>(
    `${TIHLDE_API_URL}/groups/${ACTIVE_CLUB.pythonsGroupSlug}/members`,
    getAuthHeaders(),
  );
  const memberships = response.data.map<TIHLDEMembership>((member) => ({
    user: {
      ...splitName(member.user?.name ?? ''),
      // Spillerprofiler nøkles på brukernavnet, så det må følge med.
      user_id: member.user?.username ?? member.user?.id ?? '',
    },
    created_at: member.createdAt,
    group: { name: ACTIVE_CLUB.pythonsGroupSlug, slug: ACTIVE_CLUB.pythonsGroupSlug, viewer_is_member: true },
    membership_type: member.role === 'leader' ? 'LEADER' : 'MEMBER',
  }));
  return asPagination(memberships);
};
