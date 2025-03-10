import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { RootStackParamList } from '../../NavigationManager';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; 

const { width, height } = Dimensions.get('window');

const logo = require('../../assets/images/LabLogo.png'); // Fixed logo import path

// Define navigation prop type
type IntroScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

interface Props {
  navigation: IntroScreenNavigationProp;
}

const IntroScreen: React.FC<Props> = ({ navigation }) => {
  const opacity = useSharedValue(0); // Control the opacity of the logo

  useEffect(() => {
    // Animate opacity to fade in
    opacity.value = withTiming(1, { duration: 1000 });

    const timer = setTimeout(() => {
      navigation.replace('Tabs'); // Replace with your main screen name
    }, 3000);

    // Cleanup timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [navigation, opacity]);

  // Animated style to fade the logo in
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <Image source={logo} style={styles.logo} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: width * 0.6, // Adjust based on your logo size
    height: height * 0.3, // Adjust based on your logo size
    resizeMode: 'contain',
  },
});

export default IntroScreen;
