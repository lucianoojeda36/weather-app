import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.7)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrada: icono y título (0ms)
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
    ]).start();

    // Tagline aparece tras la entrada (900ms)
    const t1 = setTimeout(() => {
      Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }, 900);

    // Dots aparecen (1400ms)
    const t2 = setTimeout(() => {
      Animated.timing(dotsOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, 1400);

    // Salida: todo se desvanece (1800ms + 2500ms pausa = 4300ms)
    const t3 = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(taglineOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(dotsOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start(() => onFinish());
    }, 4300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [opacity, scale, taglineOpacity, dotsOpacity, onFinish]);

  return (
    <View style={styles.container}>
      {/* Estrellas decorativas */}
      <View style={styles.starsTop}>
        <Text style={styles.star}>✦</Text>
        <Text style={[styles.star, styles.starSmall]}>·</Text>
        <Text style={styles.star}>✦</Text>
        <Text style={[styles.star, styles.starSmall]}>·</Text>
        <Text style={styles.star}>✦</Text>
        <Text style={[styles.star, styles.starSmall]}>·</Text>
        <Text style={styles.star}>✦</Text>
      </View>

      {/* Contenido central */}
      <View style={styles.center}>
        <Animated.Text style={[styles.icon, { opacity, transform: [{ scale }] }]}>
          ☀️
        </Animated.Text>

        <Animated.Text style={[styles.title, { opacity, transform: [{ scale }] }]}>
          ClimaApp
        </Animated.Text>

        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Tu cielo, siempre contigo
        </Animated.Text>

        <Animated.View style={[styles.dotsRow, { opacity: dotsOpacity }]}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotMid]} />
          <View style={styles.dot} />
        </Animated.View>
      </View>

      {/* Nubes decorativas */}
      <View style={styles.cloudsBottom}>
        <Text style={[styles.cloud, styles.cloudLeft]}>☁️</Text>
        <Text style={[styles.cloud, styles.cloudCenter]}>☁️</Text>
        <Text style={[styles.cloud, styles.cloudRight]}>☁️</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundImage: 'linear-gradient(180deg, #0a0a2e 0%, #1a1a6e 35%, #c04a1a 70%, #e8a020 100%)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  } as any,
  starsTop: {
    position: 'absolute',
    top: hp(8),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: wp(5),
  },
  star: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: wp(4.5),
  },
  starSmall: {
    fontSize: wp(3),
    color: 'rgba(255,255,255,0.4)',
  },
  center: {
    alignItems: 'center',
    gap: hp(1.5),
  },
  icon: {
    fontSize: wp(22),
    marginBottom: hp(1),
  },
  title: {
    fontSize: wp(11),
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: wp(0.8),
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  tagline: {
    fontSize: wp(4.5),
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: wp(0.15),
    fontStyle: 'italic',
    marginTop: hp(0.5),
  },
  dotsRow: {
    flexDirection: 'row',
    gap: wp(2.5),
    marginTop: hp(2),
  },
  dot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotMid: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: wp(2.5),
    height: wp(2.5),
    borderRadius: wp(1.25),
  },
  cloudsBottom: {
    position: 'absolute',
    bottom: hp(8),
    left: 0,
    right: 0,
  },
  cloud: {
    position: 'absolute',
    fontSize: wp(10),
    opacity: 0.35,
  },
  cloudLeft: {
    left: wp(5),
    bottom: 0,
    fontSize: wp(8),
    opacity: 0.25,
  },
  cloudCenter: {
    left: '42%',
    bottom: hp(3),
    fontSize: wp(12),
    opacity: 0.3,
  },
  cloudRight: {
    right: wp(8),
    bottom: hp(1),
    fontSize: wp(9),
    opacity: 0.25,
  },
});

export default SplashScreen;
