import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import type { HexColor } from 'react-native-android-widget';

export interface WeatherWidgetProps {
  temperature: number;
  feelsLike: number;
  humidity: number;
  weatherCode: number;
  city: string;
}

interface ThemeColors {
  bg: HexColor;
  accent: HexColor;
  muted: HexColor;
}

function getTheme(code: number): ThemeColors {
  if (code === 0 || code === 1) {
    return { bg: '#0D3B6E', accent: '#FFD54F', muted: '#90CAF9' }; // sunny → golden
  }
  if (code <= 3) {
    return { bg: '#1C2B3A', accent: '#B0BEC5', muted: '#78909C' }; // cloudy → slate
  }
  if (code <= 48) {
    return { bg: '#1A2A3A', accent: '#90A4AE', muted: '#607D8B' }; // fog → grey-blue
  }
  if (code <= 67) {
    return { bg: '#0A2540', accent: '#4FC3F7', muted: '#29B6F6' }; // rain → teal-blue
  }
  if (code <= 77) {
    return { bg: '#1A2C4A', accent: '#E3F2FD', muted: '#BBDEFB' }; // snow → pale blue
  }
  if (code <= 86) {
    return { bg: '#152035', accent: '#B3E5FC', muted: '#81D4FA' }; // snow showers
  }
  return { bg: '#1A1035', accent: '#CE93D8', muted: '#BA68C8' }; // storm → purple
}

function weatherEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code === 1) return '🌤️';
  if (code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 55) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}

function weatherLabel(code: number): string {
  if (code === 0) return 'Despejado';
  if (code === 1) return 'Mayormente despejado';
  if (code === 2) return 'Parcialmente nublado';
  if (code === 3) return 'Nublado';
  if (code <= 48) return 'Niebla';
  if (code <= 55) return 'Llovizna';
  if (code <= 67) return 'Lluvia';
  if (code <= 77) return 'Nieve';
  if (code <= 82) return 'Chubascos';
  if (code <= 86) return 'Nieve con viento';
  return 'Tormenta';
}

export function WeatherWidget({
  temperature,
  feelsLike,
  humidity,
  weatherCode,
  city,
}: WeatherWidgetProps) {
  const theme = getTheme(weatherCode);

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: theme.bg,
        borderRadius: 20,
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      {/* Top: city name */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: 'match_parent',
        }}
      >
        <TextWidget
          text="📍 "
          style={{ fontSize: 11, color: theme.muted }}
        />
        <TextWidget
          text={city}
          style={{
            fontSize: 12,
            color: theme.muted,
            fontWeight: '600',
          }}
          maxLines={1}
        />
      </FlexWidget>

      {/* Center: emoji + temperature */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: 'match_parent',
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        <TextWidget
          text={`${temperature}°`}
          style={{
            fontSize: 52,
            color: '#FFFFFF',
            fontWeight: '200',
          }}
        />
        <TextWidget
          text={weatherEmoji(weatherCode)}
          style={{ fontSize: 40 }}
        />
      </FlexWidget>

      {/* Bottom: condition + feels like + humidity */}
      <FlexWidget
        style={{
          flexDirection: 'column',
          width: 'match_parent',
        }}
      >
        <TextWidget
          text={weatherLabel(weatherCode)}
          style={{
            fontSize: 12,
            color: theme.accent,
            fontWeight: '500',
          }}
        />
        <FlexWidget
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 'match_parent',
            paddingTop: 4,
          }}
        >
          <TextWidget
            text={`ST ${feelsLike}°`}
            style={{ fontSize: 11, color: theme.muted }}
          />
          <TextWidget
            text={`💧 ${humidity}%`}
            style={{ fontSize: 11, color: theme.muted }}
          />
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}
