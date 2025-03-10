import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SensorDataPage from './pages/SensorDataPage';
import IntroScreen from './components/IntroScreen/Intro';
import BottomTabNavigator from './components/common/BottomTabNavigator';
import GetInvolvedFormPage from './pages/GetInvolvedFormPage';
import AppFeedbackPage from './pages/AppFeedbackPage';
import EnvReportPage from './pages/EnvReportPage';
import SinglePostPage from './pages/SinglePostPage';
import {SensorData} from './services/SensorLocationService';

// Define the types for the navigation stack
export type RootStackParamList = {
  Tabs: undefined;
  Intro: undefined;
  Sensor: {sensorData: SensorData};
  GetInvolvedFormPage: undefined;
  AppFeedbackPage: undefined;
  EnvReportPage: undefined;
  SinglePostPage: {postID: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const NavigationManager = () => {
  return (
    <Stack.Navigator
      initialRouteName="Intro"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Intro" component={IntroScreen} />
      <Stack.Screen name="Tabs" component={BottomTabNavigator} />
      <Stack.Screen name="Sensor" component={SensorDataPage} />
      <Stack.Screen
        name="GetInvolvedFormPage"
        component={GetInvolvedFormPage}
      />
      <Stack.Screen name="AppFeedbackPage" component={AppFeedbackPage} />
      <Stack.Screen name="EnvReportPage" component={EnvReportPage} />
      <Stack.Screen name="SinglePostPage" component={SinglePostPage} />
    </Stack.Navigator>
  );
};

export default NavigationManager;
