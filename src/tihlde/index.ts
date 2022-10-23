export type PaginationResponse<T> = {
  count: number;
  next: number | null;
  previous: number | null;
  results: Array<T>;
};

export type TIHLDEDetailResponse = {
  detail: string;
};

export type TIHLDEGroup = {
  name: string;
  slug: string;
  viewer_is_member: boolean;
};

export type TIHLDEMembership = {
  user: TIHLDEUser;
  created_at: string;
  group: TIHLDEGroup;
  membership_type: 'MEMBER' | 'LEADER';
};

export type TIHLDEGroupFine = {
  id: string;
  user: TIHLDEUser;
  amount: number;
  approved: boolean;
  payed: boolean;
  description: string;
  reason: string;
  defense: string;
  image: string | null;
  created_by: TIHLDEUser;
  created_at: string;
};

export type TIHLDEUser = {
  first_name: string;
  last_name: string;
  user_id: string;
};
