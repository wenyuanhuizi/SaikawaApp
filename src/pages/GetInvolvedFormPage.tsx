import React from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import StudentsForm from '../components/forms/students_form';
import OthersForm from '../components/forms/others_form';
import {useTheme, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createMaterialTopTabNavigator();

function GetInvolvedFormPage() {
  const {colors} = useTheme();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
        <View style={[styles.header, {borderBottomColor: '#ddd'}]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: colors.primary}]}>
            Get Involved
          </Text>
        </View>

        <Tab.Navigator
          initialRouteName="Students"
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarLabelStyle: styles.tabBarLabel,
            tabBarStyle: styles.tabBar,
            tabBarIndicatorStyle: {backgroundColor: colors.primary},
          }}>
          <Tab.Screen
            name="Students"
            component={StudentsForm}
            options={{tabBarLabel: 'Students'}}
          />
          <Tab.Screen
            name="Others"
            component={OthersForm}
            options={{tabBarLabel: 'Others'}}
          />
        </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'white',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  tabBar: {
    backgroundColor: 'white',
  },
  tabBarLabel: {
    fontSize: 13,
  },
});

export default GetInvolvedFormPage;
