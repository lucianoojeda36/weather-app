export interface WeatherData {
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    precipitation: number;
    pressure: number;
    uvIndex: number;
    visibility: number;
    isDay: boolean;
  };
  hourly: HourlyData[];
  daily: DailyData[];
  location: string;
}

export interface HourlyData {
  time: string;
  temperature: number;
  weatherCode: number;
  isDay: boolean;
}

export interface DailyData {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  precipitationProb: number;
  sunrise: string;
  sunset: string;
}

export interface GeoLocation {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export const weatherCodeMap: Record<number, { description: string; icon: string }> = {
  0: { description: 'weather.clear', icon: '☀️' },
  1: { description: 'weather.mostly_clear', icon: '🌤️' },
  2: { description: 'weather.partly_cloudy', icon: '⛅' },
  3: { description: 'weather.cloudy', icon: '☁️' },
  45: { description: 'weather.fog', icon: '🌫️' },
  48: { description: 'weather.icy_fog', icon: '🌫️' },
  51: { description: 'weather.light_drizzle', icon: '🌦️' },
  53: { description: 'weather.moderate_drizzle', icon: '🌦️' },
  55: { description: 'weather.heavy_drizzle', icon: '🌧️' },
  61: { description: 'weather.light_rain', icon: '🌧️' },
  63: { description: 'weather.moderate_rain', icon: '🌧️' },
  65: { description: 'weather.heavy_rain', icon: '🌧️' },
  66: { description: 'weather.light_freezing_rain', icon: '🌨️' },
  67: { description: 'weather.heavy_freezing_rain', icon: '🌨️' },
  71: { description: 'weather.light_snow', icon: '❄️' },
  73: { description: 'weather.moderate_snow', icon: '❄️' },
  75: { description: 'weather.heavy_snow', icon: '❄️' },
  77: { description: 'weather.hail', icon: '🌨️' },
  80: { description: 'weather.light_showers', icon: '🌦️' },
  81: { description: 'weather.moderate_showers', icon: '🌧️' },
  82: { description: 'weather.violent_showers', icon: '⛈️' },
  85: { description: 'weather.light_snow_showers', icon: '🌨️' },
  86: { description: 'weather.heavy_snow_showers', icon: '🌨️' },
  95: { description: 'weather.thunderstorm', icon: '⛈️' },
  96: { description: 'weather.thunderstorm_light_hail', icon: '⛈️' },
  99: { description: 'weather.thunderstorm_heavy_hail', icon: '⛈️' },
};

export const getWeatherInfo = (code: number, isDay: boolean = true) => {
  const info = weatherCodeMap[code] || { description: 'weather.unknown', icon: '❓' };
  if (!isDay && code <= 1) {
    return { ...info, icon: '🌙' };
  }
  return info;
};
