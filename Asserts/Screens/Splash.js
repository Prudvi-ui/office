import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';

const Splash = ({ navigation }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateAndNavigate = () => {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        navigation.replace('Login');
      }, 2000);
    };

    animateAndNavigate();
  }, [navigation, scaleValue]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          { transform: [{ scale: scaleValue }] }
        ]}
      >
        <Image
          source={require('../Images/MaberuLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C1247',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default Splash;
