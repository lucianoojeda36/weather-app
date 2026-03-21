import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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
    borderRadius: wp(6.4),
    padding: wp(5.3),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: wp(4.3),
    fontWeight: '600',
    marginBottom: hp(1.7),
    opacity: 0.9,
  },
  scrollContent: {
    gap: wp(1.1),
  },
  hourItem: {
    alignItems: 'center',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3.7),
    borderRadius: wp(5.3),
    backgroundColor: 'rgba(255,255,255,0.06)',
    minWidth: wp(19.2),
  },
  hourTime: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: wp(3.5),
    marginBottom: hp(1),
    fontWeight: '500',
  },
  hourIcon: {
    fontSize: wp(7.5),
    marginBottom: hp(1),
  },
  hourTemp: {
    color: '#FFFFFF',
    fontSize: wp(4.3),
    fontWeight: '700',
  },
});

export default HourlyForecast;
