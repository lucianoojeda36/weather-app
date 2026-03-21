import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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
    borderRadius: wp(6.4),
    padding: wp(6.4),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  location: {
    color: '#FFFFFF',
    fontSize: wp(4.8),
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.9,
  },
  mainTemp: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(1),
    gap: wp(3.2),
  },
  weatherIcon: {
    fontSize: wp(17),
  },
  temperature: {
    fontSize: wp(21.3),
    fontWeight: '200',
    color: '#FFFFFF',
    letterSpacing: -wp(1.1),
  },
  description: {
    color: '#FFFFFF',
    fontSize: wp(5.3),
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: hp(0.5),
  },
  feelsLike: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: wp(3.7),
    textAlign: 'center',
    marginBottom: hp(2.5),
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2.7),
    justifyContent: 'center',
  },
  detailItem: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: wp(4.3),
    padding: wp(3.7),
    alignItems: 'center',
    width: wp(25),
    minWidth: wp(21.3),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  detailIcon: {
    fontSize: wp(5.9),
    marginBottom: hp(0.75),
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: wp(4),
    fontWeight: '700',
  },
  detailLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: wp(2.9),
    marginTop: hp(0.25),
  },
});

export default CurrentWeatherCard;
