import { PaginationResponse, TIHLDEGroup, TIHLDEGroupFine, TIHLDEMembership, TIHLDEUser } from 'tihlde';
import { MOCK_TIHLDE_USER_ID, PYTHONS_GROUP_SLUG } from 'values';

export const mockPaginationResponse = <T>(result: T): PaginationResponse<T> => ({
  count: 1,
  next: null,
  previous: null,
  results: [result],
});

export const mockTihldeUser = (userId?: string): TIHLDEUser => {
  if (userId) {
    return {
      first_name: 'Ola',
      last_name: 'Nordmann',
      user_id: userId,
    };
  }

  if (!MOCK_TIHLDE_USER_ID) {
    throw Error('MOCK_TIHLDE_USER_ID is undefined, but mocks are generated');
  }

  return {
    first_name: 'Ola',
    last_name: 'Nordmann',
    user_id: userId ?? MOCK_TIHLDE_USER_ID,
  };
};

export const mockTihldeGroup = (): TIHLDEGroup => ({
  name: 'TIHLDE Pythons',
  slug: PYTHONS_GROUP_SLUG,
  viewer_is_member: true,
});

export const mockTihldeMembership = (): TIHLDEMembership => ({
  user: mockTihldeUser(),
  created_at: new Date().toJSON(),
  group: mockTihldeGroup(),
  membership_type: 'MEMBER',
});

export const mockTihldeGroupFine = (): TIHLDEGroupFine => ({
  id: 'fine-id',
  user: mockTihldeUser(),
  amount: 1,
  approved: false,
  payed: false,
  description: '§3.03 - Oppkast',
  reason: 'Spydd på fest',
  defense: 'Jaja',
  image: null,
  created_by: mockTihldeUser(),
  created_at: new Date().toJSON(),
});
