import { Tooltip, Typography } from '@mui/material';
import { hoursToSeconds, isAfter, parseJSON, subMinutes } from 'date-fns';
import { ExtendedEvent } from 'functions/event';
import Image from 'next/image';

import { LocationForecast } from 'types/MetApi';

const getCoordinates = (eventTypeSlug: ExtendedEvent['eventTypeSlug']) => {
  switch (eventTypeSlug) {
    case 'kamp':
      return { lat: 63.4053, lon: 10.3902 };
    case 'trening':
      return { lat: 63.4166, lon: 10.434 };
    case 'sosialt':
    default:
      return { lat: 63.4343, lon: 10.3974 };
  }
};

const getData = async (eventDetails: ExtendedEvent) => {
  const coordinates = getCoordinates(eventDetails.eventTypeSlug);
  const response = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${coordinates.lat}&lon=${coordinates.lon}`, {
    headers: {
      'User-Agent': 'https://pythons.tihlde.org, https://github.com/TIHLDE/pythons_event_registration',
    },
    next: { revalidate: hoursToSeconds(1) },
  });
  if (!response.ok) {
    return null;
  }
  const json = await response.json();
  const data = json as LocationForecast;
  const eventWeather = data.properties.timeseries.find(
    (timeserie) => isAfter(parseJSON(timeserie.time), subMinutes(eventDetails.time, 1)) && (timeserie.data.next_1_hours || timeserie.data.next_6_hours),
  );
  const weather = eventWeather?.data.next_1_hours ?? eventWeather?.data.next_6_hours;
  if (!eventWeather || !weather) {
    return null;
  }
  return {
    air_temperature: eventWeather.data.instant.details.air_temperature,
    wind_speed: eventWeather.data.instant.details.wind_speed,
    symbol: weather.summary.symbol_code,
    precipitation_amount: weather.details.precipitation_amount,
  };
};

export type EventWeatherProps = {
  eventDetails: ExtendedEvent;
};

const EventWeather = async ({ eventDetails }: EventWeatherProps) => {
  const data = await getData(eventDetails);
  if (!data) return null;

  return (
    <>
      <Tooltip title='Været ifølge yr.no'>
        <Image alt={data.symbol} height={24} src={`/weather-icon/${data.symbol}.svg`} style={{ filter: 'brightness(1.2)' }} width={24} />
      </Tooltip>
      <Typography variant='body1'>{`${data.precipitation_amount} mm • ${data.air_temperature}° • ${data.wind_speed} m/s`}</Typography>
    </>
  );
};

export default EventWeather;
