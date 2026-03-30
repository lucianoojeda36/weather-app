import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Props {
  visible: boolean;
  onAllow: () => void;
  onNotNow: () => void;
}

const LocationPermissionModal: React.FC<Props> = ({ visible, onAllow, onNotNow }) => {
  const { t } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible, fadeAnim]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onNotNow}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.card}>
          <Text style={styles.icon}>📍</Text>
          <Text style={styles.title}>{t('location.modal_title')}</Text>
          <Text style={styles.description}>{t('location.modal_description')}</Text>
          <TouchableOpacity style={styles.allowButton} onPress={onAllow} activeOpacity={0.8}>
            <Text style={styles.allowText}>{t('location.allow')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notNowButton} onPress={onNotNow} activeOpacity={0.7}>
            <Text style={styles.notNowText}>{t('location.not_now')}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(8),
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(15,12,41,0.92)',
    borderRadius: wp(5.3),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingVertical: hp(4),
    paddingHorizontal: wp(6.4),
    alignItems: 'center',
  },
  icon: {
    fontSize: wp(14),
    marginBottom: hp(1.5),
  },
  title: {
    fontSize: wp(5.9),
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: hp(1.2),
    letterSpacing: wp(0.15),
  },
  description: {
    fontSize: wp(4),
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: hp(2.8),
    marginBottom: hp(3.5),
  },
  allowButton: {
    width: '100%',
    height: hp(6.2),
    borderRadius: wp(4.3),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  allowText: {
    color: '#FFFFFF',
    fontSize: wp(4.3),
    fontWeight: '600',
    letterSpacing: wp(0.1),
  },
  notNowButton: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
  },
  notNowText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: wp(4),
  },
});

export default LocationPermissionModal;
