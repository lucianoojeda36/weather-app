import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DailyData, getWeatherInfo } from '../types/weather';

interface Props {
  data: DailyData[];
}

const DailyForecast: React.FC<Props> = ({ data }) => {
  const { t } = useTranslation();
  const allMin = Math.min(...data.map((d) => d.tempMin));
  const allMax = Math.max(...data.map((d) => d.tempMax));
  const range = allMax - allMin || 1;

  const formatDay = (dateStr: string, index: number) => {
    if (index === 0) return t('forecast.today');
    if (index === 1) return t('forecast.tomorrow');
    const date = new Date(dateStr + 'T12:00:00');
    const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
    return t(`forecast.days.${dayKeys[date.getDay()]}`);
  };

  const getTempColor = (temp: number) => {
    if (temp <= 0) return '#74b9ff';
    if (temp <= 10) return '#81ecec';
    if (temp <= 20) return '#ffeaa7';
    if (temp <= 30) return '#fab1a0';
    return '#ff7675';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('forecast.next_7_days')}</Text>
      {data.map((day, index) => {
        const info = getWeatherInfo(day.weatherCode);
        const leftPct = ((day.tempMin - allMin) / range) * 100;
        const widthPct = ((day.tempMax - day.tempMin) / range) * 100;

        return (
          <View key={index} style={styles.dayRow}>
            <View style={styles.dayNameContainer}>
              <Text style={styles.dayName}>{formatDay(day.date, index)}</Text>
            </View>

            <View style={styles.dayIconContainer}>
              <Text style={styles.dayIcon}>{info.icon}</Text>
              {day.precipitationProb > 0 && (
                <Text style={styles.precipProb}>{day.precipitationProb}%</Text>
              )}
            </View>

            <Text style={styles.tempMinText}>{day.tempMin}°</Text>

            <View style={styles.barContainer}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      left: `${leftPct}%`,
                      width: `${Math.max(widthPct, 8)}%`,
                      backgroundColor: getTempColor((day.tempMax + day.tempMin) / 2),
                    } as any,
                  ]}
                />
              </View>
            </View>

            <Text style={styles.tempMaxText}>{day.tempMax}°</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 14,
    opacity: 0.9,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  dayNameContainer: {
    width: 60,
  },
  dayName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  dayIconContainer: {
    width: 55,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dayIcon: {
    fontSize: 22,
  },
  precipProb: {
    color: '#74b9ff',
    fontSize: 11,
    fontWeight: '600',
  },
  tempMinText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    fontWeight: '600',
    width: 36,
    textAlign: 'right',
  },
  barContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  barTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  barFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 3,
  },
  tempMaxText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    width: 36,
    textAlign: 'right',
  },
});

export default DailyForecast;
