import { Event, EventType, Notification, Player, Position, Registrations, Team } from '@prisma/client';

export type ITeam = Team & {
  players: IPlayer[];
};

export type IEvent = Event & {
  type: IEventType;
  registrations: IRegistrations[];
  willArrive?: IRegistrations[];
  willNotArrive?: IRegistrations[];
  hasNotResponded?: IRegistrations[];
  team?: ITeam;
  matchId?: number;
  match?: IMatch;
};

export type IEventType = EventType & {
  event: IEvent[];
};

export type IRegistrations = Registrations & {
  player: IPlayer;
  event: IEvent;
};

export type IPlayer = Player & {
  registrations: IRegistrations[];
};

export type IPosition = Position & {
  Player: IPlayer[];
};

export type INotification = Notification & {
  author: IPlayer;
};

export type IMatch = {
  id: number;
  opponent: string;
  result: Result;
  homeGoals: number;
  awayGoals: number;
  eventId: number;
  event: IEvent;
  statistics: IStatistic[];
};

export type IStatistic = {
  id: number;
  player: IPlayer;
  playerId: number;
  match: IMatch;
  matchId: number;
  statisticType: StatisticType;
};

export enum Result {
  Win = 'WIN',
  Loss = 'LOSS',
  Draw = 'DRAW',
}

export enum StatisticType {
  GOAL = 'GOAL',
  ASSIST = 'ASSIST',
  YELLOW_CARD = 'YELLOW_CARD',
  RED_CARD = 'RED_CARD',
  CLEAN_SHEET = 'CLEAN_SHEET',
  MOTM = 'MOTM',
}
