import { useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import SpInAppUpdates, {
  IAUUpdateKind,
} from 'sp-react-native-in-app-updates';
import { appVersion } from '../config';

const IOS_BUNDLE_ID = 'com.loj.weatherapp';

const compareVersions = (current: string, store: string): boolean => {
  const parse = (v: string) => v.split('.').map(Number);
  const [c, s] = [parse(current), parse(store)];
  for (let i = 0; i < Math.max(c.length, s.length); i++) {
    if ((s[i] ?? 0) > (c[i] ?? 0)) { return true; }
    if ((s[i] ?? 0) < (c[i] ?? 0)) { return false; }
  }
  return false;
};

export const useInAppUpdate = () => {
  const { t } = useTranslation();

  useEffect(() => {
    if (Platform.OS === 'android') {
      checkAndroid();
    } else if (Platform.OS === 'ios') {
      checkIOS();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAndroid = async () => {
    try {
      const inAppUpdates = new SpInAppUpdates(false);
      const result = await inAppUpdates.checkNeedsUpdate();
      if (result.shouldUpdate) {
        inAppUpdates.startUpdate({ updateType: IAUUpdateKind.IMMEDIATE });
      }
    } catch (e) {
      if (__DEV__) { console.warn('[useInAppUpdate] Android:', e); }
    }
  };

  const checkIOS = async () => {
    try {
      const res = await fetch(
        `https://itunes.apple.com/lookup?bundleId=${IOS_BUNDLE_ID}`
      );
      const data = await res.json();
      if (data.resultCount < 1) { return; }
      const storeVersion: string = data.results[0].version;
      const storeUrl: string = data.results[0].trackViewUrl;
      if (!compareVersions(appVersion, storeVersion)) { return; }
      Alert.alert(t('update.title'), t('update.message'), [
        { text: t('update.button_later'), style: 'cancel' },
        { text: t('update.button_update'), onPress: () => Linking.openURL(storeUrl) },
      ]);
    } catch (e) {
      if (__DEV__) { console.warn('[useInAppUpdate] iOS:', e); }
    }
  };
};
