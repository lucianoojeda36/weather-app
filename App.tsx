import React, { useEffect, useRef, useState } from 'react';
import mobileAds from 'react-native-google-mobile-ads';
import { useTranslation } from 'react-i18next';
import './src/i18n';
import { appVersion } from './src/config';

import { useWeather } from './src/hooks/useWeather';
import { useLocationPermission } from './src/hooks/useLocationPermission';
import { getWeatherInfo } from './src/types/weather';
import SearchBar from './src/components/SearchBar';
import CurrentWeatherCard from './src/components/CurrentWeatherCard';
import HourlyForecast from './src/components/HourlyForecast';
import DailyForecast from './src/components/DailyForecast';
import AdBanner from './src/components/AdBanner';
import SplashScreen from './src/components/SplashScreen';
import { useInterstitialAd } from './src/hooks/useInterstitialAd';
import { useInAppUpdate } from './src/hooks/useInAppUpdate';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Inicializar AdMob
mobileAds().initialize();


const getBackground = (code: number, isDay: boolean): string => {
  if (!isDay) return 'linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)';
  if (code <= 1) return 'linear-gradient(180deg, #2196F3 0%, #64B5F6 40%, #E3F2FD 100%)';
  if (code <= 3) return 'linear-gradient(180deg, #546E7A 0%, #90A4AE 50%, #CFD8DC 100%)';
  if (code >= 95) return 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
  if (code >= 61) return 'linear-gradient(180deg, #37474F 0%, #607D8B 50%, #90A4AE 100%)';
  if (code >= 51) return 'linear-gradient(180deg, #455A64 0%, #78909C 50%, #B0BEC5 100%)';
  if (code >= 71) return 'linear-gradient(180deg, #CFD8DC 0%, #ECEFF1 50%, #FFFFFF 100%)';
  return 'linear-gradient(180deg, #1976D2 0%, #42A5F5 50%, #BBDEFB 100%)';
};

const App: React.FC = () => {
  const { t } = useTranslation();
  const [splashVisible, setSplashVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const wasLoading = useRef(false);
  const {
    weather,
    loading,
    error,
    suggestions,
    searchCities,
    fetchByCity,
    fetchByGeolocation,
    setSuggestions,
  } = useWeather();

  const { requestLocationPermission, checkPermission, enableGPS } = useLocationPermission();
  useInterstitialAd();
  useInAppUpdate();

  const requestAndFetch = async () => {
    const alreadyGranted = await checkPermission();
    if (!alreadyGranted) {
      const granted = await requestLocationPermission();
      if (!granted) return;
    }
    const gpsOn = await enableGPS();
    if (gpsOn) {
      fetchByGeolocation();
    }
  };

  useEffect(() => {
    requestAndFetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGeolocation = () => requestAndFetch();

  const handleRefresh = async () => {
    setRefreshing(true);
    await requestAndFetch();
    if (!wasLoading.current) {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (loading) {
      wasLoading.current = true;
    } else if (wasLoading.current && refreshing) {
      wasLoading.current = false;
      setRefreshing(false);
    }
  }, [loading, refreshing]);

  const bg = weather
    ? getBackground(weather.current.weatherCode, weather.current.isDay)
    : 'linear-gradient(180deg, #1976D2 0%, #42A5F5 50%, #BBDEFB 100%)';

  if (splashVisible) {
    return (
      <SplashScreen onFinish={() => setSplashVisible(false)} />
    );
  }

  return (
    <View style={[styles.root, { backgroundImage: bg } as any]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#FFFFFF"
            colors={['#FFFFFF']}
            progressBackgroundColor="rgba(15, 12, 41, 0.85)"
          />
        }
      >
        <View style={styles.inner}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>
              {weather
                ? getWeatherInfo(weather.current.weatherCode, weather.current.isDay).icon
                : '🌤️'}
            </Text>
            <Text style={styles.headerTitle}>{t('app.title')}</Text>
          </View>

          {/* Search Bar */}
          <SearchBar
            onSearch={searchCities}
            suggestions={suggestions}
            onSelectCity={fetchByCity}
            onGeolocation={handleGeolocation}
            onClearSuggestions={() => setSuggestions([])}
          />

          {/* Loading */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>{t('app.loading')}</Text>
            </View>
          )}

          {/* Error */}
          {error && !loading && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Weather Data */}
          {weather && !loading && (
            <View>
              <CurrentWeatherCard weather={weather} />
              <HourlyForecast data={weather.hourly} />
              <DailyForecast data={weather.daily} />
            </View>
          )}

          {/* Empty State */}
          {!weather && !loading && !error && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🌍</Text>
              <Text style={styles.emptyTitle}>{t('app.welcome_title')}</Text>
              <Text style={styles.emptySubtitle}>{t('app.welcome_subtitle')}</Text>
            </View>
          )}

          {/* Banner publicitario */}
          <AdBanner />

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('app.footer', { version: appVersion })}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: '100vh',
    transition: 'background 0.8s ease',
    backgroundAttachment: 'fixed',
  } as any,
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  inner: {
    maxWidth: 500,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: wp(4.3),
    paddingTop: hp(6.2),
    paddingBottom: hp(3.7),
  } as any,
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(3),
    gap: wp(2.7),
  },
  headerIcon: {
    fontSize: wp(8.5),
  },
  headerTitle: {
    fontSize: wp(7.5),
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: wp(0.3),
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(9.9),
    gap: hp(2),
  },
  loadingText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: wp(4.3),
  },
  errorContainer: {
    backgroundColor: 'rgba(231,76,60,0.2)',
    borderRadius: wp(4.3),
    padding: wp(5.3),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(231,76,60,0.3)',
    marginBottom: hp(2),
  },
  errorIcon: {
    fontSize: wp(9.6),
    marginBottom: hp(1),
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: wp(4),
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(9.9),
  },
  emptyIcon: {
    fontSize: wp(19.2),
    marginBottom: hp(2),
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: wp(6.4),
    fontWeight: '700',
    marginBottom: hp(1),
  },
  emptySubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: wp(4.3),
    textAlign: 'center',
    maxWidth: wp(80),
    lineHeight: hp(3),
  },
  footer: {
    paddingVertical: hp(2.5),
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: wp(3.2),
    textAlign: 'center',
  },
});

export default App;
