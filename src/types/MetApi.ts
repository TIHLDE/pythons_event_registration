export type LocationForecast = {
  type: string;
  geometry: Geometry;
  properties: Properties;
};

export type Geometry = {
  type: string;
  coordinates: number[];
};

export type Properties = {
  meta: Meta;
  timeseries: Timeserie[];
};

export type Meta = {
  updated_at: Date;
  units: Units;
};

export type Units = {
  air_pressure_at_sea_level: string;
  air_temperature: string;
  cloud_area_fraction: string;
  precipitation_amount: string;
  relative_humidity: string;
  wind_from_direction: string;
  wind_speed: string;
};

export type Timeserie = {
  time: string;
  data: Data;
};

export type Data = {
  instant: Instant;
  next_12_hours?: Next12_Hours;
  next_1_hours?: NextHours;
  next_6_hours?: NextHours;
};

export type Instant = {
  details: InstantDetails;
};

export type InstantDetails = {
  air_pressure_at_sea_level: number;
  air_temperature: number;
  cloud_area_fraction: number;
  relative_humidity: number;
  wind_from_direction: number;
  wind_speed: number;
};

export type Next12_Hours = {
  summary: Summary;
};

export type Summary = {
  symbol_code: string;
};

export type NextHours = {
  summary: Summary;
  details: Next1_HoursDetails;
};

export type Next1_HoursDetails = {
  precipitation_amount: number;
};
