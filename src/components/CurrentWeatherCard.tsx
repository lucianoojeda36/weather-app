import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { WeatherData, getWeatherInfo } from '../types/weather';

interface Props {
  weather: WeatherData;
}

const DetailItem: React.FC<{ icon: string; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailIcon}>{icon}</Text>
    <Text style={styles.detailValue}>{value}</Text>
    <Text style={styles.detailLabel}>{label}</Text>
  </View>
);

const CurrentWeatherCard: React.FC<Props> = ({ weather }) => {
  const { t } = useTranslation();
  const { current, location, daily } = weather;
  const info = getWeatherInfo(current.weatherCode, current.isDay);
  const todaySunrise = daily[0]?.sunrise?.split('T')[1] || '--:--';
  const todaySunset = daily[0]?.sunset?.split('T')[1] || '--:--';

  return (
    <View style={styles.container}>
      <Text style={styles.location}>{location}</Text>

      <View style={styles.mainTemp}>
        <Text style={styles.weatherIcon}>{info.icon}</Text>
        <Text style={styles.temperature}>{current.temperature}°</Text>
      </View>

      <Text style={styles.description}>{t(info.description)}</Text>
      <Text style={styles.feelsLike}>
        {t('current.feels_like')} {current.feelsLike}° · {t('current.max')} {daily[0]?.tempMax}° · {t('current.min')}{' '}
        {daily[0]?.tempMin}°
      </Text>

      <View style={styles.detailsGrid}>
        <DetailItem icon="💧" label={t('current.humidity')} value={`${current.humidity}%`} />
        <DetailItem icon="💨" label={t('current.wind')} value={`${current.windSpeed} km/h`} />
        <DetailItem icon="🌧️" label={t('current.precipitation')} value={`${current.precipitation} mm`} />
        <DetailItem icon="🔵" label={t('current.pressure')} value={`${current.pressure} hPa`} />
        <DetailItem icon="☀️" label={t('current.uv_index')} value={`${current.uvIndex}`} />
        <DetailItem icon="👁️" label={t('current.visibility')} value={`${current.visibility} km`} />
        <DetailItem icon="🌅" label={t('current.sunrise')} value={todaySunrise} />
        <DetailItem icon="🌇" label={t('current.sunset')} value={todaySunset} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    // backdropFilter: 'blur(20px)',
    // WebkitBackdropFilter: 'blur(20px)',
  },
  location: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.9,
  },
  mainTemp: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    gap: 12,
  },
  weatherIcon: {
    fontSize: 64,
  },
  temperature: {
    fontSize: 80,
    fontWeight: '200',
    color: '#FFFFFF',
    letterSpacing: -4,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 4,
  },
  feelsLike: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  detailItem: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    width: '22%',
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  detailIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  detailLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    marginTop: 2,
  },
});

export default CurrentWeatherCard;
