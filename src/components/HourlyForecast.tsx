import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HourlyData, getWeatherInfo } from '../types/weather';

interface Props {
  data: HourlyData[];
}

const HourlyForecast: React.FC<Props> = ({ data }) => {
  const { t } = useTranslation();
  const formatHour = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.getHours().toString().padStart(2, '0') + ':00';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('forecast.next_24_hours')}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {data.map((hour, index) => {
          const info = getWeatherInfo(hour.weatherCode, hour.isDay);
          return (
            <View key={index} style={styles.hourItem}>
              <Text style={styles.hourTime}>
                {index === 0 ? t('forecast.now') : formatHour(hour.time)}
              </Text>
              <Text style={styles.hourIcon}>{info.icon}</Text>
              <Text style={styles.hourTemp}>{hour.temperature}°</Text>
            </View>
          );
        })}
      </ScrollView>
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
    // backdropFilter: 'blur(20px)',
    // WebkitBackdropFilter: 'blur(20px)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 14,
    opacity: 0.9,
  },
  scrollContent: {
    gap: 4,
  },
  hourItem: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    minWidth: 72,
  },
  hourTime: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '500',
  },
  hourIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  hourTemp: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default HourlyForecast;
