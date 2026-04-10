import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  WeatherData,
  GeoLocation,
  HourlyData,
  DailyData,
} from '../types/weather';
import Geolocation, { GeolocationResponse, GeolocationError } from '@react-native-community/geolocation';
import type GeolocationReturnType from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_LOCATION_KEY = 'last_location';

export const useWeather = () => {
  const { t } = useTranslation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);

  const searchCities = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=es`
      );
      const data = await res.json();
      setSuggestions(data.results || []);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const fetchWeather = useCallback(async (lat: number, lon: number, locationName: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure,uv_index,visibility,is_day` +
        `&hourly=temperature_2m,weather_code,is_day` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset` +
        `&timezone=auto&forecast_days=7`
      );
      const data = await res.json();

      const hourly: HourlyData[] = [];
      const nowHour = new Date().getHours();
      for (let i = 0; i < 24; i++) {
        const idx = nowHour + i;
        if (idx < data.hourly.time.length) {
          hourly.push({
            time: data.hourly.time[idx],
            temperature: Math.round(data.hourly.temperature_2m[idx]),
            weatherCode: data.hourly.weather_code[idx],
            isDay: data.hourly.is_day[idx] === 1,
          });
        }
      }

      const daily: DailyData[] = data.daily.time.map((t: string, i: number) => ({
        date: t,
        tempMax: Math.round(data.daily.temperature_2m_max[i]),
        tempMin: Math.round(data.daily.temperature_2m_min[i]),
        weatherCode: data.daily.weather_code[i],
        precipitationProb: data.daily.precipitation_probability_max[i],
        sunrise: data.daily.sunrise[i],
        sunset: data.daily.sunset[i],
      }));

      const weatherData: WeatherData = {
        current: {
          temperature: Math.round(data.current.temperature_2m),
          feelsLike: Math.round(data.current.apparent_temperature),
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m),
          weatherCode: data.current.weather_code,
          precipitation: data.current.precipitation,
          pressure: Math.round(data.current.surface_pressure),
          uvIndex: Math.round(data.current.uv_index),
          visibility: Math.round(data.current.visibility / 1000),
          isDay: data.current.is_day === 1,
        },
        hourly,
        daily,
        location: locationName,
      };

      setWeather(weatherData);
      setSuggestions([]);
      AsyncStorage.setItem(LAST_LOCATION_KEY, JSON.stringify({ lat, lon, locationName }));
    } catch {
      setError(t('errors.weather_fetch'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(LAST_LOCATION_KEY).then(stored => {
      if (stored) {
        const { lat, lon, locationName } = JSON.parse(stored);
        fetchWeather(lat, lon, locationName);
      }
    });
  // fetchWeather is stable (useCallback with [] deps), safe to omit
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchByCity = useCallback((city: GeoLocation) => {
    const name = city.admin1
      ? `${city.name}, ${city.admin1}, ${city.country}`
      : `${city.name}, ${city.country}`;
    fetchWeather(city.latitude, city.longitude, name);
  }, [fetchWeather]);

  const fetchByGeolocation = useCallback(() => {
    setLoading(true);
    let successCalled = false;

    const onSuccess = (position: GeolocationResponse) => {
      successCalled = true;
      fetchWeather(position.coords.latitude, position.coords.longitude, t('location.my_location'));
    };

    const onError = (err: GeolocationError) => {
      if (successCalled) return;

      if (err.code === err.TIMEOUT || err.code === err.POSITION_UNAVAILABLE) {
        Geolocation.getCurrentPosition(
          onSuccess,
          (fallbackErr) => {
            if (successCalled) return;
            let errorMessage = t('errors.location_default');
            switch (fallbackErr.code) {
              case fallbackErr.PERMISSION_DENIED:
                errorMessage = t('errors.permission_denied');
                break;
              case fallbackErr.POSITION_UNAVAILABLE:
                errorMessage = t('errors.position_unavailable');
                break;
              case fallbackErr.TIMEOUT:
                errorMessage = t('errors.timeout');
                break;
            }
            setError(errorMessage);
            setLoading(false);
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
        );
        return;
      }

      let errorMessage = t('errors.location_default');
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = t('errors.permission_denied');
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = t('errors.position_unavailable');
          break;
        case err.TIMEOUT:
          errorMessage = t('errors.timeout');
          break;
      }
      setError(errorMessage);
      setLoading(false);
    };

    Geolocation.getCurrentPosition(
      onSuccess,
      onError,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
    );
  }, [fetchWeather]);

  return {
    weather,
    loading,
    error,
    suggestions,
    searchCities,
    fetchByCity,
    fetchByGeolocation,
    setSuggestions,
  };
};
