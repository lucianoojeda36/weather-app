import Config from 'react-native-config';
import { TestIds } from 'react-native-google-mobile-ads';

export const appVersion = Config.APP_VERSION ?? '0.0.1';
export const appVersionCode = parseInt(Config.APP_VERSION_CODE ?? '1', 10);

export const adConfig = {
  frequency: parseInt(Config.AD_FREQUENCY ?? '2', 10),
  bannerUnitId: Config.AD_BANNER_UNIT_ID ?? TestIds.BANNER,
  interstitialUnitId: Config.AD_INTERSTITIAL_UNIT_ID ?? TestIds.INTERSTITIAL,
};
