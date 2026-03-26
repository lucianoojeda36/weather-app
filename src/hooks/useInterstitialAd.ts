import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { adConfig } from '../config';

const interstitial = InterstitialAd.createForAdRequest(adConfig.interstitialUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export function useInterstitialAd() {
  const adLoaded = useRef(false);
  const focusCount = useRef(0);
  const skipNextActive = useRef(false);

  useEffect(() => {
    focusCount.current = 1; // cold start cuenta como primer foco

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
        if (focusCount.current >= adConfig.frequency) {
          focusCount.current = 0;
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
