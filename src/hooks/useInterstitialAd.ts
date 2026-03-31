import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { adConfig } from '../config';

const FOCUS_COUNT_KEY = 'interstitial_focus_count';

const interstitial = InterstitialAd.createForAdRequest(adConfig.interstitialUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export function useInterstitialAd() {
  const adLoaded = useRef(false);
  const focusCount = useRef(0);
  const skipNextActive = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(FOCUS_COUNT_KEY).then((val) => {
      focusCount.current = val ? parseInt(val, 10) : 0;
    });

    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      adLoaded.current = true;
    });
    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      adLoaded.current = false;
      skipNextActive.current = true;
      interstitial.load();
    });
    interstitial.load();

    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        if (skipNextActive.current) {
          skipNextActive.current = false;
          return;
        }
        focusCount.current += 1;
        AsyncStorage.setItem(FOCUS_COUNT_KEY, String(focusCount.current));
        if (focusCount.current >= adConfig.frequency) {
          focusCount.current = 0;
          AsyncStorage.setItem(FOCUS_COUNT_KEY, '0');
          if (adLoaded.current) {
            interstitial.show();
          } else {
            const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
              unsubscribe();
              interstitial.show();
            });
          }
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      subscription.remove();
    };
  }, []);
}
