import { MatchEvent, Player, Prisma, Team } from '@prisma/client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { minutesToMilliseconds } from 'date-fns';

import { fetcher } from '~/utils';

export type Options = Pick<UseQueryOptions, 'enabled'>;

export const QUERY_CONFIG = {
  UseTeams: (options?: Options) => ({
    ...options,
    queryKey: ['teams'],
    queryFn: () => fetcher<Team[]>('/api/teams'),
    staleTime: minutesToMilliseconds(1),
  }),
  UsePlayers: (includeNotActive: boolean = false, options?: Options) => ({
    ...options,
    queryKey: ['players', includeNotActive],
    queryFn: () => fetcher<Player[]>(`/api/players${includeNotActive ? '?includeNotActive=true' : ''}`),
    staleTime: minutesToMilliseconds(1),
  }),
  UseMatchEvents: (matchId: MatchEvent['id'], options?: Options) => ({
    ...options,
    queryKey: ['matches', matchId, 'events'],
    queryFn: () => fetcher<Prisma.MatchEventGetPayload<{ include: { player: true } }>[]>(`/api/matches/${matchId}/events`),
    staleTime: minutesToMilliseconds(1),
  }),
} satisfies Record<string, (...args: never[]) => UseQueryOptions>;

export const useTeams = (options?: Options) => useQuery(QUERY_CONFIG.UseTeams(options));
export const usePlayers = (includeNotActive: boolean = false, options?: Options) => useQuery(QUERY_CONFIG.UsePlayers(includeNotActive, options));
export const useMatchEvents = (matchId: MatchEvent['id'], options?: Options) => useQuery(QUERY_CONFIG.UseMatchEvents(matchId, options));
