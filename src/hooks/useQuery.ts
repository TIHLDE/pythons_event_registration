import { EventType, MatchEvent, Player, Position, Prisma, Team } from '@prisma/client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { minutesToMilliseconds } from 'date-fns';
import { fetcher } from 'utils';

export type Options = Pick<UseQueryOptions, 'enabled'>;

export const QUERY_CONFIG = {
  UsePositions: (options?: Options) => ({
    ...options,
    queryKey: ['positions'],
    queryFn: () => fetcher<Position[]>('/api/positions'),
    staleTime: minutesToMilliseconds(10),
  }),
  UseTeams: (options?: Options) => ({
    ...options,
    queryKey: ['teams'],
    queryFn: () => fetcher<Team[]>('/api/teams'),
    staleTime: minutesToMilliseconds(1),
  }),
  UseEventType: (options?: Options) => ({
    ...options,
    queryKey: ['eventtype'],
    queryFn: () => fetcher<EventType[]>('/api/eventType'),
    staleTime: minutesToMilliseconds(10),
  }),
  UsePlayers: (options?: Options) => ({
    ...options,
    queryKey: ['players'],
    queryFn: () => fetcher<Player[]>('/api/players'),
    staleTime: minutesToMilliseconds(1),
  }),
  UseMatchEvents: (matchId: MatchEvent['id'], options?: Options) => ({
    ...options,
    queryKey: ['matches', matchId, 'events'],
    queryFn: () => fetcher<Prisma.MatchEventGetPayload<{ include: { player: true } }>[]>(`/api/matches/${matchId}/events`),
    staleTime: minutesToMilliseconds(1),
  }),
} satisfies Record<string, (...args: never[]) => UseQueryOptions>;

export const usePositions = (options?: Options) => useQuery(QUERY_CONFIG.UsePositions(options));
export const useTeams = (options?: Options) => useQuery(QUERY_CONFIG.UseTeams(options));
export const useEventType = (options?: Options) => useQuery(QUERY_CONFIG.UseEventType(options));
export const usePlayers = (options?: Options) => useQuery(QUERY_CONFIG.UsePlayers(options));
export const useMatchEvents = (matchId: MatchEvent['id'], options?: Options) => useQuery(QUERY_CONFIG.UseMatchEvents(matchId, options));
