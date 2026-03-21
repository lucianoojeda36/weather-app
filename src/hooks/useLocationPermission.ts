import { useState, useCallback } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { useTranslation } from 'react-i18next';

export const useLocationPermission = () => {
  const { t } = useTranslation();
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'not-requested'>('not-requested');

  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    // iOS permissions are handled through Info.plist
    if (Platform.OS === 'ios') {
      setPermissionStatus('granted');
      return true;
    }

    // Android: Request runtime permissions
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: t('location.permission_title'),
            message: t('location.permission_message'),
            buttonNeutral: t('location.ask_later'),
            buttonNegative: t('location.cancel'),
            buttonPositive: t('location.allow'),
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionStatus('granted');
          return true;
        } else {
          setPermissionStatus('denied');
          return false;
        }
      } catch (err) {
        console.warn('Error requesting location permission:', err);
        setPermissionStatus('denied');
        return false;
      }
    }

    // Default for web or other platforms
    setPermissionStatus('granted');
    return true;
  }, []);

  const checkPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      return true;
    }

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        setPermissionStatus(granted ? 'granted' : 'denied');
        return granted;
      } catch (err) {
        console.warn('Error checking location permission:', err);
        return false;
      }
    }

    return true;
  }, []);

  return {
    permissionStatus,
    requestLocationPermission,
    checkPermission,
  };
};
