import {enableScreens} from 'react-native-screens';
enableScreens();

import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, useColorScheme} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import NavigationManager from './src/NavigationManager';
import {CustomDarkTheme, CustomLightTheme} from './src/globals';
import {getFcmToken, registerListenerWithFCM} from './src/utils/fcmHelper';
import notifee from '@notifee/react-native';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    getFcmToken();

    // Clear badge when the app is opened
    const resetBadge = async () => {
    await notifee.setBadgeCount(0);
  };
  resetBadge();
  
  }, []);

  useEffect(() => {
    const unsubscribe = registerListenerWithFCM();
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <NavigationContainer
        theme={isDarkMode ? CustomDarkTheme : CustomLightTheme}>
        <NavigationManager />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default App;
