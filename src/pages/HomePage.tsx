import { useNavigation, useTheme } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'; // Changed from NativeStackNavigationProp
import React from 'react';
import { Image, Linking, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/common/PrimaryButton';
import { BottomTabParamList } from '../NavigationManager';
import Menu from '../components/common/Menu';
import { SafeAreaView } from 'react-native-safe-area-context';

// Define the type for the navigation prop specific to this screen
type NavigationType = BottomTabNavigationProp<BottomTabParamList, 'Home'>; // Changed to BottomTabNavigationProp

const HomePage = () => {
  // const navigation = useNavigation<NavigationType>();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={styles.screenContainer}>
      <Menu />

      <Image
        source={require('../assets/images/LabLogo.png')}
        style={styles.labLogo}
      />
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.primary }]}>
          Welcome to Saikawa Lab
        </Text>
        <Text style={[styles.description, { color: colors.primary }]}>
          Where we try to understand the source and the magnitude of air and
          soil pollutants and work with community members to find solutions to
          different problems.
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <PrimaryButton
          title="Visit our Website"
          onPress={() => Linking.openURL('https://www.saikawalab.com/')}
          style={styles.buttons}
        />
        <PrimaryButton
          title="Events"
          onPress={() => navigation.navigate('Events')} // Navigate to the Events tab
          style={styles.buttons}
        />
        <PrimaryButton
          title="Map"
          onPress={() => navigation.navigate('Map')} // Navigate to the Map tab
          style={styles.buttons}
        />
        <PrimaryButton
          title="Infographics"
          onPress={() => navigation.navigate('Infographics')} // Navigate to the Infographics tab
          style={styles.buttons}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  labLogo: {
    width: '40%',
    height: 'auto',
    aspectRatio: 1,
    alignSelf: 'center',
    marginTop: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: 15,
  },
  buttons: {
    width: 200,
  },
});

export default HomePage;
