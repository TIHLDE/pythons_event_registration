export type IEvent = {
  type: IEventType;
  id: number;
  title?: string;
  time: Date;
  location: string;
  createdAt: Date;
  registrations: IRegistrations[];
  eventTypeSlug: string;
  willArrive?: IRegistrations[];
  willNotArrive?: IRegistrations[];
};

export type IEventType = {
  slug: string;
  name: string;
  event: IEvent[];
};

export type IRegistrations = {
  player: IPlayer;
  playerId: number;
  event: IEvent;
  eventId: number;
  time: Date;
  willArrive: boolean;
  reason?: string;
};

export type IPlayer = {
  id: number;
  name: string;
  createdAt: Date;
  registrations: IRegistrations[];
};

export type IPosition = {
  id: number;
  title: string;
  Player: IPlayer[];
};
