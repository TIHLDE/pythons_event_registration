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
