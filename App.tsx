import React, { useEffect } from 'react';
import mobileAds from 'react-native-google-mobile-ads';
import { useTranslation } from 'react-i18next';
import './src/i18n';

import { useWeather } from './src/hooks/useWeather';
import { useLocationPermission } from './src/hooks/useLocationPermission';
import { getWeatherInfo } from './src/types/weather';
import SearchBar from './src/components/SearchBar';
import CurrentWeatherCard from './src/components/CurrentWeatherCard';
import HourlyForecast from './src/components/HourlyForecast';
import DailyForecast from './src/components/DailyForecast';
import AdBanner from './src/components/AdBanner';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

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

  const { requestLocationPermission } = useLocationPermission();

  useEffect(() => {
    const initializeLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        fetchByGeolocation();
      }
    };

    initializeLocation();
  }, [fetchByGeolocation, requestLocationPermission]);

  const handleGeolocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      fetchByGeolocation();
    }
  };

  const bg = weather
    ? getBackground(weather.current.weatherCode, weather.current.isDay)
    : 'linear-gradient(180deg, #1976D2 0%, #42A5F5 50%, #BBDEFB 100%)';

  return (
    <View style={[styles.root, { backgroundImage: bg } as any]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleGeolocation}
            tintColor="#FFFFFF"
            colors={['#FFFFFF']}
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
            <Text style={styles.headerTitle}>ClimaApp</Text>
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
          {error && (
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
            <Text style={styles.footerText}>{t('app.footer')}</Text>
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
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 30,
  } as any,
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 10,
  },
  headerIcon: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: 'rgba(231,76,60,0.2)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(231,76,60,0.3)',
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 15,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default App;
