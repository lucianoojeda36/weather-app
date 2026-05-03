import React from 'react';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherWidget } from './WeatherWidget';

const LAST_LOCATION_KEY = 'last_location';
const WIDGET_DATA_KEY = 'widget_weather_data';

export interface WidgetWeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  weatherCode: number;
  city: string;
}

async function fetchWeatherForWidget(lat: number, lon: number): Promise<Omit<WidgetWeatherData, 'city'>> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code` +
    `&timezone=auto`
  );
  const data = await res.json();
  return {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    weatherCode: data.current.weather_code,
  };
}

async function getWidgetData(): Promise<WidgetWeatherData> {
  // Try cached widget data first (written by main app when it fetches weather)
  const cached = await AsyncStorage.getItem(WIDGET_DATA_KEY);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fall back to fetching from API using last known location
  const stored = await AsyncStorage.getItem(LAST_LOCATION_KEY);
  if (stored) {
    const { lat, lon, locationName } = JSON.parse(stored);
    const weather = await fetchWeatherForWidget(lat, lon);
    return { ...weather, city: locationName };
  }

  return { temperature: 0, feelsLike: 0, humidity: 0, weatherCode: 0, city: '—' };
}

registerWidgetTaskHandler(async ({ widgetAction, renderWidget }) => {
  if (widgetAction === 'WIDGET_DELETED') {
    return;
  }

  const data = await getWidgetData();
  renderWidget(
    React.createElement(WeatherWidget, {
      temperature: data.temperature,
      feelsLike: data.feelsLike,
      humidity: data.humidity,
      weatherCode: data.weatherCode,
      city: data.city,
    })
  );
});
