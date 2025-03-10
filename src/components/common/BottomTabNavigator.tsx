import EventsPage from '../../pages/EventsPage';
import MapPage from '../../pages/MapPage';
import ContactPage from '../../pages/ContactPage';
import PostPage from '../../pages/PostPage';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

export type BottomTabParamList = {
  Home: undefined;
  Events: undefined;
  Map: undefined;
  Contact: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

// Create the Tab Navigator for the main screens
const BottomTabNavigator = () => {
  const {colors} = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({color, size}) => {
          let iconName;

          // Set icons based on the route name
          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Events') {
            iconName = 'calendar-outline';
          } else if (route.name === 'Map') {
            iconName = 'map-outline';
          } else if (route.name === 'Contact') {
            iconName = 'chatbubble-ellipses-outline';
          } else {
            iconName = 'alert-circle-outline'; // Default icon if no match
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: '#ffffff',
          borderRadius: 25,
          height: 70,
          paddingBottom: 5,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 10},
          shadowOpacity: 0.12,
          shadowRadius: 10,
        },
        tabBarIconStyle: {
          marginTop: -15,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          position: 'absolute', // Ensures label is centered with the icon
          bottom: 10, // Vertical alignment of the label
        },
      })}>
      <Tab.Screen
        name="Home"
        component={PostPage}
      />
      <Tab.Screen
        name="Events"
        component={EventsPage}
        options={{ unmountOnBlur: true }}
      />
      <Tab.Screen
        name="Map"
        component={MapPage}
      />
      <Tab.Screen
        name="Contact"
        component={ContactPage}
      />
    </Tab.Navigator>
  );
};
export default BottomTabNavigator;
